import { createDatabase, createLocalDatabase } from '@tinacms/datalayer';
import { MongodbLevel } from 'mongodb-level';
import { GitHubProvider } from 'tinacms-gitprovider-github';

// Self-hosted Tina data layer. Loaded by the Tina CLI (build/reindex) and by cms-backend on the VPS, never by
// the Astro site itself. `tinacms dev` ignores it (no contentApiUrlOverride in local mode, see config.ts), so
// local dev keeps Tina's built-in datalayer.
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';
const branch = process.env.GITHUB_BRANCH || 'main';

export default isLocal
	? createLocalDatabase()
	: createDatabase({
			gitProvider: new GitHubProvider({
				owner: process.env.GITHUB_OWNER || 'Rotaract-2050',
				repo: process.env.GITHUB_REPO || 'website',
				branch,
				token: process.env.GITHUB_PERSONAL_ACCESS_TOKEN || '',
			}),
			databaseAdapter: new MongodbLevel<string, Record<string, unknown>>({
				collectionName: 'tinacms',
				dbName: 'tinacms',
				mongoUri: process.env.MONGODB_URI || '',
			}),
			// One index per branch in the same Mongo collection: the preview backend (feat/…) and prod (main)
			// can share one Mongo without overwriting each other.
			namespace: branch,
		});
