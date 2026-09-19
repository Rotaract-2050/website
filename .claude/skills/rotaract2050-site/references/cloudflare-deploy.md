# Cloudflare Workers Builds — branch control e preview su richiesta

Il progetto è deployato come **Cloudflare Workers** (adapter `@astrojs/cloudflare`, `wrangler.jsonc`), non Pages classica: build/deploy gestiti da **Workers Builds** (Settings → Build nel dashboard del Worker), non dal pannello Pages a 3 opzioni (All/None/Custom branches) che esiste solo per progetti Pages "legacy".

## Come funziona il branch control su Workers Builds

- Ogni Worker ha **al massimo 2 trigger**: uno production (branch `main`), uno preview (default: tutti gli altri branch).
- Nel dashboard (Settings → Build → Branch control) c'è solo un **checkbox binario**: "Builds for non-production branches" — ON builda ogni branch push, OFF non builda nessun non-prod branch. **Non esiste selezione UI per-branch** per Workers (a differenza di Pages).
- Il filtro fine per branch (`branch_includes`/`branch_excludes`, pattern con wildcard `*`) esiste solo nella **Builds API** (`PATCH /accounts/{account_id}/builds/triggers/{trigger_uuid}`), non esposto in UI. Nessun MCP tool Cloudflare disponibile in questo progetto copre questo endpoint (i tool `cloudflare-builds` sono solo lettura: list/get build, get logs).

## Setup adottato (2026-08-16)

Per evitare di sprecare build su ogni branch/commit:

1. **Checkbox "Builds for non-production branches" → OFF.** Solo push su `main` builda automaticamente (production).
2. **Deploy Hook** creato in Settings → Build → Deploy Hooks, nome `dev-preview`, branch to build = `dev`. Un Deploy Hook è un URL segreto che, chiamato via `POST`, forza una build sul branch configurato — indipendente dal checkbox globale, non scatta da solo su git push.
3. **GitHub Action** [`cf-preview-build.yml`](../../../.github/workflows/cf-preview-build.yml) chiama quell'URL quando un commit ha `[preview]` nel titolo (qualsiasi branch — il trigger è sul messaggio di commit, non sul nome branch; il Deploy Hook builda comunque sempre il branch `dev` configurato in Cloudflare).
4. URL del Deploy Hook salvato come **GitHub Actions secret** `CF_DEV_DEPLOY_HOOK` (repo Settings → Secrets and variables → Actions) — mai in chiaro nel workflow file.

Risultato: `main` → build produzione automatica ad ogni push. Commit con `[preview]` nel titolo → build preview di `dev` via GitHub Action + Deploy Hook. Ogni altro push → zero build.

**Corollario pratico, facile da dimenticare**: lavoro pushato/committato su `dev` (anche verificato/completo in locale) **non arriva mai in produzione da solo** — serve una PR `dev` → `main` mergiata. Non basta nemmeno che qualcosa venga pushato direttamente su `main` fuori da una PR: i commit di auto-save di TinaCMS Cloud (`TinaCMS content update` / `Update from TinaCMS`) finiscono dritti su `main` ma **non** triggerano una build (solo contenuto, `src/content/`/`public/uploads/` — in questa architettura il contenuto è letto a runtime via client GraphQL Tina, non serve un rebuild). Prima di dire "il deploy non è partito" controllare `workers_builds_list_builds` per il commit hash *esatto* dell'ultima build riuscita e confrontarlo con `main` corrente (`gh api repos/.../compare/<hash>...main`), non fidarsi della data dell'ultimo commit visibile in `git log`.

## Se serve cambiare branch/pattern in futuro

- Cambiare quale branch builda il Deploy Hook: dashboard Worker → Settings → Build → Deploy Hooks → modifica "Branch to build" dell'hook esistente (non serve toccare secret o workflow).
- Cambiare la keyword che fa scattare il workflow: editare `contains(github.event.head_commit.message, '[preview]')` in [`cf-preview-build.yml`](../../../.github/workflows/cf-preview-build.yml).
- Per un filtro branch-native più granulare (senza passare da commit message/GitHub Action), servirebbe la Builds API (`branch_includes`/`branch_excludes` su trigger) con un token API con permesso Workers Scripts:Edit — non fattibile dai tool MCP Cloudflare disponibili in questa sessione, richiede curl diretto.

## Preview link per `dev`: script manuale, stesso Worker (2026-09-05)

Bisogno reale: un link condivisibile con i soci per vedere `dev` prima del merge in produzione — non un dominio fisso, non un "ambiente beta" separato.

### Incidente: `env.beta` ha deployato su produzione

