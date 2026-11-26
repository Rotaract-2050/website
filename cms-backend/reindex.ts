import { spawn } from 'node:child_process';
import { createHmac, timingSafeEqual } from 'node:crypto';

// GitHub push webhook → reindex. The Mongo index only learns about saves made through the admin; every other push
// (merged PRs, auto-translate.yml's nightly commits) would otherwise leave the site serving stale content.
const SECRET = process.env.GITHUB_WEBHOOK_SECRET || '';
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const RESTART = 75; // run.sh: schema/backend/deps changed

export function validSignature(raw: string, signature: string | undefined): boolean {
	if (SECRET.length < 32 || !signature) return false;
	const expected = Buffer.from(`sha256=${createHmac('sha256', SECRET).update(raw).digest('hex')}`);
	const given = Buffer.from(signature);
	return expected.length === given.length && timingSafeEqual(expected, given);
}

/** Should this push event trigger a reindex? Only pushes to the branch this backend serves. */
export function isOurPush(event: string | undefined, raw: string): boolean {
	if (event !== 'push') return false;
	try {
		return JSON.parse(raw).ref === `refs/heads/${BRANCH}`;
	} catch {
		return false;
	}
}

// One reindex at a time; pushes arriving meanwhile collapse into a single follow-up run.
let running = false;
let pending = false;

export function queueReindex() {
	if (running) {
		pending = true;
		return;
	}
	running = true;
	const child = spawn('sh', ['cms-backend/run.sh', 'reindex'], { stdio: 'inherit' });
	child.on('exit', (code) => {
		running = false;
		if (code === RESTART) {
			console.log('reindex: schema or backend changed, exiting so the container restarts');
			process.exit(0);
		}
		if (code !== 0) console.error(`reindex failed with exit code ${code}`);
		if (pending) {
			pending = false;
			queueReindex();
		}
	});
}
