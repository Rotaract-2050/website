# Search Console, Google Analytics 4, tracking — riferimento

Implementato 2026-08. Leggere prima di toccare `gaMeasurementId`/`gscVerification`, il banner cookie, il sitemap/robots, o di aggiungere un nuovo evento GA4.

## Dove vive cosa

- **Impostazioni sito** (`tina/config.ts`, collection `settings`, file unico `src/content/settings/settings.md`): `gaMeasurementId` (GA4 Measurement ID, es. `G-XXXXXXXXXX`) e `gscVerification` (solo il valore `content` del meta tag di verifica proprietà Search Console, non il tag intero). Entrambi opzionali — vuoti = funzionalità disattivata, non un errore.
- **`src/lib/env.ts`** — `isProdHost(url, site)`: confronta l'host della richiesta con l'host configurato in `astro.config.mjs` (`site`). Unica fonte di verità per "siamo in produzione o no" (beta.rotaract2050.org, localhost, preview Cloudflare → sempre "no"). Usato in tre punti indipendenti, tutti devono restare coerenti se si cambia la logica:
  - `BaseLayout.astro` → forza `noindex` su ogni pagina se non prod, e passa `gaMeasurementId={onProdHost ? settings.gaMeasurementId : null}` a `CookieConsent` (GA non si attiva mai fuori produzione, a prescindere dal valore salvato in Tina).
  - `src/pages/robots.txt.ts` → fuori produzione risponde `Disallow: /` invece delle regole vere.
