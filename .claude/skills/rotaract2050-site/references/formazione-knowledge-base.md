# Formazione e Risorse — knowledge base `/formazione`

Sezione pensata come **wiki aperta a tutti i club italiani** (non solo al Distretto), modellata sulla struttura a card di rotaractdistrict3131.org/events, seminata inizialmente con il Cerimoniale del Distretto 2050. Deliberatamente **non riusa il pattern news/eventi**: è un tipo di contenuto diverso (schede procedurali cross-referenziate tra loro, non articoli datati), con una propria collection Tina, un proprio renderer Markdown e un proprio meccanismo di link interni.

## Collection Tina `resources`

`tina/config.ts`, path `src/content/resources/`, router `resourcesRouter` → `/formazione/<slug>`. Un file per scheda, IT+EN nello stesso documento (stesso pattern di `news`/`events`: `title`/`titleEn`, `excerpt`/`excerptEn`, `body`/`bodyEn` — vedi `references/tina.md`).

Campi:

- `title`/`titleEn`, `excerpt`/`excerptEn` — come le altre collection bilingui.
- `tags` — lista di stringhe **vincolata a `options`** (non testo libero): oggi `['Prefetto', 'Cerimoniale']`. Diventano i filtri cliccabili nell'archivio; una scheda può averne più di uno (tutte le 12 schede del Cerimoniale hanno entrambi i tag — scelta esplicita dell'utente per tenere i filtri pochi e significativi, la granularità per argomento (tavolo/saluti/bandiere...) si copre con la ricerca testuale, non con altri tag). Per aggiungere un nuovo tag: aggiungerlo a `options` qui **e** alla sua traduzione EN in `TAG_LABELS_EN` **e** al suo colore in `TAG_COLORS`, entrambe in `src/lib/resources.ts` — se manca la traduzione/colore il tag funziona comunque (fallback: testo IT invariato, colore Cranberry di default), ma resta "non finito".
- `order` (opzionale) — ordine manuale nell'archivio (numero più basso prima; a parità/assenza, alfabetico per titolo). Vedi `getKnowledgeResources()` in `lib/resources.ts`.
- `body`/`bodyEn` — **Markdown puro** (`type: 'string'`, `ui.component: 'textarea'`), non l'editor rich-text/WYSIWYG usato per `news`/`events`. Vedi sezione dedicata sotto.
- **Niente campo immagine di copertina** (rimosso deliberatamente — le card non mostrano foto, solo icona segnaposto + tag; le immagini vanno inline nel testo, vedi sotto).

## Corpo scheda: Markdown puro + wikilink `[[slug]]`

