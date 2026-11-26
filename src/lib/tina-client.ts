import { env } from 'cloudflare:workers';
import { createClient } from 'tinacms/dist/client';
import { queries } from '../../tina/__generated__/types';
import { noteTinaError } from './tina-health';

// Server-side Tina client for the Worker. The generated tina/__generated__/client.ts points at the relative
// '/api/tina/gql' (right for the admin in the browser, useless for a server-side fetch) and cannot add headers,
// so reads go straight to the self-hosted backend with the read-only token plus the Cloudflare Access service
// token that lets the Worker past cms.rotaract2050.org's Access policy.
// Local dev: Tina's local datalayer started by scripts/dev.sh (wrangler.jsonc's TINA_BACKEND_URL applies to
// `astro dev` too, and the real backend is behind Access anyway).
const client = createClient({
	url: import.meta.env.DEV ? 'http://localhost:4001/graphql' : `${env.TINA_BACKEND_URL}/api/tina/gql`,
	token: env.TINA_READ_TOKEN,
	queries,
});

const accessHeaders: Record<string, string> = env.CF_ACCESS_CLIENT_ID
	? { 'CF-Access-Client-Id': env.CF_ACCESS_CLIENT_ID, 'CF-Access-Client-Secret': env.CF_ACCESS_CLIENT_SECRET }
	: {};

const request = client.request.bind(client);
client.request = (args, options) =>
	request(args, {
		...options,
		fetchOptions: { ...options?.fetchOptions, headers: { ...accessHeaders, ...options?.fetchOptions?.headers } },
	}).catch((e) => {
		noteTinaError(e); // lets middleware.ts serve the last good copy instead of a page rendered without content
		throw e;
	});

export { client };
export default client;
