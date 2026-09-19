---
inclusion: auto
name: rotaract2050-design-system
description: Design system e convenzioni UI/CSS per il sito Rotaract Distretto 2050. Attivare quando si modificano o creano componenti Astro, stili CSS o pagine.
---

# Rotaract Distretto 2050 — Design System

L'estetica del sito è **premium / glassmorphism**. Queste regole sono non negoziabili.

## 1. Filosofia visiva

- **Glassmorphism / Dynamic Surfaces**: mai `background: #f0f0f0` per le card. Usare invece:
  ```css
  background: color-mix(in srgb, var(--tint) 14%, white);
  box-shadow: 0 8px 24px color-mix(in srgb, var(--tint) 35%, transparent);
  ```
- **Pattern "Badge"**: card left-aligned, padding `32px 24px`, corner radius `var(--shape-large)` / `--shape-extra-large`.
- **Watermark**: testo enorme semi-trasparente che overflow a destra (sfondo decorativo):
  ```css
  .watermark {
    font-size: 140px;
    font-weight: 900;
    color: rgba(0, 0, 0, 0.03);
    position: absolute;
    right: -20px;
    bottom: -20px;
  }
  ```

## 2. Colori — usare sempre le variabili CSS, mai hex hardcoded

- **Rotary Gold**: `var(--color-gold)` (`#f7a81b`)
- **Rotaract Pink / Cranberry**: `var(--color-pink)` (`#d41367`)
- **Navy (primario scuro)**: `var(--color-navy)` (`#0b2545`) — scelta estetica definitiva dell'utente, NON migrare verso Royal Blue `#17458F` anche se è il blu ufficiale Rotary.
- **Interact Blue**: `#00a2e0` (letterale — `var(--color-azure)` è una tinta diversa)

Tutte le variabili sono in `src/styles/global.css`.

## 3. Tipografia

- **Heading / Nav** (`var(--font-heading)`): Open Sans. Sempre `text-transform: uppercase; font-weight: 600/700;` per nav, dropdown, kicker.
- **Body** (`var(--font-body)`): Georgia. Solo per paragrafi e contenuto long-form.
- Non introdurre altri font (Barlow, ecc.) — non conformi al brand Rotary.

## 4. Layout e grid

- **CSS Grid con `auto-fit`** (non Flexbox) per evitare card "orfane":
  ```css
  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
    max-width: var(--content-max);
  }
  ```
- Per colonne fisse iniettare via inline style: `style={"--grid-cols: " + items.length}` + `grid-template-columns: repeat(var(--grid-cols), 1fr)`.
- Contenuto sempre dentro `max-width: var(--content-max); margin: 0 auto`.

## 5. Hover e animazioni

- Hover "lift":
  ```css
  .card:hover {
    transform: translateY(-4px);
    box-shadow: var(--elevation-2);
  }
  ```
- Scroll animations tramite `src/lib/motion.ts`:
  ```ts
  import { revealOnScroll, cappedStagger } from '../../lib/motion';
  revealOnScroll(section, elements, { opacity: [0, 1], scale: [0.92, 1] }, { delay: cappedStagger(0.07) });
  ```
- **Bug da ricordare**: dopo un'animazione Motion, `el.style.transform` resta inline e rompe `:hover`. Gli helper in `motion.ts` puliscono già — se scrivi animazioni custom, aggiungi `.then(() => { el.style.transform = ''; el.style.opacity = ''; })`.

## 6. Stack tecnico

- **Vanilla CSS** dentro `<style>` Astro scoped. No Tailwind, niente stili inline `style="..."` sparsi.
- **No framework component** (`client:*`) se basta HTML statico o uno `<script>` vanilla.
- Dati da TinaCMS via client GraphQL — niente testo hardcoded che un socio dovrebbe modificare.
- Navigazione (`Header.astro`, `InteractHeader.astro`): altezze loghi fisiche identiche, toggle mobile consistente, tipografia dropdown identica.
