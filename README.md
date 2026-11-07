# Rakenna — projektit & QA-labra

Kimmon käytännön harjoitusympäristö JavaScriptille, TypeScriptille, Reactille, Playwrightille ja AI-avusteiselle testaukselle.

Sovellus on kuvitteellinen ja laadittu rakennusalan SaaS-tuotteiden QA-rooliin valmistautumista varten. Se ei ole Admicomin tuote eikä kuvaus Admicomin sisäisistä järjestelmistä. Projekteja ja muita henkilöitä koskeva aineisto on keksittyä.

## Aloita Windows 11:ssä

1. Asenna Node.js **22.12 tai uudempi tuettu LTS-versio** sekä halutessasi Visual Studio Code.
2. Pura ZIP kokonaan esimerkiksi kansioon `C:\Projektit\rakenna-qa-lab`. Älä käynnistä tiedostoja suoraan paketin sisältä.
3. Avaa kansio VS Codessa ja avaa PowerShell-terminaali.
4. Suorita projektin kansiossa:

```powershell
npm install
npm run dev
```

Avaa terminaalin näyttämä localhost-osoite. Vite valitsee vapaan portin (tavallisesti 5173).
Palvelin suljetaan näppäimillä Ctrl+C.

Jos PowerShell estää npm.ps1-tiedoston, käytä komentoja `npm.cmd install` ja `npm.cmd run dev`. Suojauskäytäntöä ei tarvitse muuttaa.

## Mitä voit kokeilla?

- Kolme projektia: Jyväskylä, Muurame ja Jämsä.
- Tehtävän luonti ja muokkaus, haku, prioriteettisuodatus sekä taulu- ja listanäkymät.
- Tehtävien väliset riippuvuudet: jatkotehtävää ei saa merkitä valmiiksi ennen edeltäjää.
- Projektikohtainen kustannuslaskenta sekä budjetin ylityksen varoitus.
- Dokumenttien uusi versio ja versiohistoria.
- Projektipäällikkö- ja lukijaroolin toiminnan vertailu dokumenteissa.
- Muokattava JavaScript-harjoitus suoraan selaimessa; Reactin tilan elävä esikatselu.
- Kuuden osan oppimispolku, tehtävät ja mallikoodi.
- QA-labran kolme testitapausta, Playwright-luonnokset, AI-kehotteet ja arviointilista.
- Kolme tarkoituksellista harjoitusvirhettä ja kuusi ajettavaa funktiotason tarkistusta.

Harjoituksen päivä on **7.11.2026**, jotta myöhästymiset ja esimerkkien päivämäärät säilyvät samoina harjoittelukerrasta toiseen.

## Aloita tästä tänään (30–45 min)

1. Luo tehtävä "Laatukatselmointi". Lataa sivu uudelleen ja etsi tehtävä.
2. Yritä merkitä "Julkisivumateriaalien tilaus" valmiiksi. Selvitä, mikä estää sen.
3. Avaa Oppimispolun JavaScript-osio ja laske työn alla olevien tehtävien kustannussumma.
4. Suorita QA-labran tarkistukset: lähtötilanteessa 6/6 läpäisee.
5. Kytke "Versionumero ei kasva" ja suorita uudelleen: nyt 5/6 läpäisee. Selitä odotettu ja toteutunut tulos.
6. Poista harjoitusvirhe. Avaa dokumentit ja kokeile version lisäämistä itse.

## Lähdekoodin kartta

| Tiedosto                        | Mitä siitä opit?                                                                |
| ------------------------------- | ------------------------------------------------------------------------------- |
| `src/main.tsx`                  | React-sovelluksen käynnistäminen.                                               |
| `src/App.tsx`                   | useState, useEffect, tapahtumat, sovelluksen yhteinen tila ja localStorage.     |
| `src/domain.ts`                 | Tyypit, taulukot, validointi, riippuvuudet ja testattavat liiketoimintasäännöt. |
| `src/Tasks.tsx`                 | Props, lomakkeet, suodatus ja kontrolloidut kentät.                             |
| `src/Documents.tsx`             | Roolin vaikutus toimintoon, versionlisäys ja dialogit.                          |
| `src/Learning.tsx`              | Oppimispolku, React-esikatselu ja erillisessä Workerissa ajettava JS-harjoitus. |
| `src/QA.tsx`                    | Testimallit, AI-kehotteet ja todellisten funktioiden tarkistusten tulokset.     |
| `src/learning.ts`               | Selitykset, testitapausten mallit sekä AI-kehotteen muodostus.                  |
| `tests/unit/domain.test.ts`     | 26 yksikkötestiä, mukaan lukien rajatapaukset ja virhesimulaatio.               |
| `tests/e2e/project.spec.ts`     | 7 käyttäjän työnkulun Playwright-testiä.                                        |
| `.github/workflows/quality.yml` | Tyypitys, yksikkötestit, selaintestit ja tuotantokäännös CI:ssä.                |

