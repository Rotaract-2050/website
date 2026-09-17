# Design System — regole UI

## Estetica: premium / glassmorphism

```css
/* Card: glassmorphism con tint dinamico — mai background piatto */
.card {
  background: color-mix(in srgb, var(--tint) 14%, white);
  box-shadow: 0 8px 24px color-mix(in srgb, var(--tint) 35%, transparent);
  border-radius: var(--shape-large);
  padding: 32px 24px;
}
.card:hover { transform: translateY(-4px); box-shadow: var(--elevation-2); }
```

## Grid: CSS Grid con auto-fit, non Flexbox

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  max-width: var(--content-max);
  margin: 0 auto;
}
```

## Tipografia

- **Open Sans** → heading, nav, label (`text-transform: uppercase; font-weight: 600/700`)
- **Georgia** → body, long-form
- Niente altri font — non conformi al brand Rotary

## Animazioni (motion.ts)

Usare gli helper in `src/lib/motion.ts`:
- `revealOnLoad` — sopra la piega, animazione immediata
- `revealOnScroll` + `cappedStagger` — sotto la piega, scroll-triggered

**Bug critico**: Motion lascia `style.transform` inline dopo l'animazione, rompendo il CSS `:hover`. Gli helper puliscono già — animazioni custom devono farlo manualmente: `.then(() => { el.style.transform = ''; el.style.opacity = ''; })`.

## Tema Interact

`[data-theme="interact"]` in `src/styles/interact-theme.css` ridefinisce le stesse custom property senza toccare i componenti. Per trovare colori hardcoded non rethemizzati: `grep -rniE "d41367|f7a81b|0b2545" src/components/`
