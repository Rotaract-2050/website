// Manage the Tina editor allowlist. Inside the backend container:
//   node cms-backend/dist/editors.cjs add nome.cognome@rotaract2050.org
//   node cms-backend/dist/editors.cjs remove nome.cognome@rotaract2050.org
//   node cms-backend/dist/editors.cjs list
// Only Google Workspace accounts of ALLOWED_GOOGLE_DOMAIN can sign in at all; this list narrows it to editors.
import { addEditor, closeEditorsDb, listEditors, normalizeEmail, removeEditor } from './editors-db';

const [cmd, email] = process.argv.slice(2);
const domain = (process.env.ALLOWED_GOOGLE_DOMAIN || 'rotaract2050.org').toLowerCase();

async function main() {
	if (cmd === 'list') {
		for (const e of await listEditors()) console.log(`${e._id}\t${e.addedAt.toISOString()}`);
	} else if ((cmd === 'add' || cmd === 'remove') && email) {
		if (cmd === 'add' && !normalizeEmail(email).endsWith(`@${domain}`)) {
			throw new Error(`${email} is not a @${domain} address: Google sign-in would reject it anyway`);
		}
		if (cmd === 'add') await addEditor(email);
		else if (!(await removeEditor(email))) throw new Error(`${email} was not an editor`);
		console.log(`${cmd === 'add' ? 'added' : 'removed'} ${normalizeEmail(email)}`);
	} else {
		console.error('usage: editors.cjs add|remove <email> | list');
		process.exitCode = 2;
	}
}

main()
	.catch((e: Error) => {
		console.error(e.message);
		process.exitCode = 1;
	})
	.finally(closeEditorsDb);
