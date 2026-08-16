import { env } from 'cloudflare:workers';
import type { APIRoute } from 'astro';
import { requestWithMetadata } from '@tinacms/astro';
import client from '../../../tina/__generated__/client';
import { getKnowledgeResources } from '../../lib/resources';
import {
	buildSystemPrompt,
	callGemini,
	verifyTurnstile,
	MAX_MESSAGES,
	MAX_MESSAGE_LENGTH,
	GeminiTimeoutError,
	GeminiQuotaError,
	GeminiEmptyResponseError,
	GeminiApiError,
	type ChatMessage,
} from '../../lib/formazione-chat';
import { uiStrings, type Lang } from '../../data/ui-strings';

interface ChatRequestBody {
	messages?: unknown;
	lang?: unknown;
	turnstileToken?: unknown;
}

function isValidLang(value: unknown): value is Lang {
	return value === 'it' || value === 'en';
}

function parseMessages(value: unknown): ChatMessage[] | null {
	if (!Array.isArray(value) || value.length === 0 || value.length > MAX_MESSAGES) return null;

	const messages: ChatMessage[] = [];
	for (const entry of value) {
		if (typeof entry !== 'object' || entry === null) return null;
		const { role, text } = entry as Record<string, unknown>;
		if (role !== 'user' && role !== 'model') return null;
		if (typeof text !== 'string' || text.trim().length === 0 || text.length > MAX_MESSAGE_LENGTH) return null;
		messages.push({ role, text: text.trim() });
	}
	// Last message must be the new user turn — the server generates the reply, it doesn't accept
	// a pre-supplied assistant turn to append to.
	if (messages[messages.length - 1].role !== 'user') return null;

	return messages;
}

export const POST: APIRoute = async (context) => {
	const { request } = context;
	let body: ChatRequestBody;
	try {
		body = (await request.json()) as ChatRequestBody;
	} catch {
		return Response.json({ error: uiStrings.it.chat.errorInvalidInput }, { status: 400 });
	}

	if (!isValidLang(body.lang)) {
		return Response.json({ error: uiStrings.it.chat.errorInvalidInput }, { status: 400 });
	}
	const t = uiStrings[body.lang];

	const messages = parseMessages(body.messages);
	if (!messages) {
		return Response.json({ error: t.chat.errorInvalidInput }, { status: 400 });
	}
	if (typeof body.turnstileToken !== 'string' || body.turnstileToken.length === 0) {
		return Response.json({ error: t.chat.errorTurnstile }, { status: 403 });
	}

	if (!env.TURNSTILE_SECRET_KEY || !env.GEMINI_API_KEY) {
		console.error('[formazione-chat] missing TURNSTILE_SECRET_KEY or GEMINI_API_KEY');
		return Response.json({ error: t.chat.errorNotConfigured }, { status: 500 });
	}

	let remoteIp: string | undefined;
	try {
		remoteIp = context.clientAddress;
	} catch {
		remoteIp = undefined;
	}

	const turnstileOk = await verifyTurnstile(body.turnstileToken, env.TURNSTILE_SECRET_KEY, remoteIp);
	if (!turnstileOk) {
		return Response.json({ error: t.chat.errorTurnstile }, { status: 403 });
	}

	const resources = await getKnowledgeResources();
	if (resources.length === 0) {
		return Response.json({ answer: t.chat.errorEmptyCorpus });
	}

	// Editor-supplied tone/persona guidance from Tina (settings.chatAssistant.extraInstructions);
	// buildSystemPrompt only appends it after the fixed grounding/safety rules, never replaces them.
	const settingsResult = await requestWithMetadata(client.queries.settings({ relativePath: `${body.lang}.md` }));
	const extraInstructions = settingsResult.data.settings.chatAssistant?.extraInstructions;

	const systemPrompt = buildSystemPrompt(resources, body.lang, extraInstructions);

	try {
		const answer = await callGemini(env.GEMINI_API_KEY, systemPrompt, messages);
		return Response.json({ answer });
	} catch (error) {
		if (error instanceof GeminiQuotaError) {
			return Response.json({ error: t.chat.errorQuota }, { status: 429 });
		}
		if (error instanceof GeminiTimeoutError) {
			console.error('[formazione-chat] Gemini timeout', error);
			return Response.json({ error: t.chat.errorGeneric }, { status: 504 });
		}
		if (error instanceof GeminiEmptyResponseError) {
			console.error('[formazione-chat] Gemini empty/blocked response', error);
			return Response.json({ answer: t.chat.errorGeneric });
		}
		if (error instanceof GeminiApiError) {
			console.error('[formazione-chat] Gemini API error', error.status, error.message);
			return Response.json({ error: t.chat.errorGeneric }, { status: 502 });
		}
		console.error('[formazione-chat] unexpected error', error);
		return Response.json({ error: t.chat.errorGeneric }, { status: 500 });
	}
};
