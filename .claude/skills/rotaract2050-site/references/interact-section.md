# Sezione Interact — "seconda home" a tema

Sotto-sezione del sito dedicata al distretto Interact (fascia 12-18 anni, sotto l'ombrello Rotary/Rotaract), pensata deliberatamente come una **seconda home**: stessi blocchi/componenti/UX del sito Rotaract, solo il colore cambia in blocco. Vincolo esplicito dell'utente all'origine: **non una sezione parallela ridisegnata da zero** — quando serve un nuovo blocco per l'Interact, prima domanda da farsi è "esiste già un blocco Rotaract che fa questo?", e se sì si clona (vedi sotto perché clonare e non parametrizzare) invece di reinventare il layout.

## Meccanismo di tema — CSS custom properties scoped

Il sito non usa Tailwind: 100% CSS custom properties definite in `src/styles/global.css` (`:root`), consumate da ogni blocco via `var(--color-x)`. Il tema Interact è **`src/styles/interact-theme.css`**, uno scope `[data-theme='interact']` che ridefinisce gli stessi nomi di custom property — attivato mettendo `data-theme="interact"` sul wrapper `.page` in `BaseLayout.astro` quando la prop `theme="interact"` è passata. Nessun componente blocco va toccato per la retheme: leggono già `var(--color-pink)` ecc, non hex letterali (quando lo fanno, è un bug — vedi sotto).

**Colori ufficiali usati** (tutti da brandcenter.rotary.org, nessuno inventato — vedi `references/rotary-brand.md`):

| Ruolo (token) | Rotaract | Interact | Perché |
|---|---|---|---|
| `--color-pink` (accent/CTA/link — "colore del logo") | Cranberry `#D41367` | Sky Blue `#00A2E0` | colore reale del logo Interact (PMS 2202C) |
| `--color-navy` (chrome scuro header/footer) | `#0B2545` (non ufficiale) | Royal Blue `#17458F` | colore ufficiale "Rotary" wordmark |
| `--color-royal-blue` (3° accento puntuale) | `#17458F` | Azure `#0067C8` | libero perché Royal Blue è passato a `--color-navy` |
| `--color-gold` (accento caldo) | `#F7A81B` | Orange `#FF7600` | stesso ruolo, colore già in palette (tag zona) |

`BaseLayout.astro`: prop `theme?: 'rotaract' | 'interact'` (default `'rotaract'`, comportamento invariato) + `siteName?: string` (per il suffisso `<title> | X`). Sceglie `Header`/`Footer` vs `InteractHeader`/`InteractFooter`.

## Eccezioni hardcoded — dove si nascondono, come trovarne di nuove

Alcuni componenti scrivono un colore letterale invece di leggere la custom property — invisibili alla retheme finché non li si trova a mano. **Tre trovati finora, tutti risolti**, con lo stesso pattern di fix:

- **`ClubsMap.astro`**: pin Leaflet `fill="#d41367"` in una stringa SVG JS. Prop `pinColor` (default invariato) + `linkBase` (`null` per Interact: niente pagina dettaglio club, vedi sotto).
- **`CtaBanner.astro`** e **`SplitSection.astro`**: `var(--color-pink)` usato più volte nello stile. Prop opzionale `accent` + campo Tina `accent` (stessa lista di opzioni: Cranberry/Sky Blue/Gold/Azure), che imposta via `style` **scoped al singolo elemento** le custom property `--color-pink`/`--color-pink-dark`/(`--color-pink-container`/`--color-on-pink-container` per SplitSection) — stesso meccanismo del tema globale, solo ristretto a un'istanza. Zero rischio per le altre istanze del blocco sul sito: nessuna modifica al CSS del componente, solo un override locale quando la prop è passata.
- **`Hero.astro`**: il gradiente overlay del carosello era `linear-gradient(..., rgba(168, 15, 83, ...))` letterale (RGB di `--color-pink-dark`) — **bug reale, non trovato nella prima passata**, segnalato dall'utente dopo aver visto il carosello ancora rosa su `/interact`. Fix: `color-mix(in srgb, var(--color-pink-dark) N%, transparent)`.

**Come cercarne altri**: `grep -rniE "d41367|168,\s*15,\s*83|212,\s*19,\s*103|a80f53" src/components/` per Cranberry/pink-dark, `#f7a81b`/`#17458f` per gold/royal-blue. Controllare in particolare ogni blocco effettivamente usato su una pagina `/interact/*` (non basta che il componente esista, va verificato quali blocchi compaiono davvero in `src/content/pages/interact*.md`).

**Il caso opposto**: `Header.astro`/`FormazioneChatWidget.astro` hanno colori Cranberry hardcoded ma **non vanno toccati** — vivono fuori dallo scope Interact (`Header.astro` non renderizza mai su `/interact/*`, sostituito da `InteractHeader.astro`; `FormazioneChatWidget` resta intenzionalmente Rotaract-brandizzato perché `/formazione` è condivisa tra le due sezioni, decisione esplicita dell'utente — non ritemizzarla).

## Modello contenuti Tina

**Riuso della collection `pages` con path annidati — non una collection parallela.** `pageRouter` in `tina/config.ts` usa `document._sys.breadcrumbs.join('/')`, quindi `src/content/pages/interact/storia.md` risolve automaticamente a `/interact/storia`, stesso meccanismo di `events/<anno>/<slug>.md`. File attuali: `pages/interact.md` (home), `pages/interact/{storia,albo,club,eventi}.md`.

**Gotcha scoperto costruendo la sezione**: il `name` di una collection Tina **deve essere alfanumerico/underscore, niente trattini** — `interact-clubs`/`interact-events` falliva la build (`must be alphanumeric and can only contain underscores`). Risolto rinominando in camelCase (`interactClubs`/`interactEvents`), lasciando `path` (cartella su disco) coi trattini per coerenza col resto del progetto — `name` e `path` non devono combaciare.

**Collection isolate, non condivise col Rotaract** (decisione esplicita): `interactClubs` (path `src/content/interact-clubs`) e `interactEvents` (path `src/content/interact-events/<anno-rotariano>/<slug>.md`). **Eccezione**: `interactClubs.zone` referenzia la **stessa** collection `zones` del Rotaract — il distretto Interact usa le stesse 4 zone geografiche, niente duplicazione. `interactEvents` v1 **non ha campi ticketing** (`ticketsOpen`/`ticketsUrl`/`photoAlbumUrl`/`ticketWidgetEmbed` omessi) — non c'è ancora un bisogno reale per eventi 12-18 anni, aggiungibile dopo senza rompere nulla.

## Blocchi: clonare, non parametrizzare

`ClubDirectory`/`EventsCalendar`/`EventsArchive` **non sono riusabili invariati** su `interactClubs`/`interactEvents`: Tina genera una query GraphQL tipizzata per nome-collection (`clubsConnection` vs `interactClubsConnection`), quindi un componente non può puntare a una collection scelta a runtime senza perdere type-safety. Da qui il pattern: `InteractClubDirectory.astro`/`InteractEventsCalendar.astro`/`InteractEventsArchive.astro` sono **cloni deliberati**, non varianti parametrizzate. Stesso motivo per `src/lib/interact-events.ts` (clone di `lib/events.ts`) — precedente già nel progetto: `resources` ha una propria `lib/resources.ts` invece di essere piegato dentro `lib/news.ts`.

**Eccezione che si riusa invariata**: `RrdTimeline.astro` — props scalari pure, zero dipendenza da GraphQL. Il blocco Tina `InteractDirTimeline` (stesso schema di `rrdTimelineTemplate`, rinominato solo perché la label RRD sarebbe fuorviante nel picker blocchi) ha un branch a parte in `BlockItem.astro` che punta allo **stesso import** di `RrdTimeline`.

`EventCard.astro` si riusa invariato anche nell'archivio Interact (props scalari, nessuna dipendenza dal tipo Tina generato) — passa sempre `ticketsUrl={null}`/`photoAlbumUrl={null}` dato che lo schema `interactEvents` non ha quei campi.

## Direttorio club: niente pagina di dettaglio, deliberatamente

`InteractClubDirectory.astro` mostra card club **senza link** (solo icone social cliccabili) — non esiste `/interact/club/<slug>`. Scelta deliberata per evitare la stessa classe di bug di routing già documentata nel repo (una route dinamica annidata a un livello, es. `club/[slug].astro`, perde sempre contro il catch-all `[...slug].astro`, causa non identificata — vedi `references/formazione-knowledge-base.md` per lo stesso bug su `/formazione`). Se in futuro serve davvero una pagina di dettaglio club Interact, replicare prima il workaround già in uso per `news`/`formazione` (guardia di prefisso + import dinamico dentro `[...slug].astro`, non un file di route annidato a sé).

## Routing

- **`InteractPageView.astro`**: clone di `GenericPageView.astro` (stessa query `pages`, stessa estrazione campi), ma chiama `BaseLayout` con `theme="interact"`. Clonato invece di aggiungere un `if` a `GenericPageView.astro` per non toccare il path a più alto traffico del sito.
- **`src/pages/[...slug].astro`/`en/[...slug].astro`**: guardia `interactSlug` (stesso pattern di `newsSlug`/`resourceSlug`) che smista `interact`/`interact/*` su `InteractPageView`.
- **`src/pages/interact/eventi/[year]/[slug].astro`** (+ gemello EN): route a due segmenti fissi, stesso schema **sicuro** già usato da `eventi/[year]/[slug].astro` — evita sia il bug rest-param-vs-index sia quello nested-dynamic-route-vs-catch-all (a differenza della pagina dettaglio club, qui il pattern a 2 segmenti fissi è già collaudato e non serve il workaround guardia+import-dinamico).
- `astro.config.mjs`: `interactEventSlugs` (stesso pattern di `eventSlugs`) incluso in `customPages` per la sitemap. `routes.ts`: 5 nuove `PageKey` (`interactHome`/`Storia`/`Club`/`Albo`/`Eventi`), necessarie sia alla nav di `InteractHeader`/`InteractFooter` sia alla sitemap (che itera `pageSlugs`).

## Header/Footer: componenti a sé, non parametrizzazioni

`InteractHeader.astro`/`InteractFooter.astro` sono nuovi componenti, non varianti di `Header.astro`/`Footer.astro` — quei due sono troppo accoppiati alla nav/PageKey Rotaract e ad elementi decorativi solo-Rotaract (es. il gradiente `.formazione-btn`). Riusano ciò che è genuinamente condiviso: `SOCIAL_LINKS`/`UTILITY_LINKS`, lang switch, script menu mobile. `InteractHeader` ha una pillola "← Rotaract Distretto 2050" assente nell'header Rotaract, per rendere visibile in UI il concetto di "un click per tornare". **Logo**: wordmark testuale placeholder ("INTERACT / Distretto 2050") finché l'utente non fornisce il logo ufficiale scaricato dal Brand Center — non disegnare un'icona custom, vedi `references/rotary-brand.md` sulle regole loghi.

`BaseLayout.astro` **non è forkato**: la parte condivisa (SEO head, hreflang, JSON-LD, cookie consent, GA, scroll-reveal) resta un solo file per non rischiare drift tra le due sezioni — solo Header/Footer e `data-theme` sono condizionali via la prop `theme`.

## Punti d'ingresso dal sito Rotaract

Tre, aggiunti in momenti diversi su richiesta esplicita, tutti attivi contemporaneamente:

1. **Pillola blu nella nav principale** (`Header.astro`, tra "Materiali" e "Entra nel Rotaract") — visibile su ogni pagina del sito, non solo in home. Colore Sky Blue scritto letterale (non `var()`: questo link vive fuori dallo scope `[data-theme="interact"]`, stesso precedente delle eccezioni hardcoded sopra).
2. **Blocco `FamilyGrid`** in home (vedi sotto).
3. Dentro `/interact` stesso, lo stesso `FamilyGrid` compare a specchio (vedi sotto).

## Blocco `FamilyGrid` — "La nostra famiglia" (Rotary/Rotaract/Interact)

Non è specifico dell'Interact — è un blocco generico (`tina/config.ts`: `familyGridTemplate`, componente `src/components/blocks/FamilyGrid.astro`) che compare **su entrambe le home**, ognuna con le proprie card:

- `home.md` (Rotaract): card Rotary + Interact (Rotaract omesso — è il sito su cui si è già).
- `interact.md`: card Rotary + Rotaract (Interact omesso, stesso motivo). Card Rotaract linka alla root (`buttonHref: ''`).

**Non usare `CardGrid`** per pattern simili: `CardGrid.color` è la palette secondaria per tag/zona (Turquoise/Violet/Orange/Grass), semanticamente diversa dai colori identitari primari (Royal Blue/Cranberry/Sky Blue) che `FamilyGrid` usa per card grandi con corpo testo + bottone.

**Gotcha nel campo `buttonHref`**: `''` (stringa vuota) è un target valido — la root del sito — non "nessun bottone". La prima versione del componente collassava `undefined`/`null`/`''` nello stesso ramo (`item.buttonHref ?? ''` poi `href === '' ? undefined : ...`), quindi la card Rotaract su `interact.md` non mostrava il bottone. Fix: distinguere esplicitamente `href == null` (nessun bottone) da `href === ''` (root, bottone mostrato). Tenerlo a mente se si aggiungono altri blocchi con `buttonHref`/`ctaHref` opzionale che deve poter puntare alla home.

**Griglia adattiva**: `.card-row` usa `grid-template-columns: repeat(auto-fit, minmax(260px, 1fr))` con `max-width`, non un `repeat(3, 1fr)` fisso — il blocco mostra 2 o 3 card a seconda della pagina, deve restare centrato/bilanciato in entrambi i casi senza colonna vuota storta.

**Link esterni**: `buttonHref` che inizia con `http`/`https` è trattato come esterno (`target="_blank" rel="noopener"`), il resto risolto internamente via `getRelativeLocaleUrl`. Usato per la card Rotary, che linka al sito Rotary Distretto 2050 (`https://www.rotary2050.org/site/`, già presente in `UTILITY_LINKS`).

## Ambiente di sviluppo locale — gotcha non specifici a questa sezione ma scoperti lavorandoci

Vedi la sezione "Avviare il sito in locale" in questo stesso file (`SKILL.md`) per i due problemi hit durante questo lavoro (pagina bianca da `.env` non risolto, cache Vite corrotta dopo troppi riavvii ravvicinati) — non richiedono nulla di specifico all'Interact, ma sono emersi iterando pesantemente su schema/contenuti di questa sezione.

## Mappa file

- `tina/config.ts` — collection `interactClubs`/`interactEvents`, template blocco `InteractDirTimeline`/`InteractClubDirectory`/`InteractEventsCalendar`/`InteractEventsArchive`/`FamilyGrid`, campo `accent` su `ctaBannerTemplate`/`splitSectionTemplate`.
- `src/styles/interact-theme.css` — override colore, scoped `[data-theme="interact"]`.
- `src/layouts/BaseLayout.astro` — prop `theme`/`siteName`.
- `src/components/InteractHeader.astro`, `InteractFooter.astro`, `InteractPageView.astro`.
- `src/components/blocks/InteractClubDirectory.astro`, `InteractEventsCalendar.astro`, `InteractEventsArchive.astro`, `FamilyGrid.astro`.
- `src/lib/interact-events.ts`.
- `src/pages/[...slug].astro`/`en/[...slug].astro` — guardia `interactSlug`.
- `src/pages/interact/eventi/[year]/[slug].astro` (+ `en/`).
- `src/content/pages/interact.md`, `interact/{storia,albo,club,eventi}.md`.
- `src/content/interact-clubs/*.md`, `src/content/interact-events/<anno>/*.md`.
- `src/data/routes.ts` — 5 `PageKey` Interact. `src/data/ui-strings.ts` — blocco `interact` (nav/footer Interact) + `nav.interactLink` (pillola Rotaract).
