import type { APIRoute } from 'astro';
import client from '../../../tina/__generated__/client';

export const POST: APIRoute = async ({ request }) => {
	try {
		const data = (await request.json()) as Record<string, any>;
		
		if (Object.keys(data).length === 0) {
			return new Response(JSON.stringify({ error: 'Nessun dato fornito.' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;

		if (!RESEND_API_KEY) {
			console.error('RESEND_API_KEY mancante nel server.');
			return new Response(JSON.stringify({ error: 'Errore di configurazione del server (API key mancante).' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Fetch global settings from TinaCMS content collections
		const settings = await client.queries.settings({ relativePath: 'settings.json' });
		const defaultTo = settings?.data?.settings?.contactFormEmail || settings?.data?.settings?.email || 'info@rotaract2050.org';

		// Try to identify email and name for specific use cases (Reply-To, Subject)
		const replyToEmail = data.email || data.Email || data.mail || Object.values(data).find(v => typeof v === 'string' && v.includes('@')) || undefined;
		const senderName = data.name || data.nome || data.Nome || data.Name || 'Un Utente';

		// Dynamically generate the HTML for all fields
		const htmlFields = Object.entries(data)
			.filter(([key]) => key !== 'bot-field') // ignore honeypot if it somehow reached here
			.map(([key, value]) => {
				const displayKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
				const displayValue = typeof value === 'string' ? value.replace(/\n/g, '<br>') : String(value);
				return `<p style="margin-bottom: 10px;"><strong>${displayKey}:</strong><br/>${displayValue}</p>`;
			}).join('\n');

		const res = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${RESEND_API_KEY}`,
			},
			body: JSON.stringify({
				from: 'Sito Rotaract 2050 <no-reply@form.rotaract2050.org>',
				to: [defaultTo],
				subject: `Nuovo messaggio dal sito da ${senderName}`,
				html: `
					<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
						<h2 style="color: #d41367; margin-bottom: 24px;">Nuovo Messaggio di Contatto</h2>
						<div style="background: #f4f4f4; padding: 20px; border-radius: 8px;">
							${htmlFields}
						</div>
						<hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;" />
						<p style="font-size: 12px; color: #999;">Email inviata automaticamente dal form contatti del sito Rotaract Distretto 2050.</p>
					</div>
				`,
				reply_to: replyToEmail,
			}),
		});

		if (res.ok) {
			return new Response(JSON.stringify({ success: true }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		} else {
			const errorData = await res.json();
			console.error('Resend API Error:', errorData);
			return new Response(JSON.stringify({ error: "Errore durante l'invio dell'email via Resend." }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			});
		}
	} catch (error) {
		console.error('API /contact error:', error);
		return new Response(JSON.stringify({ error: 'Richiesta non valida o errore server.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}
};
