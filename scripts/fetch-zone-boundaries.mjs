#!/usr/bin/env node
// Writes src/data/zone-boundaries.geo.json: one contiguous polygon per zone, built from the
// actual provinces (province) each zone covers, per the district's own zone descriptions —
// not a nearest-neighbour tessellation of the whole region. Milano and Monza are cut out of
// every zone as a safety net: both host their own Rotaract district (2041 and 2042).
//
// Method:
//   - Each zone lists the provinces it's made of (ZONE_PROVINCES). A province used by only
//     one zone hands over all of its comuni (ISTAT municipalities) directly.
//   - A province shared by two zones (Cremona: Francigena/Padana: Brescia: Leonessa/Padana)
//     has each of its comuni assigned to whichever of those zones' clubs is geographically
//     nearest — a nearest-neighbour tessellation, but scoped only to the shared province
//     instead of the whole district.
//   - A handful of clubs sit just outside their zone's reference provinces, in Provincia di
//     Milano (Abbiategrasso, Morimondo, both Navigli) — those specific comuni are added
//     directly via EXTRA_CITY_RELATION_IDS rather than pulling in the rest of that province.
//
// Data source: OpenStreetMap, via the public Overpass API (bulk comune lookup) and
// Nominatim (individual polygon geometries). This is a one-off/occasional maintenance
// script, not part of `npm run build` — re-run it by hand after adding a club or changing
// a club's coordinates, then commit the updated src/data/zone-boundaries.geo.json.
//
//   node scripts/fetch-zone-boundaries.mjs
//
// Respects Nominatim's usage policy: max 1 request/second, identifying User-Agent.

import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { union } from '@turf/union';
import { difference } from '@turf/difference';
import { simplify } from '@turf/simplify';
import { area } from '@turf/area';
import { featureCollection, polygon, multiPolygon } from '@turf/helpers';

const CLUBS_DIR = path.resolve('src/content/clubs');
const ZONES_DIR = path.resolve('src/content/zones');
const OUTPUT_PATH = path.resolve('src/data/zone-boundaries.geo.json');
const USER_AGENT = 'Rotaract2050Website-BoundaryFetch/1.0 (https://rotaract2050.org)';
const NOMINATIM = 'https://nominatim.openstreetmap.org';
const OVERPASS = 'https://overpass-api.de/api/interpreter';

// Stable OSM relation ids for the provinces each zone is made of, found via Nominatim
// (q=Provincia di …) and pinned here so re-runs don't depend on name search matching the
// same relation every time.
const PROVINCE_RELATION_IDS = {
	Piacenza: 43332,
	Lodi: 44181,
	Cremona: 43893,
	Brescia: 44882,
	Pavia: 43483,
	Mantova: 43798,
};

// Which provinces make up each zone, per the district's own zone descriptions. A province
// listed under two zones is split between them by nearest-club assignment.
const ZONE_PROVINCES = {
	Francigena: ['Piacenza', 'Lodi', 'Cremona'],
	Leonessa: ['Brescia'],
	Navigli: ['Pavia'],
	Padana: ['Mantova', 'Cremona', 'Brescia'],
};

// Clubs whose comune falls outside their zone's reference provinces (here, in Provincia di
// Milano) get their specific comune added directly, without pulling in the rest of that
// province. OSM relation ids found via Nominatim (city=…).
const EXTRA_CITY_RELATION_IDS = {
	Navigli: [
		44773, // Abbiategrasso
		44710, // Morimondo
	],
};

// Milano and Monza belong to different Rotaract districts (2041 and 2042). No zone's
// reference provinces include their comuni, but they're subtracted from every zone's shape
// as a defensive safety net.
const MILANO_RELATION_ID = 44915;
const MONZA_RELATION_ID = 45319;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let lastNominatimRequestAt = 0;
async function nominatimFetch(pathAndQuery) {
	const wait = lastNominatimRequestAt + 1100 - Date.now();
	if (wait > 0) await sleep(wait);
	lastNominatimRequestAt = Date.now();

	const res = await fetch(`${NOMINATIM}${pathAndQuery}`, { headers: { 'User-Agent': USER_AGENT } });
	if (!res.ok) throw new Error(`Nominatim request failed (${res.status}): ${pathAndQuery}`);
	return res.json();
}