Suositeltu järjestys: `domain.ts` → `Tasks.tsx` → `App.tsx` → testit.

## Suorita tarkistukset

```powershell
# TypeScriptin tyyppitarkistus
npm run typecheck

# Yksikkötestit
npm test

# Playwrightin selain (asennetaan kerran)
npx playwright install chromium

# Selaintestit
npm run test:e2e

# Selaintestit graafisessa testikäyttöliittymässä
npm run test:e2e:ui

# Tuotantoversio
npm run build
```

Playwright käynnistää itse paikallisen sovelluspalvelimen porttiin 4173. Testit aloittavat kukin omasta tyhjästä selainkontekstista. Käytä Playwrightia **paikalliseen versioon**; julkaistun yksityisen sivun kirjautuminen ei ole testien kohde.

QA-labran "Suorita tarkistukset" ajaa kuusi funktiotason tarkistusta alkuperäisellä vakioaineistolla. Se ei suorita Playwrightia eikä testaa käyttöliittymää. Selaintestit ovat erillisiä tiedostoja ja ajetaan yllä olevilla komennoilla.

## AI-avusteisen testauksen harjoittelu

QA-labra **ei kutsu kielimallipalvelua**. Se muodostaa testiluonnoksen valitusta valmiista mallista. Lisäkonteksti siirtyy kopioitavaan kehotteeseen. Näin harjoittelu onnistuu ilman API-avaimia ja palvelinkuluja.

Kopioi kehote käyttämääsi AI-työkaluun (esimerkiksi ChatGPT, Codex tai Copilot). Anna tarvittaessa mukaan relevantit lähdekooditiedostot. Arvioi tuotosta hyväksymiskriteerejä vasten. Älä päättele oikeellisuutta pelkästä testin läpäisystä.

Pyydä AI:ta ensin luonnostelemaan testisuunnitelma, sitten listaamaan oletuksensa ja vasta lopuksi tuottamaan testikoodi. Varmista itse testidata, paikantimet, tarkistukset ja se, että testi myös havaitsee tarkoitetun virheen.

## Tallennus ja harjoitusvirheet

Tehtävät, dokumenttiversiot ja omat harjoittelumerkinnät tallennetaan tämän selaimen localStorageen. Ne eivät synkronoidu selainten, laitteiden tai eri osoitteiden välillä. Ohje ja aloitus -ikkunassa voi viedä datan JSON-tiedostoksi (varmuuskopio tarkastelua varten; tuontitoimintoa ei ole).

Harjoitusvirhe säilyy välilehden sessionStoragessa ja vaikuttaa sekä käyttöliittymään että QA-labran tarkistuksiin. Virheen poistaminen korjaa tulevat toiminnot; se ei peru aiemmin tallennettuja harjoitusmuutoksia. Yläreunan palautuspainikkeella saa alkuperäisen aineiston takaisin. Palautus poistaa omat demomuutokset ja harjoittelumerkinnät.

Tämä on paikallisesti tallentava harjoitus, jossa ei ole käyttäjätilipalvelua, oikeaa moniasiakasympäristöä tai tiedostojen palvelintallennusta. Lukijarooli havainnollistaa sovelluslogiikkaa. Tuotantosovelluksen käyttöoikeudet ja asiakasrajaukset pitää toteuttaa myös palvelimella.

## Kun viet projektin omaan Gitiin

Paketissa ei ole julkaisupalvelun tunnisteita tai tunnuksia. Voit aloittaa oman repositoryn komennolla `git init`. Mukana oleva GitHub Actions -työnkulku on esimerkki. Jos haluat sen estävän epäonnistuneen muutoksen yhdistämisen, aseta Quality-tarkistus pakolliseksi repositoryn ruleset- tai branch protection -asetuksissa.

## Viralliset oppaat

- JavaScript: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide
- TypeScript: https://www.typescriptlang.org/docs/handbook/intro.html
- React ja TypeScript: https://react.dev/learn/typescript
- Reactin tila: https://react.dev/learn/state-a-components-memory
- Playwrightin käytännöt: https://playwright.dev/docs/best-practices
- Playwrightin paikantimet: https://playwright.dev/docs/locators
- Vite: https://vite.dev/guide/

Lisää tehtäviä ja haastatteluharjoitus: `docs/HARJOITUKSET.md`.