Primo tentativo: isolare il deploy di `dev` con un blocco `env.beta` dentro `wrangler.jsonc` + `wrangler deploy --env beta`. L'override del nome è stato ignorato e il deploy è finito su **produzione** — `rotaract2050.org` ha servito per alcuni minuti la build di `dev`, risolto subito con `wrangler rollback --name website --version-id <versione-precedente>`.

Causa reale (trovata dopo): `@astrojs/cloudflare` **rigenera un config completo ad ogni build**, `dist/server/wrangler.json` (guardarlo dopo un build per credere), con `main`/`assets` compilati e il campo `name` preso **sempre dal top-level** di `wrangler.jsonc` — non guarda dentro nessun blocco `env`. Il deploy vero legge quel file generato, non il `wrangler.jsonc` con l'`env` scritto a mano: `--env beta` non aveva letteralmente nulla da selezionare nel file che veniva davvero deployato.

Fix per un deploy mirato a un nome preciso: `wrangler deploy --config dist/server/wrangler.json --name <nome-voluto>` — il flag `--name` sulla CLI vince sempre sul `name` dentro qualunque config file.

### Tentativo intermedio (abbandonato): Worker separato `website-beta`

Standing up di un Worker + KV + Custom Domain (`beta.rotaract2050.org`) dedicati a `dev`, con un trigger Workers Builds scoped `branch_includes:["dev"]`. Il trigger si è creato senza errori (lo script era nuovo, zero trigger preesistenti), ma la prima build automatica è fallita: mancavano le variabili d'ambiente Tina (`TINA_CLIENT_ID`/`TINA_TOKEN`/`TINA_SEARCH_TOKEN`), che sono **per-trigger** — non condivise tra trigger diversi anche sullo stesso account/script. A quel punto si è deciso che Worker/dominio/KV separati erano più infrastruttura di quanta ne servisse per il bisogno reale (un link da condividere), e tutto è stato smontato (Custom Domain, trigger, KV, script — nessun residuo rimasto sull'account).

### Conferma diretta del bug #15140 su questo progetto

Prima ancora del tentativo `website-beta`, creare un **secondo trigger** (preview, scoped a `dev`) sullo script di produzione stesso (`website`, tag `fb98d3dc23b04928a997e88c61e994b2`, che ha già il trigger production `02d36cc9-7984-4909-be67-26680de678ab`) è fallito con `code 12042: "A trigger already exists for this configuration"` — nessun secondo trigger è mai apparso in `GET .../builds/workers/<tag>/triggers`. Conferma diretta, su questo account, del bug upstream [cloudflare/workers-sdk#15140](https://github.com/cloudflare/workers-sdk/issues/15140) (un maintainer Cloudflare l'ha confermato, fix in corso al momento di scrivere). **Automazione "push su dev → build automatica" quindi non è oggi possibile aggiungendo un secondo trigger a uno script che ne ha già uno** — solo uno script nuovo di zecca (zero trigger preesistenti) può riceverne uno, come confermato dal tentativo `website-beta` sopra (poi comunque abbandonato per il motivo delle env var).

### Soluzione adottata: `scripts/preview-dev.sh`

Niente Worker separato, niente trigger CI, niente dominio. Lo script:

1. builda `origin/dev` in un worktree git pulito **non annidato dentro un altro worktree** — l'adapter Astro/Vite ha un bug di risoluzione del `tsconfig.json` (`extends: "astro/tsconfigs/strict"`, errore "Tsconfig not found") se il build gira in un worktree annidato dentro un altro worktree, anche con `node_modules` installato correttamente. Lo script va lanciato dalla root del repo reale, mai da dentro un worktree già esistente.
2. usa il comando reale `tinacms build -c "astro build" --skip-cloud-checks --skip-search-index` — non basta il solo `astro build`: salta il codegen di Tina (`tina/__generated__/client.ts`), da cui dipendono alcune pagine (es. `src/pages/llms.txt.ts`), e il build fallisce con `Could not resolve import`. Il flag extra `--skip-search-index` (oltre a `--skip-cloud-checks`, uguale alla CI di produzione) serve perché in locale non ci sono le credenziali dedicate per l'upload dell'indice di ricerca, e una preview non ne ha bisogno.
3. esegue `wrangler versions upload` (**non** `wrangler deploy`) contro il `wrangler.jsonc` di produzione così com'è, senza `--config`/`--name` custom — `versions upload` crea una Version nuova con un suo **Preview URL** automatico e **non promuove mai al traffico live**. La sicurezza qui non viene da un nome/config isolato (quello che ha fallito nell'incidente sopra), viene dal comando stesso: impossibile da confondere con un deploy vero, per costruzione.
4. ricontrolla comunque `wrangler deployments list --name website` prima/dopo (difesa in profondità, anche se strutturalmente non dovrebbe poter cambiare).

