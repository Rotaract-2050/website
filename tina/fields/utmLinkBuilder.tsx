import * as React from 'react';
import { wrapFieldsWithMeta } from 'tinacms';

// Public origin of the site — the links are pasted on Instagram/WhatsApp/emails, so they must
// always point at production, never at the host the Tina admin happens to be opened on
// (localhost, a preview Worker...). Same value as SITE in astro.config.mjs.
const SITE = 'https://rotaract2050.org';

// One row per place a link gets shared. `source`/`medium` follow GA4's default channel rules
// (medium "social" → Organic Social, "email" → Email, "referral" → Referral), so each row lands
// in the right channel of the Acquisizione report with no extra GA4 configuration. To add a
// channel (e.g. Facebook, QR code on a flyer), add a row here — nothing else needs to change.
const CHANNELS = [
	{ label: 'Instagram', source: 'instagram', medium: 'social' },
	{ label: 'WhatsApp', source: 'whatsapp', medium: 'social' },
	{ label: 'Sito web', source: 'website', medium: 'referral' },
	{ label: 'Convocazione', source: 'convocazione', medium: 'email' },
] as const;

type Lang = 'it' | 'en';

// Only the part of Tina's field props this component reads. `tinaForm` is passed at runtime to
// every field (FieldProps in tinacms' toolkit) but, like `form` in focalPointImage.tsx, it is
// missing from the public `ui.component` type — hence the cast where the field is declared.
interface UtmLinkBuilderProps {
	tinaForm: { id: string; crudType?: 'create' | 'update' };
}

// Tina's create form has a placeholder id (".../new-post.md") — the real filename, and so the
// public URL, only exists once the event has been saved the first time.
const EVENTS_PATH = /src\/content\/events\/(.+)\.md$/;

function buildUtmUrl(path: string, lang: Lang, source: string, medium: string, campaign: string) {
	const url = new URL(`${lang === 'en' ? '/en' : ''}/eventi/${path}`, SITE);
	url.searchParams.set('utm_source', source);
	url.searchParams.set('utm_medium', medium);
	url.searchParams.set('utm_campaign', campaign);
	return url.toString();
}

async function copyText(text: string) {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		// Clipboard API is unavailable outside a secure context or when permission is denied —
		// the editor can still select the read-only input by hand.
		return false;
	}
}

// Read-only helper shown in the event editor: builds the event's public URL tagged with UTM
// parameters for each sharing channel, with a copy button per row. It stores nothing — the
// backing `utmLinks` string field is never written, so no key ends up in the event frontmatter.
// `utm_campaign` is the event's filename, so GA4 → Acquisizione → "Campagna sessione" shows
// one row per event, split by source/medium. The landing-page side (keeping the utm_* values
// until cookie consent) lives in src/components/CookieConsent.astro.
function UtmLinkBuilderInput({ tinaForm }: UtmLinkBuilderProps) {
	const [lang, setLang] = React.useState<Lang>('it');
	const [copied, setCopied] = React.useState<string | null>(null);

	const match = tinaForm.crudType === 'create' ? null : EVENTS_PATH.exec(tinaForm.id);
	if (!match) {
		return (
			<p style={{ fontSize: '13px', color: '#535262', margin: 0 }}>
				Salva l'evento una prima volta: i link tracciati compaiono qui appena l'evento ha il suo indirizzo definitivo.
			</p>
		);
	}

	const path = match[1];
	const campaign = path.split('/').pop()!.toLowerCase();

	const handleCopy = async (key: string, url: string) => {
		if (await copyText(url)) {
			setCopied(key);
			window.setTimeout(() => setCopied((current) => (current === key ? null : current)), 2000);
		}
	};

	return (
		<div style={{ width: '100%' }}>
			<div style={{ display: 'flex', gap: '16px', marginBottom: '10px', fontSize: '13px', color: '#535262' }}>
				{(['it', 'en'] as const).map((value) => (
					<label key={value} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
						<input type="radio" name="utm-lang" checked={lang === value} onChange={() => setLang(value)} />
						{value === 'it' ? 'Pagina italiana' : 'Pagina inglese'}
					</label>
				))}
			</div>
			{CHANNELS.map((channel) => {
				const url = buildUtmUrl(path, lang, channel.source, channel.medium, campaign);
				return (
					<div key={channel.source} style={{ marginBottom: '8px' }}>
						<span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#433e52', marginBottom: '2px' }}>
							{channel.label}
						</span>
						<div style={{ display: 'flex', gap: '6px' }}>
							<input
								type="text"
								readOnly
								value={url}
								aria-label={`Link tracciato ${channel.label}`}
								onFocus={(event) => event.currentTarget.select()}
								style={{
									flex: 1,
									minWidth: 0,
									fontSize: '12px',
									padding: '6px 8px',
									border: '1px solid #e1ddec',
									borderRadius: '6px',
									background: '#f7f6fa',
									color: '#433e52',
								}}
							/>
							<button
								type="button"
								onClick={() => handleCopy(channel.source, url)}
								style={{
									fontSize: '12px',
									padding: '6px 10px',
									border: '1px solid #e1ddec',
									borderRadius: '6px',
									background: copied === channel.source ? '#e6f4ea' : '#fff',
									cursor: 'pointer',
									whiteSpace: 'nowrap',
								}}
							>
								{copied === channel.source ? 'Copiato' : 'Copia'}
							</button>
						</div>
					</div>
				);
			})}
		</div>
	);
}

// wrapFieldsWithMeta renders the field's label and description above the custom UI, like
// every built-in Tina field — a bare component replaces the whole field, label included.
export const UtmLinkBuilder = wrapFieldsWithMeta(UtmLinkBuilderInput);