Scelta deliberata (richiesta esplicita dell'utente): niente editor visuale, editor scrivono Markdown vero — `#`/`##` titoli, `-`/`1.` elenchi, `**grassetto**`, `> citazioni` — più una sintassi in stile wiki per collegare le schede tra loro:

- `[[slug-scheda]]` → link alla scheda con quello slug (nome del file senza `.md`), testo del link = titolo (localizzato) della scheda collegata.
- `[[slug-scheda|Testo personalizzato]]` → stesso link, testo scelto dall'editor.
- Slug inesistente → **degrada a testo semplice** (lo slug stesso, o il testo personalizzato se fornito), non un link rotto/404. Errore di battitura non rompe la pagina.

Implementato in `src/lib/resource-markdown.ts` (nuovo, dedicato — non tocca `lib/tina-rich-text.ts`, che resta il renderer per i campi rich-text di `news`/`events`, non toccato da questo lavoro):

- `resolveWikilinks(markdown, resolve)` — regex `\[\[([^\]|]+)(?:\|([^\]]+))?\]\]`, sostituisce ogni match con un link Markdown vero (`[testo](url)`) **prima** di passare il testo a `marked`. Da quel punto in poi sono link Markdown normali, stessa escaping/rendering.
- `renderResourceMarkdown(markdown, resolve)` — wikilink risolti poi `marked.parse()`. Usato da `ResourceView.astro` per il rendering della pagina scheda.
- `extractResourcePlainText(markdown, resolve)` — stessa risoluzione wikilink (così il titolo di una scheda collegata è cercabile) poi sintassi Markdown ripulita alla buona; usato per la ricerca lato client (sotto).
- `resolve: WikilinkResolver` è una funzione `(slug) => {href, label} | undefined`, costruita da `buildWikilinkResolver(resources, lang)` in `lib/resources.ts` a partire dall'intera collection già caricata — niente query per-link, un'unica `getKnowledgeResources()` per pagina basta.

**Immagini inline**: `![descrizione](percorso)`, sintassi Markdown standard, `marked` la renderizza come `<img>` senza bisogno di codice aggiuntivo. L'editor deve prima caricare il file dal pannello **Media** dell'admin Tina (sidebar sinistra, indipendente da qualsiasi campo — attivo perché `media.tina.mediaRoot` è configurato globalmente, vedi `references/tina.md`), poi incollare il percorso copiato nel testo. Documentato direttamente nella `description` del campo `body` in `tina/config.ts`. Stile in `ResourceView.astro` (`.article-body :global(img)`, non un componente dedicato: l'`<img>` grezzo arriva così com'è dall'output di `marked`, non c'è un wrapper da stilizzare).

**Tabelle**: sintassi GFM standard (`| Colonna 1 | Colonna 2 |`, riga separatrice `| --- | --- |`, poi una riga per dato) — già supportata da `marked` di default (GFM attivo out-of-the-box dalla v4, nessuna opzione da abilitare in `resource-markdown.ts`). Utile per contenuti che nel Cerimoniale originale erano elenchi puntati ma si leggono meglio a colonne (es. ordine di precedenza abbinato alla carica). Stile in `ResourceView.astro` (`.article-body :global(table/th/td)`): niente `<div>` wrapper disponibile (stesso motivo delle immagini sopra, l'HTML arriva già fatto da `marked`), quindi lo scroll orizzontale su schermi stretti è sulla `<table>` stessa (`display: block; overflow-x: auto`) invece che su un contenitore dedicato.

**Perché Markdown puro e non il rich-text esistente**: due motivi, uno esplicito (wikilink — l'editor visuale di Tina non ha una sintassi `[[...]]`, è concettualmente un editor WYSIWYG su un AST strutturato, non testo grezzo) e uno di sistema, scoperto lavorando su questa sezione: il renderer rich-text (`<StaticTinaMarkdown>` via `@astrojs/react`) va in crash (`ReferenceError: document is not defined`) sotto il runtime Cloudflare Workers di dev di questo progetto (workerd) — vedi sezione bug sotto. `marked` è una libreria pura JS senza React, quindi il corpo delle schede evita quella intera classe di problema.

**Sul disco non cambia nulla**: i campi rich-text di Tina erano già salvati come Markdown puro nei file `.md` (si vede aprendo qualunque `news/*.md` esistente). Il cambio di tipo campo cambia solo l'editor nell'admin Tina (textarea invece di WYSIWYG) e il modo in cui Astro legge/renderizza il valore via GraphQL (stringa invece di AST rich-text) — non serve migrare i 12 file esistenti.

## Card e colori per tag

- `ResourceCard.astro` — niente foto (rimossa in un redesign successivo alla prima versione, che invece riusava il layout fotografico di `NewsCard`): icona per-tag (`ResourceIcon.astro`, uno `switch` su `tag ===` per ogni valore in `options`, aggiungerne uno quando si aggiunge un nuovo tag — icona generica di fallback altrimenti), pillole tag colorate, titolo, estratto, "leggi di più". Sfondo card con effetto "fog"/fumo animato colorato sui due colori dei tag principali (`--smoke-c1`/`--smoke-c2`, impostati da `resourceCardGradient`).
- Sfondo card: **gradiente leggero tra i colori dei tag** della scheda (primi due; oltre il secondo non aggiunge altri stop, resta leggibile) — `resourceCardGradient(tags)` in `lib/resources.ts`, che imposta sia il gradiente statico sia le variabili colore per l'animazione fog. Nessun tag → tinta Cranberry di default.
- Colori: `TAG_COLORS` in `lib/resources.ts`, presi dalla **palette secondaria Rotary** riservata a tag/categorizzazione (la stessa che usano i badge zona/club — vedi `references/rotary-brand.md`), non i colori primari di brand.
- Le pillole tag (su card, filtri archivio, e sulla pagina scheda) condividono lo stesso colore per lo stesso tag via `tagPillStyle(tag)` (stesso recipe di `tagPillStyle` in `lib/news.ts` per i badge zona, ma tenuto separato: le due funzioni pescano da fonti diverse — mappa fissa qui, riferimento a zona lì).
- **Tag visibili in card, cap a 2 + pillola "+N"**: i tag sono partiti da 1-2 parole corte (Prefetto, Cerimoniale) ma sono cresciuti fino a 3 etichette lunghe "Categoria & Argomento" (es. "Struttura & Governance", "Dimensione Internazionale") — mostrarle tutte andava sistematicamente a capo, rompendo la UI della card (segnalato esplicitamente dall'utente, con vincolo "non rimuoverle"). `ResourceCard.astro` mostra solo le prime `MAX_VISIBLE_TAGS` (oggi 2) e raggruppa il resto in una pillola `+N` con `title` che elenca i tag nascosti al passaggio del mouse — **nessun dato è rimosso**: l'elenco completo resta su `data-tags` (usato dai filtri), sulla pagina scheda (`ResourceView.astro`, mai troncata: lì lo spazio non manca) e nei filtri dell'archivio. Se in futuro serve un'altra soglia, `MAX_VISIBLE_TAGS` è l'unico numero da toccare.

## Ricerca e filtri — solo dentro `/formazione`, non sito-wide

`ResourceArchive.astro` (il blocco Tina che compone la pagina indice) ha una barra di ricerca + pillole filtro per tag, **puramente client-side**, un piccolo `<script>` vanilla in fondo al componente (pattern standard del sito, vedi `references/astro.md`):

- Ogni card porta `data-tags="slug1 slug2"` (per il filtro) e `data-search="<testo del corpo estratto>"` (per la ricerca — vedi `extractResourcePlainText` sopra: include anche i titoli delle schede collegate via wikilink).
- Il filtro testo combina `card.textContent` (titolo/estratto/tag visibili) + `card.dataset.search` (corpo completo, non visibile in pagina).
- **Scope**: è un filtro sui soli elementi `.resource-card` dentro quel blocco — non esiste per costruzione un modo perché "trovi" contenuti fuori da `/formazione`, non serve nessuna guardia esplicita in più.
- **Pillole filtro su due righe**: prima riga "Tutte" + tag di ruolo (Prefetto, Segretario, Presidente, Tesoriere — parole corte), seconda riga i tag di categoria ("Storia & Valori", "Gestione & Strumenti"... etichette lunghe "Categoria & Argomento"). Mescolate in un'unica riga andavano a capo in modo disordinato. La distinzione ruolo/categoria è esplicita, non dedotta dal testo (es. non "contiene `&`"): `ROLE_TAGS` (Set) + `isRoleTag(tag)` in `lib/resources.ts` — aggiungere un tag lì (oltre che a `options` in `tina/config.ts`) quando se ne introduce uno nuovo di tipo ruolo; tutto il resto finisce nella riga categorie di default.

**Da non confondere con Tina Search**: `tina/config.ts` ha anche un blocco `search.tina` (tina.io/docs/reference/search/overview), attivato ma gated su una env var opzionale `TINA_SEARCH_TOKEN` (documentata in README, `indexerToken` è opzionale nei tipi di Tina quindi è un no-op sicuro finché non è impostata). **Quello è un motore di ricerca lato admin/CMS** (content-search e picker riferimenti dentro `/admin`), non un servizio riutilizzabile per la search-box pubblica — il client che lo interroga (`TinaCMSSearchClient`) è pensato per l'app admin, non per pagine SSR pubbliche. Se in futuro serve full-text vero sul sito pubblico a scala molto maggiore (centinaia di schede), la scelta più coerente con l'approccio zero-JS del sito è **Pagefind** (statico, zero token) — non implementato, solo annotato come opzione.

## Bug di routing scoperto lavorando su questa sezione

Una route dinamica annidata a un livello (`src/pages/formazione/[slug].astro`, e allo stesso modo `src/pages/news/[slug].astro`) **perde sempre** contro la route catch-all alla radice (`src/pages/[...slug].astro`), sia in `astro dev` che sul Worker Cloudflare deployato — causa non identificata dopo investigazione, non un problema del codice di questo progetto ma (probabilmente) di Astro stesso o dell'integrazione con l'adapter Cloudflare. I file `formazione/[slug].astro` (IT/EN) **esistono ancora ma sono codice morto**, irraggiungibili: il vero dispatch avviene dentro `[...slug].astro`/`en/[...slug].astro`, che riconoscono il prefisso (`formazione/`, `news/`) su `Astro.params.slug` e importano dinamicamente (`await import(...)`, non import statico in cima al file — un import statico porterebbe l'intera catena di dipendenze di *ogni* sezione dentro il modulo di *ogni* pagina, homepage inclusa, e sotto il runtime Cloudflare Workers di dev questo manda in crash l'intera route table) il componente vista giusto (`ResourceView.astro`, `NewsArticleView.astro`, o `GenericPageView.astro` per tutto il resto). Se in futuro Astro corregge questo bug di routing, i file `formazione/[slug].astro`/`news/[slug].astro` tornerebbero attivi automaticamente (sono ancora corretti, solo non raggiunti) — da verificare prima di rimuoverli.

## SEO — obiettivo esplicito: farsi trovare da Google

L'ambizione dichiarata di questa sezione è diventare una fonte pubblica che i club italiani trovino cercando su Google, non solo un'area riservata al Distretto — quindi la crawlabilità/indicizzazione non è un dettaglio, è parte dello scopo della sezione:

- **Sitemap**: ogni scheda (`src/content/resources/*.md`) è elencata esplicitamente in `astro.config.mjs` (`resourceSlugs`, stesso pattern di `newsSlugs`/`clubSlugs`/`eventSlugs` — il sito è tutto SSR, `@astrojs/sitemap` non scopre nulla da solo, va tutto in `customPages`). Una scheda nuova aggiunta come file finisce in sitemap al prossimo build senza toccare `astro.config.mjs`.
- **`public/robots.txt`** (non esisteva prima) — `Allow: /`, `Disallow: /admin` (l'admin Tina non ha motivo di essere indicizzato), riga `Sitemap:` che punta a `sitemap-index.xml`.
- **`ItemList` JSON-LD** sull'archivio (`ResourceArchive.astro`, `buildItemListJsonLd` in `lib/jsonld.ts`) — segnala esplicitamente ai motori di ricerca che la pagina è un hub verso N schede, non solo prosa.
- Il resto (canonical, hreflang it/en + x-default, OG/Twitter card, `Article` JSON-LD per scheda, niente `noindex`) arriva gratis da `BaseLayout`/`SeoHead.astro`/`buildArticleJsonLd` — infrastruttura sitewide già esistente, non specifica di questa sezione, ma su cui `/formazione` si appoggia interamente.
- I wikilink `[[slug]]` (vedi sopra) costruiscono da soli un grafo di link interni tra le schede — buon segnale per i crawler oltre che comodo per chi legge.

## Assistente AI (mini-chat) — in-context learning su Gemini

Widget flottante presente su tutte le pagine `/formazione*` (indice + ogni scheda, IT/EN), che risponde a domande usando **solo** il contenuto delle schede pubblicate, passato per intero nel system prompt ad ogni richiesta (nessun RAG/vector DB — corpus piccolo e testuale, sta comodamente nel context window). File: `src/lib/formazione-chat.ts` (system prompt, chiamata Gemini, verifica Turnstile), `src/pages/api/formazione-chat.ts` (route `POST`), `src/components/FormazioneChatWidget.astro` (UI vanilla JS, nessun `client:*`), incluso da `BaseLayout.astro` quando `current === 'formazione'`.

**Secrets**: `GEMINI_API_KEY` e `TURNSTILE_SECRET_KEY`, primi secret del progetto. Letti via `import { env } from 'cloudflare:workers'` (non `Astro.locals.runtime.env`, **rimosso in Astro v6** nella versione installata di `@astrojs/cloudflare` — throws un errore esplicito che indica il sostituto). Tipizzati da `worker-configuration.d.ts` (root, generato da `npm run cf-typegen` = `wrangler types`, va rigenerato e committato ogni volta che cambia un binding/secret in `.dev.vars`/`wrangler.jsonc`; contiene solo forme di tipo, mai valori). Locale: `.dev.vars` (gitignored). Produzione: `wrangler secret put GEMINI_API_KEY`/`TURNSTILE_SECRET_KEY` sul Worker `website`.

**Bug/scoperte Gemini API, verificate live durante l'implementazione (2026-08)**:
- `gemini-2.5-flash` **non è più disponibile per chiavi/progetti nuovi** — l'endpoint `generateContent` risponde `404` con `"This model ... is no longer available to new users"`. Modello attuale usato: `gemini-3.5-flash` (costante `GEMINI_MODEL` in `lib/formazione-chat.ts`, cambiarla è una riga). Verificare il catalogo modelli (`GET /v1beta/models` con la propria chiave) prima di assumere che un nome modello sia ancora valido: cambia rapidamente.
- Per disattivare/minimizzare il "thinking" su questa generazione di modelli, il campo corretto è `generationConfig.thinkingConfig.thinkingLevel` (valori: `low`/`medium`/`high`), **non** `thinkingBudget` (quello è per la generazione 2.5, su 3.x viene ignorato silenziosamente, nessun errore). `'minimal'` risulta rifiutato (`400 INVALID_ARGUMENT`) su `gemini-3.5-flash`/`gemini-flash-latest`: `'low'` è il livello minimo realmente accettato, e anche a quel livello consuma in modo variabile ~90-400+ token di "thinking" prima di scrivere la risposta (contano nel budget di `maxOutputTokens`, quindi un cap troppo stretto tronca la risposta vera con `finishReason: "MAX_TOKENS"` senza testo). `MAX_OUTPUT_TOKENS` in `lib/formazione-chat.ts` è stato quindi impostato a 1500, non un valore più conservativo tipo 800.

**Turnstile**: widget "formazione-chat" (azione `formazione-chat`, validata server-side su `verifyTurnstile` in `lib/formazione-chat.ts`), reso invisibile lato client via `execution: 'execute'` + `appearance: 'interaction-only'` (nessun checkbox visibile a meno che Cloudflare non richieda un challenge interattivo) — eseguito una volta per ogni messaggio inviato. **Il reset (`turnstile.reset`) va fatto DOPO che la richiesta al backend è completata, non subito dopo aver ottenuto il token**: resettare prima manda in errore (Turnstile error `600010`) la `execute()` successiva nella stessa sessione — scoperto live, non documentato esplicitamente da Cloudflare.

**Memoria conversazione**: multi-turno tenuto lato client, max 6 messaggi (`MAX_MESSAGES`, ricappato anche server-side indipendentemente da cosa manda il client), persistito in `sessionStorage` (scoped per lingua) così sopravvive alla navigazione tra pagine — il sito è multi-pagina, ogni click crea una nuova istanza del widget — ma si azzera alla chiusura del tab. Nessuno storage lato server. Anche lo stato aperto/chiuso del pannello è persistito allo stesso modo.

**Personalizzazione da Tina**: `settings.chatAssistant` (un gruppo di campi per lingua, come il resto di `settings` — niente suffisso "En"): `title`/`greeting` sovrascrivono titolo e messaggio iniziale se non vuoti; `extraInstructions` è testo libero **aggiunto dopo** le regole fisse di grounding/sicurezza nel system prompt (`buildSystemPrompt` in `lib/formazione-chat.ts`), mai in sostituzione — un editor non tecnico può aggiungere tono/persona ma non disattivare "rispondi solo dalle schede pubblicate" o "ammetti quando non sai"; `autoOpen` apre la chat da sola alla prima visita di ogni sessione, ma rispetta la scelta del visitatore se la chiude esplicitamente (non si riapre da sola più volte). La finestra è anche ridimensionabile manualmente (`resize: both` nativo CSS sul pannello, disattivato su mobile).

## Mappa file

- `tina/config.ts` — collection `resources` + template blocco `ResourceArchive`.
- `src/lib/resources.ts` — dati/helper: slug, localizzazione (`localizeResource`), tag (colori, traduzioni, slug-filtro), `buildWikilinkResolver`, `getKnowledgeResources`.
- `src/lib/resource-markdown.ts` — Markdown + wikilink → HTML/plain-text, dedicato a `resources` (non condiviso con `lib/tina-rich-text.ts`).
- `src/components/ResourceCard.astro` — card archivio.
- `src/components/blocks/ResourceArchive.astro` — blocco Tina: griglia card + barra ricerca + filtri tag.
- `src/components/ResourceView.astro` — pagina scheda (dettaglio), condivisa IT/EN, dispatchata da `[...slug].astro`/`en/[...slug].astro` (vedi bug di routing sopra).
- `src/content/resources/*.md` — le schede stesse (12 oggi, tutte Cerimoniale).
- `src/content/pages/{it,en}/formazione.md` — pagina indice (banner + blocco `ResourceArchive`).
- `src/lib/formazione-chat.ts`, `src/pages/api/formazione-chat.ts`, `src/components/FormazioneChatWidget.astro` — assistente AI (vedi sezione dedicata sopra).
