import type { IncomingMessage } from 'node:http';

/** Read the whole request body, failing with a 413-tagged error past `max` bytes. */
export function readBody(req: IncomingMessage, max: number): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		let size = 0;
		const chunks: Buffer[] = [];
		req.on('data', (c: Buffer) => {
			size += c.length;
			if (size > max) {
				reject(Object.assign(new Error('body too large'), { status: 413 }));
				req.destroy();
			} else chunks.push(c);
		});
		req.on('end', () => resolve(Buffer.concat(chunks)));
		req.on('error', reject);
	});
}
