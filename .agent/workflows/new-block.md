# Workflow: aggiungere un nuovo blocco Tina

Seguire questi passi in ordine per aggiungere un blocco alla collection `pages`.

## 1. Definire il template in `tina/blocks/`

Creare `tina/blocks/<NomeBlock>.ts`:

```ts
import type { Template } from 'tinacms';

export const nomeBlockTemplate: Template = {
  name: 'NomeBlock',   // PascalCase, alfanumerico, niente trattini
  label: 'Nome visibile in Tina',
  fields: [
    // Verificare che nessun nome campo esista già con tipo diverso:
    // grep -rn "name: '<campo>'" tina/blocks/
    { type: 'string', name: 'title', label: 'Titolo' },
    { type: 'string', name: 'titleEn', label: 'Title (EN)' },
  ],
};
```

## 2. Esportarlo da `tina/blocks/index.ts`

```ts
export { nomeBlockTemplate } from './NomeBlock';
```

## 3. Aggiungerlo ai templates della collection `pages` in `tina/collections/pages.ts`

```ts
import { nomeBlockTemplate } from '../blocks';
// ... dentro il campo blocks.templates:
nomeBlockTemplate,
```

## 4. Creare il componente Astro in `src/components/blocks/NomeBlock.astro`

```astro
---
interface Props {
  title?: string;
  titleEn?: string;
  // ... altri props dal template Tina
}
const { title, titleEn } = Astro.props;
// usare loc() o i18n helper per scegliere IT/EN
---
<section class="nome-block">
  <!-- markup -->
</section>
<style>
  /* vanilla CSS scoped — niente Tailwind, niente inline style="..." */
</style>
```

## 5. Aggiungere il case in `BlockRenderer.astro`

```astro
{block.__typename === 'PagesBlocksNomeBlock' && (
  <NomeBlock {...block} />
)}
```

Il `__typename` è generato automaticamente come `<Collection>Blocks<TemplateName>`.

## 6. Escludere dal reveal globale in `BlockItem.astro` (se ha animazione propria)

Aggiungere `'PagesBlocksNomeBlock'` all'array dei typename esclusi da `data-reveal`.

## 7. Verificare

```bash
bash scripts/dev.sh
# In un altro terminale:
npx astro check --minimumSeverity error
```