- **`src/components/CookieConsent.astro`** — banner IT/EN. Se `gaMeasurementId` è `null`/vuoto non renderizza nulla (niente banner, niente script). Se valorizzato: mostra banner solo se non c'è già una scelta in `localStorage` (`cookie-consent: granted|denied`), **nessuno script di Google viene caricato finché l'utente non clicca "Accetta"** (niente gtag.js precaricato con consent-mode "denied": qui semplicemente non si carica nulla finché non c'è consenso, più semplice e più sicuro del consent-mode "avanzato" di Google, adeguato per un sito senza ads/remarketing). Lettura/scrittura `localStorage` sempre in try/catch — può lanciare in webview sandboxate (es. pannello anteprima di un IDE) o private-browsing: se lancia e non è gestito, lo script muore *prima* di attaccare i listener dei bottoni e il banner sembra "non rispondere al click" pur non dando errori in console (bug reale visto e risolto in questa sessione).
- **`astro.config.mjs`** — `PAGE_SLUGS` per la sitemap filtra via `matter()` ogni `pages/*.md` e **esclude quelle con `seo.noindex: true`** (una pagina noindex elencata in sitemap è un segnale che Google segnala come conflitto — vedi Search Console → Copertura).

## Layer di tracking click generico (`data-track` / `data-track-sentinel`)

Definito in `BaseLayout.astro` (script principale, non `is:inline` — TypeScript type-checked), non uno script per componente:

- `window.trackEvent(name, params?)` — no-op finché `CookieConsent` non ha definito `window.gtag` reale dopo il consenso. Sicuro da chiamare ovunque, sempre.
- Qualunque elemento con `data-track="nome_evento"` (+ opzionale `data-track-params='{"k":"v"}'`, JSON) spara l'evento al click — un solo listener delegato su `document`, funziona anche su elementi creati via JS a runtime (es. popup Leaflet in `ClubsMap.astro`, righe file in `MaterialsGrid.astro`) perché la delega non richiede che l'elemento esista al momento in cui lo script gira.
- Qualunque elemento con `data-track-sentinel="nome_evento"` spara l'evento **una volta sola**, la prima volta che entra in viewport (`IntersectionObserver`) — pattern "letto fino in fondo", non "pagina aperta".
- Aggiungere un nuovo evento = aggiungere l'attributo HTML nel componente giusto, **non** scrivere un nuovo `<script>`/listener. Estendere così, non duplicare il meccanismo.

**Eventi già cablati** (nomi/parametri — riusare questi pattern per coerenza, non inventarne di paralleli):

| Evento | Dove | Parametri | Meccanismo |
|---|---|---|---|
| `cta_join_click` | Header, bottone "Entra nel Rotaract" | — | `data-track` |
| `event_tickets_click` | `EventCard.astro` + dettaglio evento (IT/EN) | `event_name` | `data-track` |
| `event_photos_click` | idem | `event_name` | `data-track` |
| `club_click` | `ClubDirectory.astro` + popup `ClubsMap.astro` | `club_name`, `zone_name` (`'map'` se da mappa) | `data-track` |
| `material_open` | `MaterialsGrid.astro`, riga file (non il link "apri cartella intera") | `file_name` | `data-track` |
| `formazione_read_complete` | `ResourceView.astro`, sentinel dopo `.article-body` | `resource_title` | `data-track-sentinel` |
| `formazione_chat_open` | `FormazioneChatWidget.astro`, `openPanel()` | — | chiamata diretta a `window.trackEvent?.(...)` (già dentro uno script client, non serve l'attributo) |
| `lang_switch_click` | Header, switch IT/EN | `to_lang` | `data-track` |
| `social_link_click` | Header + Footer, icone social | `network` | `data-track` |
| `utility_link_click` | Header, barra utility (Rotary Distretto/International/My Rotary/Brand Center) | `link_label` | `data-track` |
| `interact_link_click` | Header, link "Interact" nel dropdown (`.dropdown-interact-link`) | — | `data-track` |
| `family_card_click` | `blocks/FamilyGrid.astro`, bottone della card (solo se ha `buttonLabel` + href) | `family_org` | `data-track` |
| `club_contact_click` | `ClubDetail.astro`, email / sito / Instagram / Facebook del club | `club_name`, `channel` (`email`/`website`/`instagram`/`facebook`) | `data-track` — è la conversione principale del sito (aspirante socio → club) |
| `news_read_complete` | `NewsArticleView.astro`, sentinel dopo `.article-body` | `article_title` | `data-track-sentinel` |
| `formazione_chat_message` | `FormazioneChatWidget.astro`, a ogni domanda inviata (dopo i guard input vuoto/rate-limit) | `message_index` (1, 2, 3… per caricamento pagina) — **mai il testo della domanda** (privacy) | chiamata diretta a `window.trackEvent?.(...)` |
| `formazione_chat_error` | idem, su errore | `error_type` (`turnstile` / status HTTP / `network`) | chiamata diretta a `window.trackEvent?.(...)` |
| `web_vitals` | Ogni pagina, dopo il consenso (`src/lib/web-vitals.ts`) | `metric_name` (LCP/INP/CLS), `metric_value` (ms arrotondati; CLS x1000), `metric_rating` (good/needs-improvement/poor) | `whenGaReady()` + import dinamico di `web-vitals` |
| `page_not_found` | `NotFoundView.astro` (`/404`, `/en/404`) | `page_path`, `page_referrer` (stringa vuota se assente) | `whenGaReady()` nello script della pagina |

**`content_group`** — ogni page view porta `content_group` in `gtag('config', id, { content_group })` (impostato in `CookieConsent.loadGa()`). Valori: `home`, `news`, `eventi`, `formazione`, `interact`, `club`, `service`, `pagina` (pagine Tina generiche), `404`. Derivato in un solo punto, `resolveContentGroup(pathname)` in `src/lib/analytics.ts`, chiamato da `BaseLayout.astro` (ignora il prefisso `/en`, quindi IT e EN finiscono nello stesso gruppo) e passato come prop a `CookieConsent`. Le pagine non vanno toccate; `BaseLayout` accetta solo l'override `contentGroup` per i casi in cui il path non descrive la pagina (la vista 404 resa via rewrite). Nuova sezione di primo livello = aggiungerla a `SECTION_GROUPS`, altrimenti cade in `pagina`. In GA4 va registrata come dimensione personalizzata (ambito evento) per usarla nei report.

**`whenGaReady(cb)`** (`src/lib/ga-ready.ts`) — per codice bundled che deve partire solo dopo il consenso, anche se questo arriva sulla pagina corrente: esegue subito se `window.gtag` esiste, altrimenti al window event `ga:ready` che `loadGa()` emette alla fine. Se l'utente non accetta non parte mai (zero download per chi rifiuta). Usarlo invece di code accodate: `trackEvent` pre-consenso resta un no-op voluto, nessun evento viene ritardato e sparato retroattivamente.

**Web Vitals** — LCP/INP/CLS via pacchetto `web-vitals` (versione esatta in `package.json`), importato dinamicamente da `reportWebVitals()` dentro `whenGaReady`, quindi in un chunk a parte scaricato solo dopo il consenso.

**Parametri invisibili finché non registrati**: ogni parametro custom (`club_name`, `channel`, `content_group`, `metric_name`…) va registrato in GA4 come dimensione personalizzata a livello di evento (Amministrazione → Definizioni personalizzate), altrimenti non compare né nei report né via API/MCP. Nuovo parametro nel codice = nuova dimensione nel pannello.

**404** — `src/pages/404.astro` + `src/pages/en/404.astro` (status 404, `noindex`, link alla home) rendono `NotFoundView.astro`. `GenericPageView.astro` (catch-all, slug sconosciuto) fa `Astro.rewrite` a `/404` o `/en/404` invece del vecchio redirect 302 alla home, così l'URL richiesto resta nel browser e `page_not_found` riporta il path reale. Gli slug mancanti di news/club/eventi/formazione/service continuano a redirigere (indice della sezione, o home per service) e non generano né 404 né `page_not_found`.

**Enhanced Measurement GA4** (scroll, click su link esterni, download file, ricerca sito) è una feature standard di GA4 **attivabile solo dal pannello** (Amministrazione → Flussi di dati → flusso web → ingranaggio "Misurazione avanzata"), non da codice — copre gran parte dei click "generici" senza bisogno di altri `data-track`. Prima di aggiungere un evento custom per qualcosa che assomiglia a "click su link esterno" o "scroll", controllare se Enhanced Measurement non lo copre già.

## SEO: titolo pagina (Search Console) ≠ titolo banner (visivo)

Il campo `title`/`titleEn` della collection `pages` è pensato per il banner di pagina — **tutto maiuscolo per scelta editoriale** (lo stile uppercase è comunque applicato via CSS `text-transform` in `PageBanner.astro`, il contenuto non avrebbe bisogno di essere digitato in caps, ma lo è per convenzione redazionale). Quel campo alimenta anche il tag `<title>` HTML di default — che finisce **sia** nei risultati di ricerca Google **sia** nei report GA4 come dimensione `page_title` — dove il tutto-maiuscolo è penalizzante (sembra spam in una SERP, illeggibile in un report).

Fix strutturale già nello schema: `seo.title`/`seo.titleEn` (dentro il campo `seo` object di ogni pagina) fa da override — se vuoto, `GenericPageView.astro` ricade su `title`. **Ogni pagina con un `title` tutto-maiuscolo dovrebbe avere anche un `seo.title` in maiuscolo/minuscolo naturale** (fatto 2026-08 per tutte le pagine tranne `home`/`privacy`, il cui `title` è già naturale). Nuove pagine: stessa regola, non lasciare `seo.title` vuoto se `title` è in caps.

## `robots.txt`: un solo file serve, non due

`src/pages/robots.txt.ts` (route dinamica, hostname-aware — vedi sopra) è l'unico che deve esistere. Un file statico `public/robots.txt` **oscura silenziosamente** la route dinamica (Astro serve gli asset statici prima delle route quando i path coincidono) — bug reale successo in questo progetto: il file statico con le regole vecchie/sbagliate veniva servito, la route dinamica con la logica corretta non veniva mai raggiunta, senza nessun errore. Se serve modificare le regole robots, editare solo `robots.txt.ts` e verificare che `public/robots.txt` non sia stato ricreato per sbaglio (es. da un tool che scaffolda asset pubblici di default).

## Sitemap Search Console: "Pagine rilevate: 0" appena inviata

Normale, non un bug. GSC riporta prima "Sitemap letta con successo" (giorno stesso), poi popola "Pagine rilevate" **dopo** aver effettivamente scansionato le URL elencate — 24-72h per un sito nuovo, a volte di più. Controllare il contenuto reale della sitemap via `curl https://rotaract2050.org/sitemap-index.xml` prima di sospettare un bug: se contiene URL valide (`sitemap-0.xml` con `<loc>` popolati), il problema è solo tempo, non codice.

## Deploy: solo una PR mergiata su `main` triggera una build

Vedi `references/cloudflare-deploy.md` per il meccanismo — qui il corollario pratico: il lavoro committato/pushato su `dev` (anche se già "finito" e verificato in locale) **non arriva mai in produzione da solo**. Serve aprire (o far aprire) una PR `dev` → `main` e mergiarla. I commit di auto-save di TinaCMS Cloud finiscono direttamente su `main` ma sono contenuto puro (`src/content/`, `public/uploads/`) — non triggerano una build e, in questa architettura (contenuto letto a runtime via client GraphQL Tina, non baked-in al build), non ne hanno bisogno.