let lastOverpassRequestAt = 0;
async function overpassFetch(query, attempt = 1) {
	const wait = lastOverpassRequestAt + 5000 - Date.now();
	if (wait > 0) await sleep(wait);
	lastOverpassRequestAt = Date.now();

	const res = await fetch(OVERPASS, {
		method: 'POST',
		headers: { 'User-Agent': USER_AGENT, 'Content-Type': 'application/x-www-form-urlencoded' },
		body: `data=${encodeURIComponent(query)}`,
	});
	// The public Overpass instance is shared and occasionally overloaded (429/504) —
	// back off and retry rather than failing the whole run over transient load.
	if (!res.ok && (res.status === 429 || res.status === 504) && attempt < 5) {
		const backoffMs = attempt * 15000;
		console.log(`  Overpass request failed (${res.status}), retrying in ${backoffMs / 1000}s (attempt ${attempt + 1}/5)...`);
		await sleep(backoffMs);
		return overpassFetch(query, attempt + 1);
	}
	if (!res.ok) throw new Error(`Overpass request failed (${res.status})`);
	return res.json();
}

function haversineKm([lat1, lon1], [lat2, lon2]) {
	const R = 6371;
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLon = ((lon2 - lon1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
	return 2 * R * Math.asin(Math.sqrt(a));
}

/** Every comune (admin_level=8) inside a province, with its OSM relation id and center point. */
async function fetchComuniForProvince(provinceRelationId) {
	const query = `
		[out:json][timeout:180];
		area(${3600000000 + provinceRelationId})->.a;
		relation["admin_level"="8"]["boundary"="administrative"](area.a);
		out center;
	`;
	const data = await overpassFetch(query);
	return data.elements
		.filter((el) => el.type === 'relation' && el.center)
		.map((el) => ({ id: el.id, name: el.tags?.name ?? `relation/${el.id}`, lat: el.center.lat, lng: el.center.lon }));
}

/** Full polygon geometries for a batch of OSM relation ids, via Nominatim's bulk lookup endpoint (max 50 ids/request). */
async function fetchGeometries(ids) {
	const geometryById = new Map();
	for (let i = 0; i < ids.length; i += 50) {
		const batch = ids.slice(i, i + 50);
		console.log(`  fetching geometries ${i + 1}-${i + batch.length} of ${ids.length}...`);
		const data = await nominatimFetch(`/lookup?osm_ids=${batch.map((id) => `R${id}`).join(',')}&format=jsonv2&polygon_geojson=1`);
		for (const result of data) {
			if (result.osm_type === 'relation' && result.geojson) geometryById.set(result.osm_id, result.geojson);
		}
	}
	return geometryById;
}

function unionAll(geometries) {
	if (geometries.length === 1) return geometries[0];
	return union(featureCollection(geometries.map((geometry) => ({ type: 'Feature', properties: {}, geometry }))));
}

// intersect/difference occasionally leave behind sub-km² sliver polygons at clip edges
// (float-precision topology noise, not real disconnected territory) — drop them so each
// zone renders as one clean shape instead of a MultiPolygon with stray specks.
const MIN_PIECE_AREA_M2 = 1_000_000;
function dropSlivers(feature) {
	if (feature.geometry.type !== 'MultiPolygon') return feature;
	const pieces = feature.geometry.coordinates.filter((coords) => area(polygon(coords)) >= MIN_PIECE_AREA_M2);
	if (pieces.length === 1) return polygon(pieces[0]);
	return multiPolygon(pieces);
}

async function main() {
	const zoneFiles = (await readdir(ZONES_DIR)).filter((f) => f.endsWith('.md'));
	const zoneNameByPath = new Map();
	for (const file of zoneFiles) {
		const raw = await readFile(path.join(ZONES_DIR, file), 'utf8');
		const { data } = matter(raw);
		zoneNameByPath.set(`src/content/zones/${file}`, data.name);
	}
	const zoneNames = [...zoneNameByPath.values()];
	for (const zoneName of zoneNames) {
		if (!ZONE_PROVINCES[zoneName]) throw new Error(`ZONE_PROVINCES has no entry for zone "${zoneName}"`);
	}

	const clubFiles = (await readdir(CLUBS_DIR)).filter((f) => f.endsWith('.md')).sort();
	/** @type {{ name: string; lat: number; lng: number; zoneName: string }[]} */
	const clubs = [];
	for (const file of clubFiles) {
		const raw = await readFile(path.join(CLUBS_DIR, file), 'utf8');
		const { data } = matter(raw);
		if (typeof data.lat !== 'number' || typeof data.lng !== 'number' || !data.zone) continue;
		const zoneName = zoneNameByPath.get(data.zone);
		if (!zoneName) {
			console.warn(`! unknown zone reference ${data.zone} for ${data.name}`);
			continue;
		}
		clubs.push({ name: data.name, lat: data.lat, lng: data.lng, zoneName });
	}
	console.log(`${clubs.length} clubs across ${zoneNames.length} zones`);

	// Which zones each province belongs to (a province can belong to more than one zone).
	const zonesByProvince = new Map();
	for (const [zoneName, provinces] of Object.entries(ZONE_PROVINCES)) {
		for (const province of provinces) {
			if (!zonesByProvince.has(province)) zonesByProvince.set(province, []);
			zonesByProvince.get(province).push(zoneName);
		}
	}

	/** @type {Map<string, number[]>} zone name -> comune ids */
	const comuneIdsByZone = new Map();
	for (const zoneName of zoneNames) comuneIdsByZone.set(zoneName, []);

	console.log('\nFetching comuni per province from Overpass, and assigning each to a zone...');
	for (const [province, provinceRelationId] of Object.entries(PROVINCE_RELATION_IDS)) {
		const owningZones = zonesByProvince.get(province) ?? [];
		const comuni = await fetchComuniForProvince(provinceRelationId);

		if (owningZones.length === 1) {
			comuneIdsByZone.get(owningZones[0]).push(...comuni.map((c) => c.id));
			console.log(`  ${province}: ${comuni.length} comuni -> ${owningZones[0]}`);
			continue;
		}

		const candidateClubs = clubs.filter((club) => owningZones.includes(club.zoneName));
		const tally = new Map(owningZones.map((zoneName) => [zoneName, 0]));
		for (const comune of comuni) {
			let nearest = null;
			let nearestDistance = Infinity;
			for (const club of candidateClubs) {
				const distance = haversineKm([comune.lat, comune.lng], [club.lat, club.lng]);
				if (distance < nearestDistance) {
					nearest = club;
					nearestDistance = distance;
				}
			}
			comuneIdsByZone.get(nearest.zoneName).push(comune.id);
			tally.set(nearest.zoneName, tally.get(nearest.zoneName) + 1);
		}
		const breakdown = [...tally.entries()].map(([zoneName, count]) => `${count} ${zoneName}`).join(', ');
		console.log(`  ${province} (shared by ${owningZones.join(', ')}): ${comuni.length} comuni -> ${breakdown}`);
	}

	for (const [zoneName, extraIds] of Object.entries(EXTRA_CITY_RELATION_IDS)) {
		comuneIdsByZone.get(zoneName).push(...extraIds);
		console.log(`  +${extraIds.length} extra comuni -> ${zoneName}`);
	}

	console.log('\nFetching Milano/Monza cutout...');
	const boundaryGeometryById = await fetchGeometries([MILANO_RELATION_ID, MONZA_RELATION_ID]);
	const excludedCities = unionAll([boundaryGeometryById.get(MILANO_RELATION_ID), boundaryGeometryById.get(MONZA_RELATION_ID)]);

	console.log('\nFetching comune geometries...');
	const allComuneIds = [...comuneIdsByZone.values()].flat();
	const comuneGeometryById = await fetchGeometries(allComuneIds);

	console.log('\nBuilding zone boundaries...');
	const zones = {};
	for (const [zoneName, ids] of comuneIdsByZone) {
		const geometries = ids.map((id) => comuneGeometryById.get(id)).filter(Boolean);
		if (geometries.length === 0) {
			console.warn(`! zone "${zoneName}" has no resolved comune geometry, skipping`);
			continue;
		}

		let shape = unionAll(geometries);
		shape = difference(featureCollection([shape, excludedCities])) ?? shape;
		shape = dropSlivers(shape);

		const simplified = simplify(shape, { tolerance: 0.002, highQuality: true });
		zones[zoneName] = simplified;
		console.log(`  ${zoneName}: ${geometries.length} comuni merged`);
	}

	await writeFile(
		OUTPUT_PATH,
		JSON.stringify(
			{
				source: 'OpenStreetMap contributors, via Overpass/Nominatim — https://www.openstreetmap.org/copyright',
				generatedAt: new Date().toISOString(),
				zones,
			},
			null,
			'\t',
		),
	);
	console.log(`\nWrote ${OUTPUT_PATH}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