Uso: `bash scripts/preview-dev.sh` dalla root del repo. Il link stampato a fine script (`https://<version-id>-website.<subdomain>.workers.dev`) è condivisibile subito con i soci; **cambia a ogni run**, non è un dominio fisso — se in futuro serve un dominio fisso `beta.rotaract2050.org`, la strada torna a essere un Worker separato (i Custom Domains puntano sempre al deployment "vivo" di uno script, mai a una singola Version), e per automatizzarlo via Workers Builds servirà comunque aspettare il fix upstream del #15140.

**Gotcha locale — `.env` ha riferimenti 1Password non risolti**: `TINA_CLIENT_ID`/`TINA_TOKEN`/`TINA_SEARCH_TOKEN` in `.env` sono stringhe letterali `op://...`, non i valori veri (risolti solo se il processo passa da 1Password, es. `op run`). Un build fatto leggendo `.env` così com'è compila un client Tina generato non valido: l'homepage risulta **bianca** (lo stream SSR si interrompe a metà, senza errore visibile) e `/llms.txt` risponde 500 pulito — sintomo diagnostico utile se ricapita: testare sempre anche una route che dipende dal client Tina (non solo `/`, che può fallire silenziosamente) e una che non ne dipende (`/robots.txt`, sempre 200) per isolare il problema. Fix: lanciare lo script dentro `op run --env-file=.env -- bash scripts/preview-dev.sh` (richiede `op signin` una tantum) — lo script sovrascrive le righe `op://` con i valori veri già risolti nell'ambiente, senza mai stamparli.

### Automazione: GitHub Action `preview-dev.yml` (push su `dev`)

[`​.github/workflows/preview-dev.yml`](../../../.github/workflows/preview-dev.yml) fa la stessa cosa di `scripts/preview-dev.sh` ma automaticamente a ogni push su `dev` (esclusi commit che toccano solo `src/content/**`/`public/uploads/**`, coerente col corollario sopra sul contenuto letto a runtime). Bypassa del tutto Cloudflare Workers Builds — non serve aspettare il fix del #15140 per avere l'automazione, basta non passare da quel sistema.

Richiede questi **GitHub Actions secrets** (repo Settings → Secrets and variables → Actions):
- `TINA_CLIENT_ID`, `TINA_TOKEN`, `TINA_SEARCH_TOKEN` — valori **veri risolti**, non le stringhe `op://...` di `.env`
- `CLOUDFLARE_API_TOKEN` — permesso *Workers Scripts: Edit* (basta, non serve altro: il workflow usa solo `wrangler versions upload`/`deployments list`, mai `deploy`)

Il workflow fa lo stesso controllo di sicurezza dello script manuale (`wrangler deployments list --name website` prima/dopo, fallisce il job se produzione risulta cambiata) e stampa il Preview URL nel summary della run — niente Deploy Hook, niente dominio fisso, un link diverso a ogni push.

## Workflow di revisione: branch → dev → preview → main (2026-09-05)

Prassi adottata per validare un branch feature prima che arrivi in produzione:

1. Mergiare il branch feature in `dev` (`git merge --no-ff origin/<branch> -m "..."`, in un worktree pulito su `origin/dev` — mai nella working tree locale, può avere `tinacms dev`/`astro dev` attivi).
2. **Push diretto su `dev` non è più possibile** (branch protection, vedi sezione dedicata sotto) — pusha il merge su un branch separato e apri una PR verso `dev`, poi mergiala (nessuna review obbligatoria richiesta, ma la PR deve esistere). Solo a quel punto `preview-dev.yml` builda da solo e stampa un link di preview (vedi sopra) — il trigger resta "push su dev", che scatta al momento del merge della PR, non del push sul branch temporaneo.
3. **Un run verde della Action non basta come prova**: `wrangler versions upload` può andare a buon fine e produrre comunque una pagina bianca (successo lato build/upload ≠ pagina che renderizza). Controllare sempre il contenuto vero: `curl -s -o /dev/null -w "%{size_download}"` sul link di preview, su almeno due route (la home e una pagina "profonda" toccata dal merge) — un `size_download` a zero con HTTP 200 è il sintomo, non l'assenza di problemi.
4. Solo dopo aver verificato contenuto vero: rivedere il link a occhio, poi eventualmente procedere con `dev` → `main` (PR o merge diretto a seconda della prassi del progetto).

Due cause già incontrate per una preview "verde ma bianca", da controllare **in quest'ordine** prima di ipotizzare altro:

