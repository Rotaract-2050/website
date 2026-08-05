# Tag della sezione news — decisioni prese

Riferimento sulla struttura dei tag della collection Tina `news` (`tina/config.ts`), da leggere prima di modificare lo schema o l'UI dei tag. Decisioni prese in conversazione con il distretto il 31/07/2026.

## Cosa sostituisce cosa

Il vecchio campo `tag` (stringa libera, badge tematico tipo `PROGETTI`/`FORMAZIONE`/`SERVIZIO`) è stato **rimosso e sostituito** dai tag strutturati sotto. Scelta esplicita del distretto: per ora un unico sistema di tag (ambito + club + anno), non due sistemi paralleli. Se in futuro serve un badge tematico libero in più, va aggiunto come campo a sé — non riesumare `tag` come stringa libera senza discuterne, altrimenti si torna ad avere due tassonomie che divergono.

## I tag

1. **`clubs`** (`type: 'object', list: true`, ogni riga con un campo `club` di tipo `reference` verso la collection `clubs`) — un articolo può taggare **più club** (es. evento congiunto tra due club). Tina non supporta `list: true` direttamente su un campo `reference` (vedi warning `tina dev`, tina.io/docs/r/content-fields/#list-fields) — l'oggetto-lista con un solo `reference` dentro è il workaround documentato, non un'invenzione locale. Nei componenti: `article.clubs` è un array di `{ club: { name, ... } }`, non un array diretto di club.
2. **`scope`** (`type: 'string', list: true, options: ['Distretto', 'MDIO', 'Service Distrettuale', 'Service Interdistrettuale', 'Service Nazionale']`) — checkbox multiplo, un articolo può avere quante spunte servono (anche nessuna, se riguarda solo club specifici via `clubs`):
   - `Distretto` — news di interesse per tutto il Distretto 2050 (uso generico, non solo service).
   - `MDIO` — tag esatto richiesto dal distretto (i soci lo riconoscono così, non espanderlo/rinominarlo in UI o contenuti). Deciso il 31/07/2026, resta invariato.
   - `Service Distrettuale` / `Service Interdistrettuale` / `Service Nazionale` — aggiunti il 05/08/2026 per classificare i "service" (progetti/campagne strutturate tipo "Disegna il tuo FUTURO") per livello geografico-organizzativo: promosso da un singolo distretto, da più distretti (MDIO), o adottato a livello nazionale. Additivi rispetto a `Distretto`/`MDIO`, non li sostituiscono: un service del proprio MDIO può avere sia `MDIO` (è il nostro gruppo) sia `Service Interdistrettuale` (è il livello del progetto); un service nato nel Distretto 2050 e poi adottato a livello nazionale può avere sia `Service Distrettuale` (origine) sia `Service Nazionale` (adozione attuale). Un service di un **altro** distretto (non 2050, non nel nostro MDIO) prende solo il tag `Service *` pertinente, senza `Distretto`/`MDIO` (che restano riservati a "è cosa nostra").
3. **Anno rotariano (badge "AR 2026/2027")** — **non è un campo Tina**, è calcolato automaticamente dalla data di pubblicazione (`rotaryYearLabel()` in `src/lib/news.ts`). L'anno rotariano va dal 1° luglio al 30 giugno: un articolo datato `2026-07-18` è `AR 2026/2027`, uno datato `2027-03-10` è ancora `AR 2026/2027`. Nessun socio deve compilarlo a mano — se un giorno serve un AR diverso da quello della data (retrospettive, contenuti fuori sequenza), va discusso prima di aggiungere un campo manuale che possa disallinearsi dalla data.

## Colore per zona sui tag club

Ogni zona (`tina/config.ts`, collection `zones`) ha un campo `color` — select con i 4 colori "secondari" della palette Rotary riservati a tag/categorizzazione (`references/rotary-brand.md`): Turquoise, Violet, Orange, Grass. Assegnazione attuale (1:1 con le 4 zone, modificabile da Tina senza toccare codice): Francigena → Grass, Leonessa → Turquoise, Navigli → Orange, Padana → Violet.

I colori **primari** di brand (Cranberry, Rotary Gold, Azure, Royal Blue) sono volutamente esclusi dalle opzioni zona: Cranberry è il colore di default dei pill `scope` (Distretto/MDIO — vedi sotto), e gli altri tre sono riservati a CTA/link/sfondi scuri altrove nel sito. Tenerli fuori dai tag zona evita sia la collisione visiva con Distretto/MDIO sia l'uso di un colore identitario per una categorizzazione secondaria.

Il badge di un club tagg­ato su una news eredita il colore della sua zona (`club.zone.color`, risolto automaticamente dalla reference club→zona, stessa query già usata da `ClubDirectory`). I badge `scope` (Distretto/MDIO) restano nel Cranberry di default — non hanno una zona. Se una zona non ha ancora un colore impostato, il badge dei suoi club usa lo stesso Cranberry di default (fallback in CSS via `var(--tag-color, var(--color-pink))`), non un errore.

## Dove si usano

- `src/lib/news.ts`: `newsTagLabels(article)` produce un array di `{ label, color? }` — club prima (con `color` dalla zona), poi `scope` (senza colore); `tagPillStyle(color)` genera le CSS custom properties inline (`--tag-bg`, `--tag-color`) per colorare il singolo pill; `rotaryYearLabel(date)` calcola il badge AR.
- `src/components/NewsCard.astro`: badge dei tag sulla card (`tags` prop, ogni pill con `style={tagPillStyle(tag.color)}`) + badge AR accanto alla data (`yearLabel` prop).
- Pagina dettaglio articolo (`src/pages/news/[slug].astro`, `src/pages/en/news/[slug].astro`): stessi badge, resi a mano (non passano dalla card).

## Non ancora fatto

Il tag club esiste per poter mostrare le news di un club **sulla pagina di quel club** — ma oggi i singoli club (es. "Rotaract Club Brescia") non hanno una pagina propria: `/club` è un elenco di tutti i club per zona (blocco `ClubDirectory`), non ha route individuali. Costruire pagine di dettaglio per club (con URL, router Tina, e la lista delle news filtrate per quel club) è un lavoro separato, non incluso in questa modifica — va pianificato a parte quando richiesto.
