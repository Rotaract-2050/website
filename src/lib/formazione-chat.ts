import { localizeResource, type Resource } from './resources';
import type { Lang } from '../data/ui-strings';

/** Free-tier "Flash" model — best quality/throughput balance for short grounded QA. Single named
 * constant so swapping models is a one-line change. `gemini-2.5-flash` is no longer available to
 * new API keys/projects (verified against the live API while building this — it 404s with "no
 * longer available to new users"); `gemini-3.5-flash` is the current stable (non-preview)
 * replacement for this key's project as of 2026-08. */
export const GEMINI_MODEL = 'gemini-3.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/** Soft character budget for the concatenated resource corpus injected into the system prompt —
 * comfortably under gemini-3.5-flash's context window with margin for history/instructions. Not
 * expected to trigger at today's corpus size; a growth safeguard, see `buildSystemPrompt`. */
const MAX_PROMPT_CHARS = 200_000;
const REQUEST_TIMEOUT_MS = 20_000;
/** Generous budget: this model generation spends a mandatory, variable chunk of it on internal
 * "thinking" (verified live: ~90-400 tokens even at the lowest available thinkingLevel) before any
 * answer text, so a tight cap truncates the real answer via MAX_TOKENS before it's written. */
const MAX_OUTPUT_TOKENS = 1500;
const TURNSTILE_VERIFY_TIMEOUT_MS = 10_000;

/** Turnstile `data-action` for the chat widget, validated server-side against siteverify's response. */
export const TURNSTILE_ACTION = 'formazione-chat';

/** Client-held conversation history caps, enforced again server-side regardless of what the client sends. */
export const MAX_MESSAGES = 6;
export const MAX_MESSAGE_LENGTH = 500;

export type ChatRole = 'user' | 'model';
export interface ChatMessage {
	role: ChatRole;
	text: string;
}

export class GeminiTimeoutError extends Error {}
export class GeminiQuotaError extends Error {}
export class GeminiEmptyResponseError extends Error {}
export class GeminiApiError extends Error {
	constructor(
		message: string,
		public readonly status: number,
	) {
		super(message);
	}
}

const SYSTEM_PREAMBLE: Record<Lang, string> = {
	it: [
		'Sei l\'assistente della sezione "Formazione" del sito del Distretto Rotaract 2050.',
		'Rispondi SOLO usando le informazioni contenute nelle schede riportate sotto, che rappresentano l\'intera knowledge base disponibile.',
		'Se la domanda non trova risposta in queste schede, dillo chiaramente e suggerisci di rivolgersi al Prefetto o al Segretario del proprio club, senza inventare contenuti.',
		'Rispondi sempre in italiano, con frasi brevi e dirette. Non usare formattazione Markdown (niente asterischi, cancelletti o elenchi puntati): solo testo semplice, eventualmente su più paragrafi separati da una riga vuota.',
		'',
		'Ecco le schede della knowledge base:',
	].join('\n'),
	en: [
		'You are the assistant for the "Formazione" (training/knowledge base) section of the Rotaract District 2050 website.',
		'Answer ONLY using the information in the cards below, which represent the entire knowledge base available.',
		'If the question is not covered by these cards, say so clearly and suggest contacting the club\'s Prefect or Secretary, without inventing content.',
		'Always answer in English, in short, direct sentences. Do not use Markdown formatting (no asterisks, hashes, or bullet lists): plain text only, optionally split into paragraphs separated by a blank line.',
		'',
		'Here are the knowledge base cards:',
	].join('\n'),
};

/**
 * Concatenates the whole Formazione resource corpus (localized per `lang`) into a single system
 * prompt string — the in-context-learning approach this feature relies on, no RAG/vector DB.
 * Resources arrive pre-sorted by editorial `order` (see `getKnowledgeResources`); if the corpus
 * ever grows past `MAX_PROMPT_CHARS`, lowest-priority resources (the tail of that order) are
 * dropped first and a warning is logged, so growth becomes visible in Workers logs before it's
 * a real problem — at today's corpus size this path never triggers.
 */
export function buildSystemPrompt(resources: Resource[], lang: Lang): string {
	const entries: string[] = [];
	let corpusChars = 0;

	for (const resource of resources) {
		const localized = localizeResource(resource, lang);
		const tagLine = localized.tags.length > 0 ? `Tag: ${localized.tags.join(', ')}\n` : '';
		const entry = `### ${localized.title}\n${tagLine}${localized.body}`;

		if (corpusChars + entry.length > MAX_PROMPT_CHARS) {
			console.warn(
				`[formazione-chat] corpus troncato a ${entries.length}/${resources.length} risorse (budget di ${MAX_PROMPT_CHARS} caratteri superato)`,
			);
			break;
		}

		entries.push(entry);
		corpusChars += entry.length;
	}

	return `${SYSTEM_PREAMBLE[lang]}\n\n${entries.join('\n\n')}`;
}

interface GeminiGenerateContentResponse {
	candidates?: {
		content?: { parts?: { text?: string }[] };
		finishReason?: string;
	}[];
}

/** Raw `fetch()` to Gemini's REST API — no SDK, guaranteed Workers-runtime compatible. */
export async function callGemini(apiKey: string, systemPrompt: string, messages: ChatMessage[]): Promise<string> {
	const contents = messages.map((message) => ({ role: message.role, parts: [{ text: message.text }] }));

	let response: Response;
	try {
		response = await fetch(GEMINI_API_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
			body: JSON.stringify({
				contents,
				systemInstruction: { parts: [{ text: systemPrompt }] },
				generationConfig: {
					temperature: 0.3,
					maxOutputTokens: MAX_OUTPUT_TOKENS,
					// 'minimal'/thinkingBudget:0 are rejected or silently ignored on this model
					// generation (verified live) — 'low' is the lowest level it actually accepts.
					thinkingConfig: { thinkingLevel: 'low' },
				},
			}),
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
	} catch (error) {
		if (error instanceof Error && error.name === 'TimeoutError') {
			throw new GeminiTimeoutError('Gemini request timed out');
		}
		throw new GeminiApiError(`Gemini request failed: ${error instanceof Error ? error.message : String(error)}`, 0);
	}

	if (response.status === 429) {
		throw new GeminiQuotaError('Gemini quota exceeded');
	}
	if (!response.ok) {
		const body = await response.text().catch(() => '');
		throw new GeminiApiError(`Gemini API error ${response.status}: ${body}`, response.status);
	}

	const data = (await response.json()) as GeminiGenerateContentResponse;
	const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
	if (!text) {
		throw new GeminiEmptyResponseError('Gemini returned no usable text');
	}
	return text.trim();
}

interface TurnstileSiteverifyResponse {
	success: boolean;
	action?: string;
	['error-codes']?: string[];
}

/** Canonical server-side siteverify — browser never talks to Turnstile's verify endpoint directly. */
export async function verifyTurnstile(token: string, secretKey: string, remoteIp?: string): Promise<boolean> {
	if (!token) return false;

	try {
		const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			signal: AbortSignal.timeout(TURNSTILE_VERIFY_TIMEOUT_MS),
			body: new URLSearchParams({
				secret: secretKey,
				response: token,
				...(remoteIp ? { remoteip: remoteIp } : {}),
			}),
		});
		if (!response.ok) return false;

		const result = (await response.json()) as TurnstileSiteverifyResponse;
		return result.success === true && (!result.action || result.action === TURNSTILE_ACTION);
	} catch {
		return false;
	}
}
