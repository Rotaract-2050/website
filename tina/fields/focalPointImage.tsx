import * as React from 'react';
import { ImageField } from 'tinacms';

type FocalPointProps = Parameters<typeof ImageField>[0];

// Tina field names are the full dotted/indexed form path (e.g. "blocks.0.slides.0.image"),
// not just the field's own short name — confirmed in tinacms' bundled toolkit (list items
// join with `.${index}`, object sub-fields join with `.${name}`, same separator either way).
// Swapping the trailing "image"/"photo" for "imageFocalX" therefore works at any nesting depth.
function siblingFieldName(fullName: string, shortName: string, suffix: 'FocalX' | 'FocalY') {
	const base = fullName.slice(0, fullName.length - shortName.length);
	return `${base}${shortName}${suffix}`;
}

// Wraps Tina's default image field with a click-to-set focal point: the point kept visible
// when the block's CSS crops the photo with object-fit: cover. Stored in two hidden sibling
// number fields (see focalImageFields() below) rather than a real crop rectangle — Tina has
// no built-in crop UI (see rotaract2050-site skill), this is the documented "hidden meta-fields"
// pattern (tina.io/docs/extending-tina/custom-field-components) applied to a focal point instead
// of width/height.
export function createFocalPointImageField(shortName: string) {
	return function FocalPointImageField(props: FocalPointProps) {
		const { field, input, form } = props;
		const url = typeof input.value === 'string' ? input.value : undefined;
		const xName = siblingFieldName(field.name, shortName, 'FocalX');
		const yName = siblingFieldName(field.name, shortName, 'FocalY');
		const x = (form.getFieldState(xName)?.value as number | undefined) ?? 50;
		const y = (form.getFieldState(yName)?.value as number | undefined) ?? 50;

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
								// Quoted + percent-encoded: an unquoted CSS url() breaks on a literal space
								// or paren in the value, and uploaded filenames routinely have both (Tina
								// keeps the original filename, e.g. "Disegna il tuo futuro.png") — the <img>
								// tag above doesn't have this problem, only this raw CSS string does.
								backgroundImage: `url("${encodeURI(url)}")`,
								backgroundSize: 'cover',
								backgroundPosition: `${x}% ${y}%`,
								borderRadius: '6px',
								cursor: 'crosshair',
								border: '1px solid #e1ddec',
							}}
						>
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
					</div>
				)}
			</div>
		);
	};
}

// Generates the 3 field defs for an image slot with a focal point: the visible image field
// (custom UI above) plus two hidden number fields storing the click position (0-100, percent
// from top-left) — read by Astro components as CSS object-position. Spread in place of a plain
// `{ type: 'image', name, label }` field.
export function focalImageFields(name: string, label: string) {
	return [
		{
			type: 'image' as const,
			name,
			label,
			// @tinacms/schema-tools' declared `ui.component` type only lists {field, input, meta} —
			// it's missing `form`, even though Tina always passes it at runtime (confirmed against
			// tina.io's own "hidden meta-fields" example, which reads props.form the same way, and
			// against the actual bundled toolkit's FieldProps type). The cast bridges that gap in
			// Tina's own public types; it does not loosen anything checked in this project's code.
			ui: { component: createFocalPointImageField(name) as any },
		},
		{ type: 'number' as const, name: `${name}FocalX`, ui: { component: 'hidden' as const } },
		{ type: 'number' as const, name: `${name}FocalY`, ui: { component: 'hidden' as const } },
	];
}
