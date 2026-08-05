# Rotary Brand Center — riferimento

Regole di brand ufficiali Rotary International, recuperate da brandcenter.rotary.org. Applicano a qualunque colore, font, testo, logo, foto o naming pubblicato sul sito.

## Palette ufficiale (brand-elements/colors)

Usare **solo** questi colori (elenco completo brandcenter, formule colore complete). Non inventare colori né usare tinte fuori da questa lista.

### Primari — identità di marca, uso guidato

| Nome Rotary | PMS | Hex | RGB | Dove compare secondo il brandcenter |
|---|---|---|---|---|
| Rotary Royal Blue | 286C | `#17458F` | 23, 69, 143 | Parola "Rotary" nella Masterbrand Signature |
| Rotary Gold | 130C | `#F7A81B` | 247, 168, 27 | Ruota nella Masterbrand Signature, Mark of Excellence |
| Azure | 2175C | `#0067C8` | 0, 105, 200 | Versione monocolore della Masterbrand Signature, Mark of Excellence |
| Cranberry | 214C | `#D41367` | 212, 19, 103 | Logo Rotaract |
| Cardinal | 485C | `#E02927` | 224, 41, 39 | Logo End Polio Now |

Uso nel sito: Royal Blue = primario scuro (header/footer/blocchi dark, oggi `#0B2545` nel mockup — **verificare con il distretto**, non è l'hex ufficiale). Cranberry = accent/CTA/link/pill di default (`--color-pink`). Gold = accent secondario su sfondo scuro (`--color-gold`). Azure = blu azione/link alternativo, non ancora usato altrove. Cardinal = riservato a un eventuale blocco End Polio Now, non usare per altro.

### Secondari/estesi — accenti, categorizzazione, dati (es. tag/badge)

| Nome Rotary | PMS | Hex | RGB |
|---|---|---|---|
| Sky Blue | 2202C | `#00A2E0` | 0, 162, 224 |
| Turquoise | 7466C | `#00ADBB` | 0, 173, 187 |
| Orange | 2018C | `#FF7600` | 255, 118, 0 |
| Violet | 2070C | `#901F93` | 144, 31, 147 |
| Grass | 355C | `#009739` | 1, 151, 57 |
| Powder Blue | 290C | `#B9D9EB` | 185, 217, 235 |
| Moss | 7537C | `#A7ACA2` | 167, 172, 162 |
| Lavender | 665C | `#C6BCD0` | 198, 188, 208 |
| Taupe | 7501C | `#D9C89E` | 217, 200, 158 |
| Stone | 2162C | `#9BA4B4` | 155, 164, 180 |
| Slate | 2165C | `#657F99` | 101, 127, 153 |

Uso nel sito: **Turquoise, Violet, Orange, Grass** sono i 4 colori scelti per i tag zona (badge club colorati per zona sulle news — vedi `references/news-tags.md`), assegnazione 1:1 con le 4 zone del distretto. Gli altri (Sky Blue, Powder Blue, Moss, Lavender, Taupe, Stone, Slate) restano disponibili per usi futuri simili (categorizzazione, data-viz), non ancora assegnati — non introdurli senza motivo.

### Neutri/grigi

| Nome Rotary | PMS | Hex | RGB |
|---|---|---|---|
| Charcoal | Cool Gray 11C | `#54565A` | 84, 86, 90 |
| Pewter | Cool Gray 8C | `#898A8D` | 137, 138, 141 |
| Smoke | Cool Gray 5C | `#B1B1B1` | 177, 177, 177 |
| Silver | Cool Gray 2C | `#D0CFCD` | 208, 207, 205 |
| Storm | Warm Gray 10C | `#7A6E66` | 122, 110, 102 |
| Ash | Warm Gray 7C | `#968B83` | 150, 139, 131 |
| Platinum | Warm Gray 3C | `#BFB7B0` | 191, 183, 176 |
| Cloud | Warm Gray 1C | `#D6D1CA` | 214, 209, 202 |
| White | — | `#FFFFFF` | 255, 255, 255 |
| Black | — | `#000000` | 0, 0, 0 |

Uso nel sito: Charcoal = testo body (`--color-text`, oggi mockup usa `#5B6472` blu-grigio non ufficiale). White/`#FAFAFB` (tinta neutra non ufficiale ma coerente, quasi-bianco) = sfondo pagina chiaro. Gli altri neutri non ancora usati, disponibili per varianti di sfondo/bordo se serve più contrasto graduale.

**Regola pratica**: prima di introdurre un componente nuovo, chiedere conferma su `#0B2545` vs `#17458F` (Royal Blue ufficiale) se non già deciso nel progetto — è la discrepanza principale rispetto al brandcenter. Se non c'è risposta, mantenere `#0B2545` per coerenza con la homepage esistente (regola "mantenere lo stile della homepage" prevale finché non arriva una decisione esplicita), ma segnalarlo sempre all'utente.

## Tipografia (brand-elements/typography)

| Ruolo | Font ufficiale (a licenza) | Alternativa libera consigliata | Uso nel mockup |
|---|---|---|---|
| Titoli, nav, label | Frutiger | **Open Sans** o Arial | mockup usa Barlow Condensed — non è l'alternativa ufficiale |
| Corpo testo, sottotitoli, didascalie | Sentinel | **Georgia** | mockup usa Barlow — non è l'alternativa ufficiale |

Il brandcenter non distingue regole diverse per stampa vs digitale: la stessa gerarchia (primario/secondario) vale ovunque; per il web, senza licenza Frutiger/Sentinel, usare le alternative libere indicate (Open Sans + Georgia), non font a piacere.

**Discrepanza da segnalare**: il mockup usa Barlow/Barlow Condensed (Google Fonts), che non è tra le alternative ufficiali. Stessa regola pratica dei colori: chiedere conferma all'utente se allineare a Open Sans/Georgia o mantenere Barlow per coerenza con la homepage esistente; finché non c'è una decisione esplicita, mantenere Barlow ma segnalarlo.

## Tono e voce (brand-elements/voice-and-messaging)

- 4 attributi di voce: **intelligente, compassionevole, tenace, ispiratrice**.
- Stile di scrittura: "chiaro, persuasivo e affidabile. Personale e sincero." Frasi brevi, dirette, mai gergo interno non spiegato.
- Messaggio chiave ricorrente (da riecheggiare in hero/CTA/mission, non da citare alla lettera ovunque): l'azione collettiva dei soci crea cambiamento duraturo nelle comunità; i soci sono problem-solver efficaci perché investono in relazioni.
- Preferire affermazioni supportate da storie reali di soci/progetti, dati concreti, testimonianze — evitare claim generici non supportati.
- Contenuto bilingue **IT (default) / EN** — vedi `references/astro.md` per il routing i18n.
- Placeholder/dati fittizi (nomi cariche, contatti club) vanno sempre marcati con un disclaimer visibile (campo `disclaimer`/`showDisclaimer` sul blocco) finché non sono dati reali.

## Loghi ed emblemi (brand-elements/logos-and-graphics)

- Non disegnare un'icona "R" personalizzata come nel mockup (cerchio Cranberry con lettera R): l'emblema Rotaract ufficiale è un marchio registrato con forma fissa. Usare **solo** il logo Rotaract/distretto scaricato dal Brand Center (sezione loghi personalizzati club/distretto/zona), mai un rifacimento grafico proprio.
- Varianti disponibili da Brand Center: logo club/distretto/zona personalizzato, logo per programmi/attività, logo con partner, logo eventi/progetti, marchi ufficiali (Rotaract, Interact, Excellence Mark), End Polio Now, icone Aree di Intervento.
- Per regole tecniche precise (clear space, dimensione minima, versioni colore/mono/reversed, cosa non fare con distorsioni/ricolorazioni/effetti) consultare la **"Guida rapida sui loghi"** scaricabile dal Brand Center e il corso "Il nostro logo" nel Learning Center — non sono dettagliate in pagina, vanno recuperate da lì prima di produrre il logo finale del distretto.

## Fotografia e video (brand-elements/images-and-videos)

- Stile **documentario**, non posato: relazioni, impatto sulla comunità, azione, coinvolgimento reale dei soci — non foto stock generiche.
- Video: mostrare l'azione (non solo raccontarla), soci che collaborano con la comunità come partner, tono ottimista "persone d'azione".
- **Autorizzazione scritta e firmata obbligatoria** per ogni persona riconoscibile in foto/video pubblicati sul sito; tutela rafforzata per i minori di 18 anni (consenso di un genitore/tutore). Verificare sempre prima di pubblicare foto eventi/soci.
- Gli `image-slot` del mockup vanno sostituiti con foto reali dei soci/progetti del distretto (coerenti con questo stile), non con immagini stock generiche.

## Uso del nome "Rotary"/"Rotaract" (brand-elements/the-rotary-name)

- Il sito è già corretto nell'identificarsi come **"Rotaract Distretto 2050"** (non solo "Rotaract" da solo): mantenere sempre l'identificazione specifica del distretto in title, nav, footer, copy — mai testo che lasci intendere che il sito rappresenti Rotary International o Rotaract nel suo complesso.
- Per nomi di eventi/progetti pubblicati sul sito: mai "Evento Rotary"/"Evento Rotaract" da soli, sempre con identificazione del club/distretto proprietario (es. "Congresso Distrettuale Rotaract Distretto 2050", non "Congresso Rotaract").
- Non usare il nome per iniziative di terzi o entità su cui il distretto non ha controllo operativo pieno; non creare pagine/sezioni che implichino affiliazioni o gruppi ufficiali non autorizzati dal Consiglio Centrale.

## Fonti

[Brand Elements — indice](https://brandcenter.rotary.org/it-it/our-brand/brand-elements), [Colori](https://brandcenter.rotary.org/it-it/our-brand/brand-elements/colors), [Tipografia](https://brandcenter.rotary.org/it-it/our-brand/brand-elements/typography), [Voce e messaggi](https://brandcenter.rotary.org/it-it/our-brand/brand-elements/voice-and-messaging), [Loghi e grafica](https://brandcenter.rotary.org/it-it/our-brand/brand-elements/logos-and-graphics), [Immagini e video](https://brandcenter.rotary.org/it-it/our-brand/brand-elements/images-and-videos), [Il nome Rotary](https://brandcenter.rotary.org/it-it/our-brand/brand-elements/the-rotary-name).
