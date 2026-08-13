import * as React from 'react';
import { ImageField } from 'tinacms';

type FocalPointProps = Parameters<typeof ImageField>[0];

// Tina field names are the full dotted/indexed form path (e.g. "blocks.0.slides.0.image"),
// not just the field's own short name — confirmed in tinacms' bundled toolkit (list items
// join with `.${index}`, object sub-fields join with `.${name}`, same separator either way).
// Swapping the trailing "image"/"photo" for "imageFocalX" therefore works at any nesting depth.
function siblingFieldName(fullName: string, shortName: string, suffix: 'FocalX' | 'FocalY' | 'Zoom') {
	const base = fullName.slice(0, fullName.length - shortName.length);
	return `${base}${shortName}${suffix}`;
}

const MIN_ZOOM = 100;
const MAX_ZOOM = 300;

// Wraps Tina's default image field with a click-to-set focal point: the point kept visible
// when the block's CSS crops the photo with object-fit: cover. Stored in two hidden sibling
// number fields (see focalImageFields() below) rather than a real crop rectangle — Tina has
// no built-in crop UI (see rotaract2050-site skill), this is the documented "hidden meta-fields"
// pattern (tina.io/docs/extending-tina/custom-field-components) applied to a focal point instead
// of width/height. When `withZoom` is set, an extra hidden sibling ("...Zoom", 100-300%) lets the
// editor scale the photo around that focal point — plain repositioning isn't enough for source
// photos where the face only fills a small fraction of the frame (e.g. full-body team portraits).
export function createFocalPointImageField(shortName: string, withZoom = false) {
	return function FocalPointImageField(props: FocalPointProps) {
		const { field, input, form } = props;
		const url = typeof input.value === 'string' ? input.value : undefined;
		const xName = siblingFieldName(field.name, shortName, 'FocalX');
		const yName = siblingFieldName(field.name, shortName, 'FocalY');
		const zoomName = siblingFieldName(field.name, shortName, 'Zoom');
		const x = (form.getFieldState(xName)?.value as number | undefined) ?? 50;
		const y = (form.getFieldState(yName)?.value as number | undefined) ?? 50;
		const zoom = (form.getFieldState(zoomName)?.value as number | undefined) ?? MIN_ZOOM;

		const handlePick = (event: React.MouseEvent<HTMLDivElement>) => {
			const rect = event.currentTarget.getBoundingClientRect();
			const nextX = Math.round(((event.clientX - rect.left) / rect.width) * 100);
			const nextY = Math.round(((event.clientY - rect.top) / rect.height) * 100);
			form.change(xName, Math.min(100, Math.max(0, nextX)));
			form.change(yName, Math.min(100, Math.max(0, nextY)));
		};

		return (
			<div>
				{ImageField(props)}
				{url && (
					<div style={{ marginTop: '8px' }}>
						<p style={{ fontSize: '12px', color: '#535262', margin: '0 0 6px' }}>
							Clicca sul punto della foto da mantenere sempre visibile quando viene tagliata.
						</p>
						<div
							onClick={handlePick}
							style={{
								position: 'relative',
								width: '100%',
								paddingBottom: '56.25%',
								overflow: 'hidden',
								borderRadius: '6px',
								cursor: 'crosshair',
								border: '1px solid #e1ddec',
							}}
						>
							<div
								style={{
									position: 'absolute',
									inset: 0,
									backgroundImage: `url(${url})`,
									backgroundSize: 'cover',
									backgroundPosition: `${x}% ${y}%`,
									transform: withZoom ? `scale(${zoom / 100})` : undefined,
									transformOrigin: `${x}% ${y}%`,
								}}
							/>
							<div
								style={{
									position: 'absolute',
									left: `${x}%`,
									top: `${y}%`,
									width: '16px',
									height: '16px',
									marginLeft: '-8px',
									marginTop: '-8px',
									borderRadius: '50%',
									border: '2px solid #fff',
									boxShadow: '0 0 0 1px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.4)',
									background: '#EC4815',
									pointerEvents: 'none',
								}}
							/>
						</div>
						{withZoom && (
							<div style={{ marginTop: '8px' }}>
								<label style={{ fontSize: '12px', color: '#535262' }}>
									Zoom sul volto: {zoom}%
									<input
										type="range"
										min={MIN_ZOOM}
										max={MAX_ZOOM}
										step={5}
										value={zoom}
										onChange={(event) => form.change(zoomName, Number(event.target.value))}
										style={{ display: 'block', width: '100%', marginTop: '4px' }}
									/>
								</label>
							</div>
						)}
					</div>
				)}
			</div>
		);
	};
}

// Generates the field defs for an image slot with a focal point: the visible image field
// (custom UI above) plus hidden number fields storing the click position (0-100, percent from
// top-left) and, when `zoom` is set, a zoom percentage (100-300) — read by Astro components as
// CSS object-position / transform: scale. Spread in place of a plain `{ type: 'image', name,
// label }` field. Pass `{ zoom: true }` only for slots cropped into a small fixed box (e.g. the
// circular team-roster avatars) — it's clutter on slots like hero backgrounds that already show
// the full photo.
export function focalImageFields(name: string, label: string, options?: { zoom?: boolean }) {
	const zoom = options?.zoom ?? false;
	const imageField = {
		type: 'image' as const,
		name,
		label,
		// @tinacms/schema-tools' declared `ui.component` type only lists {field, input, meta} —
		// it's missing `form`, even though Tina always passes it at runtime (confirmed against
		// tina.io's own "hidden meta-fields" example, which reads props.form the same way, and
		// against the actual bundled toolkit's FieldProps type). The cast bridges that gap in
		// Tina's own public types; it does not loosen anything checked in this project's code.
		ui: { component: createFocalPointImageField(name, zoom) as any },
	};
	const focalXField = { type: 'number' as const, name: `${name}FocalX`, ui: { component: 'hidden' as const } };
	const focalYField = { type: 'number' as const, name: `${name}FocalY`, ui: { component: 'hidden' as const } };
	const zoomField = { type: 'number' as const, name: `${name}Zoom`, ui: { component: 'hidden' as const } };
	return zoom ? [imageField, focalXField, focalYField, zoomField] : [imageField, focalXField, focalYField];
}