**1. Cartella content vuota mai committata.** Git non traccia cartelle vuote. Se un branch introduce una nuova collection Tina che parte senza documenti (es. `tina/collections/interactEvents.ts` per `src/content/interact-events/`), e qualcosa in `astro.config.mjs` fa `readdirSync`/`fs.existsSync` su quella cartella senza gestire "non esiste ancora", il build fallisce con `ENOENT: no such file or directory, scandir '...'` su una checkout fresca (CI, o chiunque clona da zero) anche se in locale "funzionava" (la cartella esisteva solo sul filesystem di chi l'ha creata, mai su git). Fix: un file `.gitkeep` dentro la cartella vuota. Verificare con `git ls-files <cartella>` — se non stampa nulla, la cartella non è tracciata.

**2. Schema Tina Cloud legato al branch `main`, non a `dev`.** `tina/config.ts` sceglie il `branch` da interrogare su Tina Cloud da `process.env.WORKERS_CI_BRANCH || process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || 'main'`. `WORKERS_CI_BRANCH` la inietta **solo** Cloudflare Workers Builds — `preview-dev.yml`/`scripts/preview-dev.sh` bypassano Workers Builds apposta (vedi sopra, bug #15140), quindi nessuna di quelle variabili viene mai settata da soli, e il client Tina cade sempre su `main`. Se il branch mergiato introduce blocchi/campi Tina **nuovi** (non ancora su `main`), la query GraphQL del client fallisce (`Unknown type "PagesBlocksXyz"`, `Cannot query field "..." on type "..."`) — ma il Worker deployato non lo mostra come errore visibile: lo stream SSR si interrompe silenziosamente a metà, pagina bianca, HTTP 200. **Diagnosi**: non fidarsi del solo Worker deployato (`wrangler tail` non cattura il traffico dei Version Preview URL, verificato) — riprodurre in locale con build reale (`HEAD=dev npx tinacms build -c "astro build" ...`) seguito da `npx wrangler dev --config dist/server/wrangler.json --local`, che stampa lo stack trace/errore GraphQL vero in chiaro nel terminale. **Fix**: passare esplicitamente `HEAD=dev` (o il nome del branch reale) come env var nello step di build, sia in `preview-dev.yml` che in `scripts/preview-dev.sh` — già fatto per il branch `dev`; se un domani si preview-a un branch diverso da `dev` bisogna cambiare quel valore di conseguenza (non è dedotto automaticamente dal branch reale in checkout).

**Bug nel controllo di sicurezza stesso, scoperto lo stesso giorno**: sia il workflow che lo script usavano `wrangler deployments list --name website` (stampa tutta la history) seguito da `grep -m1` per confrontare "prima" e "dopo" — ma `grep -m1` prende la voce più vecchia **visibile nella finestra mostrata**, che può scorrere da sola tra le due chiamate anche se produzione non si è mossa di un millimetro (falso positivo verificato: la Action ha gridato "produzione cambiata" su un push che toccava solo questo file di documentazione, mentre `wrangler deployments status --name website` — che stampa solo la singola versione attiva al 100% — confermava nessun cambiamento reale). Fix: entrambi ora usano `deployments status`, non `deployments list`.

## Push diretto su `dev` non più permesso (branch protection, 2026-09-05)

`dev` ha branch protection su GitHub (`repos/Rotaract-2050/website/branches/dev/protection`): **nessun push diretto**, `enforce_admins: true` (vale anche per gli amministratori del repo, nessuna eccezione), `allow_force_pushes: false`, `allow_deletions: false`. Serve sempre una **pull request** verso `dev` (non serve una review approvata da qualcun altro — `required_approving_review_count: 0` — ma la PR deve esistere ed essere mergiata, non si può pushare il branch direttamente su `dev`).

Cosa cambia in pratica per il workflow "branch → dev → preview → main" descritto sopra:
- Il merge del branch feature (passo 1) va pushato su un branch **temporaneo** (es. `git push origin HEAD:refs/heads/docs/qualcosa` da un worktree detached), non direttamente su `refs/heads/dev`.
- Aprire la PR (`gh pr create --base dev --head <branch-temporaneo> ...`) e mergiarla (`gh pr merge --merge` o dalla UI) — il merge della PR è l'evento che fa davvero avanzare `dev` e che innesca `preview-dev.yml`.
- Un push diretto tentato per sbaglio fallisce pulito, senza toccare nulla: `remote: error: GH006: Protected branch update failed for refs/heads/dev. Changes must be made through a pull request.` — se si vede questo errore non è un bug, è la protezione che funziona; il fix è aprire una PR, non aggirare la protezione.
- Per cambiare questa policy (es. abbassare `enforce_admins` per permettere un hotfix diretto in emergenza, o richiedere N review approvate): `gh api --method PUT repos/Rotaract-2050/website/branches/dev/protection` con un JSON body via `--input -` (i campi nullable tipo `required_status_checks`/`restrictions` vanno passati come `null` JSON reale — i flag `-f`/`-F` di `gh api` mandano la stringa letterale `"null"`, che l'API rifiuta con 422).
