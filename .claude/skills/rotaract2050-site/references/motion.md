# Animazioni: motion.dev — decisioni prese

Riferimento su come il sito anima elementi (entrance on-load, stagger scroll-triggered) con la libreria `motion` (motion.dev). Da leggere prima di aggiungere o modificare un'animazione, o prima di introdurre una nuova libreria di animazione.

## Perché motion.dev e non astroanimate.com

Prima scelta era `@astroanimate/core` (componenti Astro puri tipo `<ScaleIn enhance>`). Bloccato all'installazione: il suo peer-dep dichiara supporto solo per Astro `^4.0.0 || ^5.0.0 || ^6.0.0`, il sito è su Astro `7.x` — `npm install` falliva con `ERESOLVE`. `--legacy-peer-deps` risolveva l'errore ma **cambiava silenziosamente la risoluzione dell'intero albero delle dipendenze**, eliminando i pacchetti `@codemirror/*` di cui dipende l'editor rich-text dell'admin TinaCMS (scoperto solo confrontando `package-lock.json` prima/dopo l'installazione — npm non lo segnala come errore). Dopo il rollback, `npm view motion` ha confermato che motion.dev è una libreria **enormemente più matura** (v13.0.0, 440 versioni pubblicate, team ex-Framer/popmotion, pubblicata pochi giorni prima del controllo) e **framework-agnostico by design**: nessun peer-dep su un framework specifico, quindi nessun conflitto con la versione di Astro del sito, presente o futura.

**Lezione per il futuro**: prima di aggiungere una libreria che dichiara un peer-dep su Astro, controllare che copra la versione installata (`astro --version` o `package.json`) **prima** di eseguire `npm install`, non dopo un errore ERESOLVE. E se `npm install` propone `--legacy-peer-deps`/`--force`, **non usarli automaticamente**: confrontare `package-lock.json` prima/dopo con `git diff --stat` e cercare pacchetti spariti, specialmente quelli di TinaCMS (rich-text editor, admin UI) che potrebbero non essere ovviamente collegati al pacchetto appena installato. Se il conflitto è solo un peer-dep troppo conservativo su un pacchetto altrimenti a zero-dipendenze, un `overrides` mirato in `package.json` (vedi npm docs, sintassi `"overrides": { "<pkg>": { "<peer>": "$<peer>" } }`) risolve senza toccare la risoluzione globale.

## Cos'è, come si importa

`npm install motion` (pacchetto npm `motion`, non `framer-motion` — quello è la dipendenza interna per la parte React, non usata qui). Import diretto da codice vanilla:

```ts
import { animate, inView } from 'motion';
```

Nessuna configurazione in `astro.config.mjs`. Nessun `client:*`: `animate`/`inView` sono funzioni DOM pure, non componenti React — si usano dentro i `<script>` vanilla che il sito già usa per Hero (carosello), EventsCalendar (swap agenda/mese), StatsBar (count-up) — vedi `references/astro.md` sezione "Componenti Astro — convenzioni". Verificato leggendo i tipi installati (`node_modules/motion/node_modules/framer-motion/dist/dom.d.ts`), non a memoria — se questo file non esiste più a una versione futura del pacchetto, ri-controllare lì prima di fidarsi delle firme sotto.

## Pattern del sito: `src/lib/motion.ts`

Non chiamare `animate()`/`inView()` direttamente nei blocchi — usare l'helper condiviso `src/lib/motion.ts`:

- `m3Duration` / `m3Easing` — mirror in JS dei token CSS `--motion-duration-*`/`--motion-easing-*` di `src/styles/global.css`. Le CSS custom properties non sono leggibili da un'opzione di animazione JS: se i token in `global.css` cambiano, aggiornare anche questi a mano.
- `prefersReducedMotion()` — stesso guard `matchMedia('(prefers-reduced-motion: reduce)')` già usato in `BaseLayout.astro`/`StatsBar.astro`. Ogni funzione sotto lo chiama per prima cosa e ritorna senza fare nulla se vero.
- `cappedStagger(stepSeconds, max = 4)` — restituisce `(i) => Math.min(i, max) * stepSeconds`, da passare come opzione `delay` di `animate()` quando si anima una lista di elementi. Evita che l'ultima card di una grid lunga (colonna singola su mobile) aspetti secoli prima di animare.
- `revealOnLoad(target, keyframes, options?)` — per contenuto sempre visibile al primo load (es. Hero, sopra la piega). Anima subito, nessun trigger di scroll.
- `revealOnScroll(container, targets, keyframes, options?)` — per contenuto sotto la piega, margine di trigger fisso al -10% (hardcoded, nessun call site nel sito ne ha mai avuto bisogno di uno diverso — se serve, aggiungere il parametro con un tipo `MarginType` importato da `motion`, non una `string` generica: `inView()` ha una firma a template-literal string stretta che una `string` semplice non soddisfa, vedi l'errore TS che questo ha causato la prima volta). Imposta l'attributo `data-anim-hide` sui target **appena la funzione viene chiamata** (non al momento dell'intersezione — stesso principio di `initScrollReveal` in `BaseLayout.astro`: nascondere molto prima che l'utente ci scrolli, mai mentre è già in vista), poi usa `inView()` per animare quando `container` entra in viewport, una volta sola (la funzione di stop restituita da `inView()` viene invocata subito dopo il primo trigger dentro la callback).

`[data-anim-hide] { opacity: 0; }` (+ override `prefers-reduced-motion: reduce`) vive in `global.css` accanto a `.reveal-init`/`.is-visible` — stessa filosofia: il contenuto resta visibile di default, l'attributo/classe che lo nasconde è sempre aggiunto dallo script, mai presente senza che JS stia per animarlo (eccetto l'Hero, vedi sotto).

