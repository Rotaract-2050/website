// Nightly IT→EN auto-translation for the `pages` collection, run by
// .github/workflows/auto-translate.yml. Fills empty `xEn` fields from their IT counterpart via
// Cloudflare Workers AI — never overwrites a field that already has a value (hand-written or from
// a previous run), so editorial corrections are permanent. One Workers AI call per file (not per
// field) so the model sees the whole page as context and keeps terminology/tone consistent.
//
// Usage:
//   node scripts/auto-translate-pages.mjs           # translate + write + report changed files
//   node scripts/auto-translate-pages.mjs --dry-run  # only report what would be translated
//
// Requires CF_ACCOUNT_ID and CF_AI_API_TOKEN env vars (skipped gracefully in --dry-run).
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const ROOT = path.resolve(import.meta.dirname, '..');
const PAGES_DIR = path.join(ROOT, 'src/content/pages');
const MODEL = '@cf/meta/llama-3.1-8b-instruct';
const DRY_RUN = process.argv.includes('--dry-run');

// Same translatable-field map as scripts/migrate-pages-it-en.mjs (kept in sync with the *En
// fields defined in tina/config.ts's pages collection).
const BLOCK_FIELD_MAP = {
	Hero: { top: [], arrays: { slides: ['eyebrow', 'title', 'subtitle', 'ctaLabel'] } },
	PhotoCarousel: { top: [], arrays: { images: ['label'] } },
	StatsBar: { top: [], arrays: { items: ['label'] } },
	SplitSection: { top: ['kicker', 'title', 'quote', 'body', 'subhead', 'body2', 'ctaLabel', 'imageLabel'], arrays: {} },
	CardGrid: { top: ['title'], arrays: { items: ['title', 'meta'] } },
	ValuesGrid: { top: ['title', 'intro'], arrays: { items: ['title', 'description'] } },
	RoleGrid: { top: ['title', 'disclaimerText'], arrays: { items: ['role', 'themeMotto'] } },
	CommitteeGrid: { top: ['title', 'disclaimerText'], arrays: { items: ['name', 'description', 'leadLabel', 'membersLabel'] } },
	EventsCalendar: { top: ['title'], arrays: {} },
	NewsTicker: { top: ['label'], arrays: {} },
	NewsGrid: { top: ['title'], arrays: {} },
	CtaBanner: { top: ['title', 'body', 'buttonLabel'], arrays: {} },
	MaterialsGrid: { top: ['title', 'emptyMessage'], arrays: {} },
	ResourceArchive: { top: ['emptyMessage'], arrays: {} },
	PagePlaceholder: { top: ['message'], arrays: {} },
	RrdTimeline: { top: ['title', 'disclaimerText'], arrays: { items: ['motto', 'mottoDistretto', 'eraLabel'] } },
	ClubDirectory: { top: ['intro', 'disclaimer'], arrays: {} },
	EventsArchive: { top: ['emptyMessage'], arrays: {} },
	NewsArchive: { top: ['emptyMessage'], arrays: {} },
};

function splitFrontmatter(raw) {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	if (!match) throw new Error('File missing --- frontmatter delimiters');
	return { frontmatter: yaml.load(match[1]) ?? {}, raw: match[1] };
}

/**
 * Walks a page's frontmatter and returns the list of pending translations: fields where the IT
 * value is non-empty and the `xEn` sibling is empty/missing. Each entry has a unique `id` (used
 * to map the model's response back to the right spot) and a `set(frontmatter, value)` closure
 * that writes the translated value into the right nested path.
 */
function findPending(frontmatter) {
	const pending = [];

	const baseFields = [
		['title', 'titleEn'],
		['eyebrow', 'eyebrowEn'],
		['breadcrumbCurrent', 'breadcrumbCurrentEn'],
	];
	for (const [itKey, enKey] of baseFields) {
		if (frontmatter[itKey] && !frontmatter[enKey]) {
			pending.push({ id: enKey, text: frontmatter[itKey], set: (fm, v) => { fm[enKey] = v; } });
		}
	}
	if (frontmatter.seo) {
		for (const [itKey, enKey] of [['title', 'titleEn'], ['description', 'descriptionEn']]) {
			if (frontmatter.seo[itKey] && !frontmatter.seo[enKey]) {
				pending.push({ id: `seo.${enKey}`, text: frontmatter.seo[itKey], set: (fm, v) => { fm.seo[enKey] = v; } });
			}
		}
	}

	(frontmatter.blocks ?? []).forEach((block, blockIndex) => {
		const map = BLOCK_FIELD_MAP[block._template];
		if (!map) return;
		for (const field of map.top) {
			const enField = field + 'En';
			if (block[field] && !block[enField]) {
				pending.push({
					id: `blocks.${blockIndex}.${enField}`,
					text: block[field],
					set: (fm, v) => { fm.blocks[blockIndex][enField] = v; },
				});
			}
		}
		for (const [arrayField, subFields] of Object.entries(map.arrays)) {
			(block[arrayField] ?? []).forEach((item, itemIndex) => {
				for (const field of subFields) {
					const enField = field + 'En';
					if (item[field] && !item[enField]) {
						pending.push({
							id: `blocks.${blockIndex}.${arrayField}.${itemIndex}.${enField}`,
							text: item[field],
							set: (fm, v) => { fm.blocks[blockIndex][arrayField][itemIndex][enField] = v; },
						});
					}
				}
			});
		}
	});

	return pending;
}

