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
	media: {
		tina: {
			mediaRoot: 'uploads',
			publicFolder: 'public',
		},
	},
	schema: {
		collections,
	},
});
