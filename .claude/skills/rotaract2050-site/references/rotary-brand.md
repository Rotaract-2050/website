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

Uso nel sito: Royal Blue = primario scuro (header/footer/blocchi dark, `--color-royal-blue: #17458F`, hex ufficiale — **risolto 2026-08-07**: il vecchio `--color-navy: #0B2545` non ufficiale è stato rimosso e tutti i suoi usi migrati a `--color-royal-blue`, decisione esplicita dell'utente). Cranberry = accent/CTA/link/pill di default (`--color-pink`). Gold = accent secondario su sfondo scuro (`--color-gold`). Azure e Cardinal restano riservati come primari (non usarli per scegliere un nuovo colore UI a piacere) — l'unica eccezione è l'artwork ufficiale delle Aree di Intervento (vedi sotto), dove compaiono già così nel PNG scaricato dal Brand Center: non è una scelta cromatica nostra, è il colore con cui Rotary pubblica quell'icona.

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

Uso nel sito: **Turquoise, Violet, Orange, Grass** sono i 4 colori scelti per i tag zona (badge club colorati per zona sulle news — vedi `references/news-tags.md`), assegnazione 1:1 con le 4 zone del distretto. **Sky Blue** è anche il colore ufficiale dell'icona AOF "Acqua, servizi igienici e igiene" (vedi sotto). Gli altri (Powder Blue, Moss, Lavender, Taupe, Stone, Slate) restano disponibili per usi futuri simili (categorizzazione, data-viz), non ancora assegnati — non introdurli senza motivo.

### Icone ufficiali "Aree di Intervento" (Areas of Focus)

`public/uploads/Aree-Azione/` contiene l'artwork ufficiale delle 7 Aree di Intervento Rotary, scaricato dal Brand Center: tre varianti colore (`black`/`color`/`white`) × quattro layout (`no_title`, `bottom_title`, `side_title`, `bottom_title_rev`/`side_title_rev` solo su `color`). Il sito usa solo `color/no_title/AOF_<area>_color_no_title.png` — titolo e descrizione sono già testo HTML separato (vedi `ValuesGrid.astro`, layout `icon`, usato in `distretto.md` per "Le 7 aree di intervento"), non serve la versione con titolo incorporato nel PNG.

Ogni icona porta già il proprio colore ufficiale, che ValuesGrid legge in `AOF_ICON_COLOR` per tingere la card (stesso pattern tonale delle card zona in Home) — non un colore scelto da noi:

| Area (nome file) | Titolo IT sul sito | Colore ufficiale |
|---|---|---|
| peace | Costruzione della pace e prevenzione dei conflitti | Azure `#0067C8` |
| disease | Prevenzione e cura delle malattie | Cardinal `#E02927` |
| water | Acqua, servizi igienici e igiene | Sky Blue `#00A2E0` |
| maternal | Salute materna e infantile | Violet `#901F93` |
| education | Alfabetizzazione ed educazione di base | Orange `#FF7600` |
| economic | Sviluppo economico e comunitario | Turquoise `#00ADBB` |
| environment | Tutela dell'ambiente | Grass `#009739` |

Le altre varianti (black/white, con titolo) non sono usate dal sito oggi ma restano nella cartella come risorsa per materiali futuri (stampa, sfondi scuri) — non cancellarle assumendo che siano inutilizzate.

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

Uso nel sito: Charcoal = testo body (`--color-text: #54565A`, hex ufficiale — **risolto 2026-08-07**, sostituiva `#5B6472` blu-grigio non ufficiale). Stone = testo secondario/muted (`--color-muted: #9BA4B4`, hex ufficiale — match quasi esatto del valore precedente, nessun cambio visivo percepibile). White/`#FAFAFB` (tinta neutra non ufficiale ma coerente, quasi-bianco) = sfondo pagina chiaro. `--color-border: #E4E7EE` non è un hex ufficiale letterale ma è un tint ~13% di Royal Blue su bianco (stesso pattern dei "container" sotto), quindi coerente col brand. Gli altri neutri non ancora usati, disponibili per varianti di sfondo/bordo se serve più contrasto graduale.

**Regola pratica**: usare sempre `--color-royal-blue` (`#17458F`, ufficiale) per il primario scuro — non reintrodurre un token "navy" separato non ufficiale.

## Tipografia (brand-elements/typography)

| Ruolo | Font ufficiale (a licenza) | Alternativa libera consigliata | Uso nel sito |
|---|---|---|---|
| Titoli, nav, label | Frutiger | **Open Sans** o Arial | `--font-heading: 'Open Sans'` — conforme |
| Corpo testo, sottotitoli, didascalie | Sentinel | **Georgia** | `--font-body: Georgia` — conforme |

Il brandcenter non distingue regole diverse per stampa vs digitale: la stessa gerarchia (primario/secondario) vale ovunque; per il web, senza licenza Frutiger/Sentinel, usare le alternative libere indicate (Open Sans + Georgia), non font a piacere.

**Risolto** (verificato 2026-08-06): il vecchio mockup HTML usava Barlow/Barlow Condensed, non tra le alternative ufficiali — discrepanza segnalata qui. La ricostruzione reale in Astro (`src/styles/global.css`) usa già Open Sans + Georgia, le alternative libere corrette. Nessuna azione da fare: **non introdurre Barlow o altri font** in nuovi componenti, restare su Open Sans/Georgia/Dancing Script (quest'ultimo solo per accenti script decorativi, es. motto squadra — non è nella tabella ufficiale, uso puramente stilistico su un ruolo non coperto dalle due righe sopra).

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
