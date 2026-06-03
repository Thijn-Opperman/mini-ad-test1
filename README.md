# Mini Lesson Playable Ad

Dit project is een mobiele playable ad in Duolingo-stijl, opgebouwd als een lineaire flow van schermen in een enkel HTML-document.

## Waarom dit project uit 1 HTML-bestand bestaat

Voor playable ads is een single-file aanpak vaak bewust de beste keuze.  
Hier is de reden (oorzaak) en het effect (gevolg):

- Oorzaak: ad-platforms stellen vaak strikte eisen aan laadtijd, bestandsgrootte, hosting en runtime-complexiteit.
- Gevolg: minder externe requests en minder afhankelijkheden zorgen voor sneller en betrouwbaarder laden.

- Oorzaak: een playable ad moet meestal "drop-in" geleverd kunnen worden zonder complexe build pipeline.
- Gevolg: 1 `index.html` met inline CSS/JS is direct deploybaar en eenvoudiger over te dragen aan media/ad teams.

- Oorzaak: tracking, click-out en flow-gedrag moeten voorspelbaar zijn in sandboxed ad-omgevingen.
- Gevolg: alle logica op een plek maakt testen, reviewen en debuggen eenvoudiger en consistenter.

- Oorzaak: veel advertentiekanalen draaien op webviews met beperkte of wisselende support voor tooling.
- Gevolg: een simpele, framework-loze implementatie verlaagt risico op compatibiliteitsproblemen.

Kort: voor reguliere apps zou je sneller splitsen naar meerdere bestanden/modules, maar voor playable ads is compact en self-contained vaak de juiste trade-off.

## Projectstructuur

- `index.html`: complete playable flow (HTML + CSS + JavaScript)
- `assets/`: karakterafbeeldingen en visuals
- `assets/audio/`: MP3-bestanden voor “Type what you hear”

### Audio (MP3) voor listen-oefeningen

Plaats je MP3’s in deze mappen met **exact deze bestandsnamen**:

**`assets/audio/nl-en/`** (Nederlands spreken → Engels leren)

- `art.mp3`, `culture.mp3`, `travel.mp3`, `beginner.mp3`, `food.mp3`, `pop.mp3`

**`assets/audio/en-nl/`** (Engels spreken → Nederlands leren)

- `art.mp3`, `culture.mp3`, `travel.mp3`, `beginner.mp3`, `food.mp3`, `pop.mp3`

De play-knop speelt het bestand af; de schildpad-knop hetzelfde bestand op langzame snelheid (72%). Je hoeft geen aparte slow-MP3 te maken.

## Huidige flow (globaal)

1. Splash
2. Intro/welcome
3. Taalkeuze
4. Onderwerpkeuze
5. Translate scherm
6. XP-resultaat
7. Bea oefenscherm (type what you hear)
8. Junior oefenscherm (finish sentence)
9. Streak eindscherm + click-out

## Lokaal draaien

Gebruik bijvoorbeeld:

```bash
python3 -m http.server 8080
```

Open daarna:

- `http://localhost:8080`

## Codekwaliteit / netheid

Er is gecontroleerd op lintfouten in de huidige workspace; op dit moment zijn er geen linter errors.

Aanvullend advies voor onderhoud:

- Houd componentnamen en screen-id's consequent (`screen-1`, `screen-2`, ...)
- Groepeer styles per schermsectie
- Houd interactieve states expliciet (`disabled`, `selected`, `active`)
- Documenteer grote flow-wijzigingen in deze README

## Technische constraints voor playable ads

Bij inlevering op ad-platforms gelden meestal onderstaande aandachtspunten:

- **Bestandsgrootte:** assets optimaliseren (compressie, juiste afmetingen, geen onnodig zware PNG's).
- **Laadtijd:** first interaction snel beschikbaar houden; geen zware externe dependencies.
- **Webview-compatibiliteit:** geen moderne API's gebruiken zonder fallback als target-webviews oud kunnen zijn.
- **Netwerkafhankelijkheid:** flow moet werken zonder runtime API-calls; assets lokaal bundelen.
- **Click-out gedrag:** eindscherm moet een duidelijke en betrouwbare doorgang naar de landingspagina hebben.

## Optimalisatie-aanpak (aanbevolen)

- Gebruik waar mogelijk gecomprimeerde assets (WebP/JPG) met behoud van visuele kwaliteit.
- Houd animaties subtiel en performant (transform/opacity boven layout-heavy animaties).
- Vermijd onnodige DOM updates in de hoofdflow.
- Test op meerdere viewporthoogtes (vooral kleinere iPhones/Android toestellen).

## Testplan voor oplevering

Controleer minimaal:

- Splash en schermovergangen lopen zonder haperingen.
- Progress bar loopt correct op per scherm.
- XP teller loopt op na de bedoelde vraagmomenten.
- Disabled/enabled states van `Continue` werken op oefenschermen.
- Animaties van `bea`, `junior`, `eddy` en `eyes duo` zijn zichtbaar.
- Laatste `Continue` opent [duolingo.com](https://www.duolingo.com).
- Layout blijft bruikbaar in portrait op kleine en grote mobiele schermen.

## Inleverchecklist

- [x] Single-file playable (`index.html`) met assets in `assets/`
- [x] Volledige schermflow inclusief eindscherm
- [x] Click-out naar productie-URL
- [x] README met architectuurkeuzes en constraints
- [x] Geen linter errors in huidige workspace

## Handoff-notes

- Als een platform een strikte maximum-grootte hanteert, voer eerst asset-compressie uit.
- Als een platform een eigen click macro vereist, vervang alleen de URL in `exitAd()` en laat de rest van de flow intact.
- Houd toekomstige wijzigingen bij voorkeur binnen de bestaande screen-structuur om regressies te beperken.
