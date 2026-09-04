---
name: rotaract2050-design-system
description: The definitive design system and UI coding conventions for the Rotaract District 2050 website. Trigger this skill whenever modifying or creating new Astro components, styles, or pages.
---

# Rotaract Distretto 2050 - Design System

The Rotaract Distretto 2050 website relies on a specific "Premium / Glassmorphism" aesthetic. This skill outlines the unbreakable rules for styling, typography, layouts, and animations. ALWAYS follow these patterns when building or modifying components.

## 1. Core Aesthetic Philosophy
The visual language of the site is premium, dynamic, and avoids flat, basic designs.
- **Glassmorphism / Dynamic Surfaces**: Never use plain `#f0f0f0` backgrounds for cards. Instead, use a localized `--tint` CSS variable and blend it dynamically:
  ```css
  background: color-mix(in srgb, var(--tint) 14%, white);
  box-shadow: 0 8px 24px color-mix(in srgb, var(--tint) 35%, transparent);
  ```
- **The "Badge" Pattern**: Cards and visual grids should be left-aligned with ample padding (`32px 24px`) and rounded corners (`var(--shape-large)` or `--shape-extra-large`).
- **Watermarks**: Use huge, semi-transparent text overflowing on the right side of the card as a decorative background (e.g. `ROT`, `RAC`, `INT`).
  ```css
  .watermark {
    font-size: 140px;
    font-weight: 900;
    color: rgba(0, 0, 0, 0.03); /* Or derived from tint */
    position: absolute;
    right: -20px;
    bottom: -20px;
  }
  ```

## 2. Color Palette & Variables
Use the site's standard CSS custom properties defined in `src/styles/global.css`. **Never hardcode hex values if a variable exists.**
- **Rotary Gold**: `var(--color-gold)` (`#f7a81b`)
- **Rotaract Pink**: `var(--color-pink)` (`#d41367`)
- **Interact Blue**: `#00a2e0` (Use literal value when crossing themes, as `var(--color-azure)` is a different tint).
- **Navy (Base Theme)**: `var(--color-navy)` (`#0b2545`)

## 3. Typography
- **Headings & Nav (`var(--font-heading)`)**: Open Sans. Used for all titles, navigation links, numbers, and key UI elements. ALWAYS use `text-transform: uppercase; font-weight: 600/700;` for nav links, dropdown items, and kickers.
- **Body (`var(--font-body)`)**: Georgia. Used strictly for paragraphs and long-form reading content.

## 4. Responsive Layouts & Grids
- **CSS Grid over Flexbox**: To avoid "orphaned" cards on new lines, strictly use CSS Grid with `auto-fit` for dynamic wrapping:
  ```css
  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
    max-width: var(--content-max);
  }
  ```
  If you have an exact number of items and want to force columns, inject it via inline styles (e.g. `style={"--grid-cols: " + items.length}`) and use `grid-template-columns: repeat(var(--grid-cols), 1fr);`.
- **Max Widths**: Keep content contained within `max-width: var(--content-max); margin: 0 auto;`.

## 5. Motion & Interaction
- **Hover States**: Interactive elements must "lift" and cast a deeper shadow.
  ```css
  .card:hover {
    transform: translateY(-4px);
    box-shadow: var(--elevation-2);
  }
  ```
- **Scroll Animations**: Use the site's built-in `revealOnScroll` module. 
  ```javascript
  import { revealOnScroll, cappedStagger } from '../../lib/motion';
  revealOnScroll(section, elements, { opacity: [0, 1], scale: [0.92, 1] }, { delay: cappedStagger(0.07) });
  ```

## 6. Architecture & CMS (Astro + TinaCMS)
- The site uses Vanilla CSS inside `<style>` tags in Astro components. **No Tailwind.**
- Data is sourced from Markdown files via TinaCMS. Shared components (like `FamilyGrid.astro`) should be designed agnostically to serve different pages (Home vs Interact) by relying on CMS data inputs rather than hardcoded text.
- Navigation logic (like `Header.astro` and `InteractHeader.astro`) must remain functionally identical if modified (e.g., maintaining equal physical height for brand logos, consistent mobile toggles, and identical dropdown typography).
