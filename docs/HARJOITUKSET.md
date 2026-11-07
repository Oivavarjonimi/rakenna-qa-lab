# Rakenna: harjoitukset ja haastattelunäytöt

Tavoite: pysty selittämään jokainen oma ratkaisu ja jokainen testin tarkistus omin sanoin. Kaikkia harjoituksia ei tarvitse tehdä kerralla.

## 1. JavaScript — noin 15 minuuttia

Avaa Oppimispolku → JavaScript. Muokkaa selaimen koodia:

1. Palauta kaikkien tehtävien nimet (`map`).
2. Palauta vain työn alla olevat tehtävät (`filter`).
3. Laske työn alla olevien tehtävien kustannukset (`filter` + `reduce`). Alkuperäisessä Päijänteenranta-aineistossa summa on 26 600.
4. Palauta korkean prioriteetin avoimien tehtävien määrä.
5. Kokeile tyhjää listaa. Miksi reducella kannattaa olla alkuarvo 0?

Ratkaisu kohtaan 3:

```javascript
return tasks
  .filter((task) => task.status === "doing")
  .reduce((total, task) => total + task.cost, 0);
```

Haastattelussa: "Rajaan datan ensin tavoitteeseen sopivaksi ja lasken summan erikseen. Testaan myös tyhjän listan ja eri projektien erottelun."

## 2. TypeScript — noin 15 minuuttia

Avaa `src/domain.ts` ja etsi `Task`, `TaskStatus`, `validateTask`.

1. Lisää kokeeksi `const testStatus: TaskStatus = 'finished';` ja käytä muuttujaa esimerkiksi `console.log(testStatus)`.
2. Aja `npm run typecheck`. Selitä, miksi käännös epäonnistuu.
3. Vaihda arvoksi `'done'`. Tarkista uudelleen.
4. Poista kokeilurivit ja lisää Task-tyyppiin valinnainen `inspectionNote?: string`.
5. Selvitä: miksi `cost: number` ei yksin estä negatiivista arvoa tai NaN-arvoa?

Haastattelussa: "Tyypitys auttaa havaitsemaan virheitä kehitysaikana, mutta käyttäjän syöte ja rajapinnan data tarvitsevat ajonaikaisen validoinnin."

## 3. React — noin 20 minuuttia

1. Kokeile Oppimispolun React-esikatselun Vain avoimet -painiketta.
2. Etsi `ReactPractice` tiedostosta `src/Learning.tsx`.
3. Lisää `onlyHighPriority`-tila ja valintaruutu korkean prioriteetin suodatukseen.
4. Laske näkyvä lista kahden valinnan perusteella. Älä muuta propsina saatua taulukkoa.
5. Testaa molemmat valinnat erikseen ja yhdessä.
6. Siirrä sama suodatin oikeaan tehtävänäkymään. Missä tilan kannattaa sijaita?

Haastattelussa: "Pidän tilassa vain käyttäjän valinnan ja johdan näkyvän listan datasta. Näin kaksi tilaa ei pääse vahingossa ristiriitaan."

## 4. Playwright — noin 20–30 minuuttia

Asenna selain ja suorita `npm run test:e2e:ui`.

1. Avaa uuden tehtävän testi tiedostosta `tests/e2e/project.spec.ts`.
2. Miksi pelkkä Tehtävä tallennettu -ilmoitus ei osoita tallennuksen onnistumista?
3. Miksi testi lataa sivun uudelleen?
4. Lisää testi, jossa tehtävän kustannusarvio on -1. Varmista virheilmoitus ja ettei tehtävä tallennu.
5. Lisää testi, jossa edeltävä tehtävä valmistuu ja jatkotehtävän voi sen jälkeen merkitä valmiiksi.
6. Tutki epäonnistuneen testin trace-tallennetta Playwrightin raportissa.

Älä lisää `waitForTimeout`-viiveitä. Käytä `getByRole`, `getByLabel` ja odottavia `expect`-tarkistuksia.

## 5. AI-avusteinen testaus ja kriittinen arviointi — noin 20–30 minuuttia

