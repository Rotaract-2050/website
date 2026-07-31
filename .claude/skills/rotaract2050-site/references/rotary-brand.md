# Rotary Brand Center — riferimento

Regole di brand ufficiali Rotary International, recuperate da brandcenter.rotary.org. Applicano a qualunque colore, font, testo, logo, foto o naming pubblicato sul sito.

## Palette ufficiale (brand-elements/colors)

Usare **solo** questi colori (o tinte neutre/grigie della palette). Non inventare colori.

| Ruolo nel sito | Nome Rotary | Hex | Uso nel mockup |
|---|---|---|---|
| Primario scuro (header, footer, blocchi dark) | Rotary Royal Blue | `#17458F` | mockup usa `#0B2545`, navy più scuro — **verificare con il distretto quale usare**: `#0B2545` non è un colore ufficiale brandcenter |
| Accent/CTA/link | Cranberry | `#D41367` | usato correttamente, è colore ufficiale |
| Accent secondario (numeri, badge su sfondo scuro) | Rotary Gold | `#F7A81B` | usato correttamente |
| Blu azione/link alternativo | Azure | `#0067C8` | non ancora usato, disponibile |
| Sfondo pagina chiaro | White / neutro | `#FFFFFF`, `#FAFAFB` | ok, `#FAFAFB` è tinta neutra non ufficiale ma coerente (quasi-bianco) |
| Testo body | Charcoal-ish grigio | `#54565A` (Charcoal ufficiale) | mockup usa `#5B6472` (blu-grigio, non ufficiale ma leggibile) |

**Regola pratica**: prima di introdurre un componente nuovo, chiedere conferma su `#0B2545` vs `#17458F` (Royal Blue ufficiale) se non già deciso nel progetto — è la discrepanza principale rispetto al brandcenter. Se non c'è risposta, mantenere `#0B2545` per coerenza con la homepage esistente (regola "mantenere lo stile della homepage" prevale finché non arriva una decisione esplicita), ma segnalarlo sempre all'utente.

Non usare mai colori secondari (Cardinal, Violet, Turquoise, Grass, Orange) senza motivo di brand esplicito: il sito distrettuale deve restare essenziale, non "arcobaleno".

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