/** All IT text in the page, for context — helps the model keep terminology/tone consistent even for fields it isn't translating this run. */
function collectContext(frontmatter) {
	const lines = [];
	if (frontmatter.title) lines.push(`title: ${frontmatter.title}`);
	if (frontmatter.eyebrow) lines.push(`eyebrow: ${frontmatter.eyebrow}`);
	(frontmatter.blocks ?? []).forEach((block, i) => {
		lines.push(`--- block ${i} (${block._template}) ---`);
		for (const [k, v] of Object.entries(block)) {
			if (k === '_template' || typeof v !== 'string' || !v) continue;
			lines.push(`${k}: ${v}`);
		}
		for (const [k, v] of Object.entries(block)) {
			if (!Array.isArray(v)) continue;
			v.forEach((item, j) => {
				if (item && typeof item === 'object') {
					for (const [ik, iv] of Object.entries(item)) {
						if (typeof iv === 'string' && iv) lines.push(`${k}[${j}].${ik}: ${iv}`);
					}
				}
			});
		}
	});
	return lines.join('\n');
}

async function translateFile(slug, frontmatter, pending) {
	const context = collectContext(frontmatter);
	const toTranslate = pending.map((p) => ({ id: p.id, text: p.text }));

	const prompt = `You are translating editorial content for an official Rotaract district website from Italian to English. Below is the full text of one page for context — keep terminology and tone consistent with it. Then translate ONLY the listed fields (by id) from Italian to English. Do not translate proper nouns, club names, or person names. Respond with ONLY a raw JSON object mapping each id to its English translation, no markdown code fences, no extra commentary.

PAGE CONTEXT (Italian):
${context}

FIELDS TO TRANSLATE (JSON):
${JSON.stringify(toTranslate, null, 2)}

Respond with a JSON object like {"id1": "English text", "id2": "English text"} covering exactly these ids, nothing else.`;

	const accountId = process.env.CF_ACCOUNT_ID;
	const token = process.env.CF_AI_API_TOKEN;
	if (!accountId || !token) throw new Error('CF_ACCOUNT_ID / CF_AI_API_TOKEN not set');

	const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${MODEL}`, {
		method: 'POST',
		headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
	});
	if (!res.ok) throw new Error(`Workers AI request failed for ${slug}: HTTP ${res.status}`);
	const json = await res.json();
	const text = json?.result?.response;
	if (typeof text !== 'string') throw new Error(`Workers AI returned no response text for ${slug}`);

	const jsonMatch = text.match(/\{[\s\S]*\}/);
	if (!jsonMatch) throw new Error(`Workers AI response for ${slug} wasn't parseable JSON: ${text.slice(0, 200)}`);
	const translations = JSON.parse(jsonMatch[0]);

	for (const p of pending) {
		const value = translations[p.id];
		if (typeof value !== 'string' || !value) {
			console.warn(`  ⚠ ${slug}: missing translation for "${p.id}" in model response, leaving empty`);
			continue;
		}
		p.set(frontmatter, value);
	}
}

async function main() {
	const files = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith('.md'));
	let changedCount = 0;

	for (const file of files) {
		const slug = file.replace(/\.md$/, '');
		const filePath = path.join(PAGES_DIR, file);
		const { frontmatter } = splitFrontmatter(fs.readFileSync(filePath, 'utf8'));
		const pending = findPending(frontmatter);

		if (pending.length === 0) continue;

		console.log(`${slug}: ${pending.length} field(s) need translation${DRY_RUN ? ' (dry run)' : ''}`);
		for (const p of pending) console.log(`  - ${p.id}: "${p.text.slice(0, 60)}${p.text.length > 60 ? '…' : ''}"`);

		if (DRY_RUN) continue;

		try {
			await translateFile(slug, frontmatter, pending);
			const out = `---\n${yaml.dump(frontmatter, { lineWidth: -1 })}---\n\n`;
			fs.writeFileSync(filePath, out, 'utf8');
			changedCount++;
			console.log(`  ✓ translated and wrote ${file}`);
		} catch (err) {
			console.error(`  ✗ ${slug}: ${err.message} — skipping this file, left untouched`);
		}
	}

	console.log(DRY_RUN ? `Dry run complete.` : `Done. ${changedCount} file(s) changed.`);
	// Signal to the workflow whether there's anything to commit.
	if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changedCount > 0}\n`);
}

main();