1. Palauta alkuperäinen demoaineisto.
2. Avaa QA-labra ja valitse Dokumentin uusi versio.
3. Muodosta harjoitusluonnos, avaa AI-kehote ja kopioi se omaan AI-työkaluusi.
4. Anna AI:lle myös `src/Documents.tsx`, `src/domain.ts` ja nykyinen testitiedosto. Pyydä listaamaan puuttuvat tiedot.
5. Pyydä ensin hyväksymiskriteerit ja riskit. Tarkista ne itse ennen testikoodin pyytämistä.
6. Vertaa tuotettua testiä sovelluksen oikeisiin nimiin ja toimintoihin. Korjaa väärät oletukset.
7. Selvitä, tarkistaako testi uuden versionumeron vai pelkän onnistuneen klikkauksen.
8. Aja QA-labran tarkistukset ilman virhettä ja versionumerovirheen kanssa.
9. Kokeile virhettä dokumenttinäkymässä. Lisää versio: historiarivejä tulee lisää, mutta numero jää v3:een.
10. Kirjoita virheraportti: riski, toistovaiheet, odotettu tulos, toteutunut tulos ja testidata.

### Miksi QA-labran punainen tulos on hyödyllinen?

Testi odottaa uuden version numeroa 4. Injektoitu virhe jättää numeroksi 3. Tarkistus epäonnistuu juuri oikeasta syystä. Pelkkä historian pituuden tai sivun otsikon tarkistus voisi silti läpäistä testin.

Virhesimulaatio muistuttaa mutaatiotestauksen ajatusta: muutamme ohjelman toimintaa ja tarkistamme, reagoiko testi. Tämä ei ole kattava mutaatiotestaustyökalu.

### Selitä haastattelussa kahdessa minuutissa

"Lähtökohtani oli riski, että työmaa käyttää väärää suunnitelmaversiota. Täsmensin, että uusi versio kasvattaa numeroa ja säilyy latauksessa. Käytin AI:ta testiluonnoksen tekemiseen, mutta tarkistin itse testidatan ja assertionit. Kokeilin tarkoituksellista virhettä ja varmistin, että testi löysi sen. Seuraavaksi laajentaisin testausta samanaikaisiin muutoksiin sekä palvelimen käyttöoikeuksiin."

Kerro tämä toteutettuna omana harjoituksena vasta, kun olet tehnyt vaiheet itse. Älä esitä harjoitusta aiempana työkokemuksena.

## 6. CI/CD — noin 15 minuuttia

1. Tutki `.github/workflows/quality.yml`.
2. Selitä tyypityksen, yksikkötestien, E2E-testien ja buildin eri tehtävät.
3. Muuta yksikkötestin odotettu budjetti vääräksi. Aja `npm test` ja tarkista exit code.
4. Palauta oikea arvo ja tarkista vihreä tulos.
5. Jos viet projektin GitHubiin, kokeile samaa pull requestissa.
6. Selvitä, miten pakollinen status check estää yhdistämisen. Pelkkä workflow-tiedosto ei ota tätä asetusta käyttöön.

## Lisähaasteet

| Haaste                                                        | Mitä opit?                                 |
| ------------------------------------------------------------- | ------------------------------------------ |
| Suodata tehtävät vastuuhenkilön mukaan                        | Reactin tila ja johdettu data              |
| Lisää määräpäivän validointi projektin aikaväliin             | Vaatimuksen täsmennys ja rajatapaukset     |
| Estä kaksi saman sisältöistä tallennusta kaksoisklikkauksella | Käyttöliittymän tila ja idempotenssi       |
| Lisää dokumentin hyväksyntästatus ja hyväksyjä                | TypeScriptin tyypit ja roolien testaus     |
| Toteuta tietojen tuonti JSON-varmuuskopiosta                  | Skeemavalidointi ja virheellinen syöte     |
| Lisää todellinen API ja palvelimen käyttöoikeustarkistus      | Frontend/backend-raja ja integraatiotestit |

## Neljä kysymystä Quality Leadille

- Mitkä asiakasriskit ohjaavat ensimmäisenä automatisoitavia testejä?
- Millaisia puutteita AI:n kirjoittamista testeistä on löytynyt?
- Mitkä tarkistukset ovat julkaisun pakollisia laatuportteja?
- Missä testidata, käyttöoikeudet tai ympäristö aiheuttavat eniten haasteita?
