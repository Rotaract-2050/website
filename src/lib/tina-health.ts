import { AsyncLocalStorage } from 'node:async_hooks';

// Per-request "did a Tina read fail because the backend was unreachable?" flag, so the middleware can tell a page
// rendered without content (requestWithMetadata swallows errors and renders empty) from a genuine one.
type State = { failed: boolean };
const store = new AsyncLocalStorage<State>();

/** Run fn with a fresh flag; returns fn's result and whether any Tina read hit a backend outage meanwhile. */
export async function trackTinaReads<T>(fn: () => Promise<T>): Promise<{ result: T; backendFailed: boolean }> {
	const state: State = { failed: false };
	const result = await store.run(state, fn);
	return { result, backendFailed: state.failed };
}

/**
 * Record a failed Tina read unless it was a GraphQL answer: TinaClient throws "Unable to fetch, please see our FAQ…
 * Errors: …" for GraphQL errors such as "record not found", which are content, not outages. Everything else (Workers'
 * "Network connection lost", non-2xx from the backend or Access) means the backend wasn't there.
 */
export function noteTinaError(error: unknown) {
	const outage = !/^Unable to fetch, please see our FAQ/.test(String((error as Error)?.message));
	const state = store.getStore();
	if (outage && state) state.failed = true;
}