### Caso speciale: contenuto SSR-nascosto (solo Hero)

Per l'Hero, `data-anim-hide` è scritto **direttamente nel markup server-side** di `Hero.astro` (non aggiunto da JS), perché il contenuto è sempre sopra la piega: nasconderlo via script dopo il primo paint rischierebbe un flash "visibile → nascosto → rianimato". Questo introduce un caso che `revealOnScroll` non copre: se JS è disabilitato del tutto (non reduced-motion, proprio niente JS), l'attributo scritto in HTML resterebbe per sempre e il contenuto sparirebbe. Soluzione locale nel componente, non un pattern globale nuovo:

```astro
<div class="hero-copy" data-hero-copy data-anim-hide>...</div>
<noscript><style>.hero-copy[data-anim-hide] { opacity: 1; }</style></noscript>
```

Se un altro blocco avesse bisogno dello stesso trattamento (contenuto sempre sopra la piega, non scroll-triggered), replicare questo `<noscript>` locale — non serve un meccanismo `no-js`/`js` a livello di sito per un caso che finora è solo l'Hero.

## Bug reale da tenere a mente: `transform` inline dopo l'animazione rompe `:hover`

Letto nel sorgente installato (`node_modules/motion-dom/dist/es/animation/NativeAnimation.mjs`, metodo `onfinish`): quando una `animate()` finisce, Motion scrive lo stato finale come **stile inline literal** sull'elemento (`setStyle(element, name, keyframe)`, es. `element.style.transform = 'scale(1)'`) e poi cancella la Web Animation sottostante. Uno stile inline batte qualunque regola da foglio di stile — quindi un elemento con una regola `:hover { transform: ... }` esistente (`.card:hover` in CardGrid, `.news-card:hover` in NewsCard, `a.event-row:hover` in EventsCalendar) avrebbe l'hover-lift **rotto permanentemente** dopo la prima entrance animation, perché lo stile inline lasciato da Motion vince sempre sulla regola CSS dell'hover.

`revealOnLoad`/`revealOnScroll` in `src/lib/motion.ts` puliscono esplicitamente `el.style.transform`/`el.style.opacity` (resettandoli a stringa vuota) in un `.then()` dopo la fine dell'animazione. È sicuro farlo sempre, incondizionatamente, perché ogni keyframe usato nel sito finisce al valore identità (scale/translate a riposo, opacity 1) — pulire lo stile inline a quel punto è visivamente equivalente a non averlo mai avuto.

**Se si scrive una nuova animazione fuori da questi due helper**, replicare questa pulizia o l'hover/qualunque altra interazione CSS sulla stessa proprietà smetterà di funzionare silenziosamente — non è un edge case raro, è il comportamento di default di Motion su `Element.animate()`/WAAPI.

## Blocchi che usano questo pattern

| Blocco | Trattamento | Note |
|---|---|---|
| `Hero.astro` | `revealOnLoad` su `.hero-copy` | SSR `data-anim-hide` + `<noscript>`, vedi sopra |
| `StatsBar.astro` | `revealOnScroll` stagger su `.stat` | count-up numerico esistente invariato, nessun conflitto |
| `SplitSection.astro` | due `revealOnScroll` separate (`.split-media` scale, `.split-copy` fade+rise con delay) | due `inView` indipendenti sullo stesso container, overhead trascurabile |
| `CardGrid.astro` | `revealOnScroll` stagger su `.card` | |
| `NewsGrid.astro` | `revealOnScroll` stagger su `.news-card` (root di `NewsCard.astro`) | |
| `EventsCalendar.astro` | `revealOnScroll` stagger solo su `.event-row` dentro `[data-day-agenda="default"]` | i pannelli filtrati per giorno restano non animati apposta — raggiunti via click, non scroll, animarli aggiungerebbe `IntersectionObserver` inutilizzati |
| `NewsTicker.astro` | nessuno | il marquee CSS esistente è già equivalente |
| `CtaBanner.astro`, `RrdTimeline.astro` | nessuno | blocco singolo (CtaBanner) o già ha la propria animazione CSS dedicata (RrdTimeline) |

Blocchi non ancora coperti (secondo giro, dopo validazione homepage): `ValuesGrid`, `RoleGrid`, `CommitteeGrid`, `ClubDirectory`, `EventsArchive`, `NewsArchive`, `MaterialsGrid`. Stesso pattern: `revealOnScroll` sugli item + esclusione del blocco da `data-reveal` in `BlockItem.astro` (vedi sotto). Aggiornare questa tabella quando si estende.

## Regola: niente doppio reveal

Il sito ha già un reveal a livello di blocco (`data-reveal` in `BlockItem.astro`, animato da `initScrollReveal()` in `BaseLayout.astro`). Un blocco che passa a un'animazione per-elemento con `revealOnScroll` va **escluso** da quell'esclusione generica in `BlockItem.astro` — altrimenti il blocco intero fa fade-in E i suoi elementi interni una seconda volta, doppia animazione, effetto sporco. I typename esclusi oggi: `PagesBlocksHero`, `PagesBlocksRrdTimeline` (animazione propria), `PagesBlocksStatsBar`, `PagesBlocksSplitSection`, `PagesBlocksCardGrid`, `PagesBlocksNewsGrid`, `PagesBlocksEventsCalendar`.
