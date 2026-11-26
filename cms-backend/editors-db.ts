import { MongoClient } from 'mongodb';

// Editor allowlist: one document per email in the `cms_editors` collection of the Tina database. Lives only in
// Mongo (the website repo is public), managed with `editors.ts`.
type Editor = { _id: string; addedAt: Date };

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI missing');
const mongo = new MongoClient(uri);
const editors = mongo.db('tinacms').collection<Editor>('cms_editors');

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export async function isEditor(email: string | null | undefined): Promise<boolean> {
	if (!email) return false;
	return (await editors.countDocuments({ _id: normalizeEmail(email) }, { limit: 1 })) > 0;
}

export async function addEditor(email: string) {
	await editors.updateOne({ _id: normalizeEmail(email) }, { $setOnInsert: { addedAt: new Date() } }, { upsert: true });
}

export async function removeEditor(email: string): Promise<boolean> {
	return (await editors.deleteOne({ _id: normalizeEmail(email) })).deletedCount > 0;
}

export async function listEditors(): Promise<Editor[]> {
	return editors.find().sort({ _id: 1 }).toArray();
}

export const closeEditorsDb = () => mongo.close();
