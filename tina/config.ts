import { defineConfig } from 'tinacms';
import { collections } from './collections';

export default defineConfig({
	branch: process.env.WORKERS_CI_BRANCH || process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || 'main',
	clientId: process.env.TINA_CLIENT_ID || null,
	token: process.env.TINA_TOKEN || null,
	// Tina Cloud's hosted search index (tina.io/docs/reference/search/overview) — powers the
	// admin's own content search/reference pickers as collections like `resources` grow past a
	// glance-able size. `indexerToken` is only used by the CLI to *push* the index on dev/build;
	// it's optional in Tina's own types, so this is a safe no-op locally until TINA_SEARCH_TOKEN
	// is set in .env (get it from the Tina Cloud dashboard → project → Search). Not the same thing
	// as the public /formazione search box, which is a small client-side filter (see
	// ResourceArchive.astro) — Tina's hosted search is scoped to the CMS admin, not the public site.
	search: {
		tina: {
			indexerToken: process.env.TINA_SEARCH_TOKEN || undefined,
			stopwordLanguages: ['eng', 'ita'],
		},
		indexBatchSize: 100,
		maxSearchIndexFieldLength: 400,
	},
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
