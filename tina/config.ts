import { defineConfig } from 'tinacms';
import { GoogleAuthJSProvider } from './auth-provider';
import { collections } from './collections';

// Local dev (scripts/dev.sh sets TINA_PUBLIC_IS_LOCAL=true) keeps Tina's built-in datalayer and no login; everything
// else talks to the self-hosted backend (cms-backend/) through the same-origin proxy src/pages/api/tina/[...path].ts,
// with editors signing in with their Google Workspace account.
// No Tina Cloud anymore: no clientId/token, and no admin search (Tina Cloud's hosted index; dropped on purpose).
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

export default defineConfig({
	contentApiUrlOverride: isLocal ? undefined : '/api/tina/gql',
	authProvider: isLocal ? undefined : new GoogleAuthJSProvider(),
	branch: process.env.WORKERS_CI_BRANCH || process.env.HEAD || 'main',
	build: {
		outputFolder: 'admin',
		publicFolder: 'public',
	},
	// Same files either way (public/uploads): local dev uses Tina's filesystem store, the self-hosted admin our
	// repo-backed store (Tina's `media.tina` refuses to run without Tina Cloud).
	media: isLocal
		? { tina: { mediaRoot: 'uploads', publicFolder: 'public' } }
		: { loadCustomStore: async () => (await import('./media-store')).RepoMediaStore },
	schema: {
		collections,
	},
});
