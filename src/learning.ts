/** Oppimispolun oppituntien sisältö. Käyttöliittymä on Learning.tsx-tiedostossa. */

export type Lesson = {
  id: string;
  number: string;
  technology: string;
  title: string;
  minutes: number;
  description: string;
  file: string;
  code: string;
  points: string[];
  exercise: string;
};

export const jsStarter = `// tasks sisältää valitun projektin tehtävät.\n// Palauta työn alla olevien tehtävien kustannusten summa.\nreturn tasks\n  .filter(task => task.status === 'doing')\n  .reduce((sum, task) => sum + task.cost, 0);`;

export const lessons: Lesson[] = [
  {
    id: "js", number: "01", technology: "JavaScript", title: "Datasta toiminnaksi", minutes: 15,
    description: "Käsittele projektin tehtäviä filter-, map- ja reduce-metodeilla.",
    file: "src/domain.ts → budgetSummary",
    code: `const taskCost = tasks\n  .filter(task => task.projectId === project.id)\n  .reduce((total, task) => total + task.cost, 0);\n\nconst committed = project.baseCost + taskCost;\nconst remaining = project.budget - committed;`,
    points: ["filter valitsee vain halutun projektin tehtävät.", "reduce laskee kustannukset yhdeksi luvuksi. Alkuarvo on 0.", "Sama logiikka on TypeScriptissä: tyypit täydentävät JavaScriptiä."],
    exercise: "Muuta harjoituskoodia niin, että se palauttaa vain työn alla olevien tehtävien (status === 'doing') kustannusten summan.",
  },
  {
    id: "ts", number: "02", technology: "TypeScript", title: "Sopimus datan muodosta", minutes: 15,
    description: "Tutustu interfaceen, union-tyyppiin ja funktion parametreihin.",
    file: "src/domain.ts → Task, TaskStatus",
    code: `type TaskStatus = 'todo' | 'doing' | 'done';\n\ninterface Task {\n  id: string;\n  title: string;\n  status: TaskStatus;\n  cost: number;\n}\n\nfunction taskCost(tasks: Task[]): number {\n  return tasks.reduce((sum, task) => sum + task.cost, 0);\n}\n\n// const status: TaskStatus = 'finished'; // tyyppivirhe`,
    points: ["Union-tyyppi rajaa sallitut tilat kolmeen merkkijonoon.", "Task[] tarkoittaa tehtäväolioiden taulukkoa.", "Tyypit eivät validoi ulkopuolista dataa ajon aikana."],
    exercise: "Mikä arvo kelpaa TaskStatus-tyypille: 'finished', 'done' vai true?",
  },
  {
    id: "react", number: "03", technology: "React", title: "Näkymä reagoi tilaan", minutes: 20,
    description: "Tutki, miten useState, suodattaminen ja renderöinti toimivat yhdessä.",
    file: "src/Learning.tsx → ReactPractice",
    code: `const [onlyOpen, setOnlyOpen] = useState(false);\nconst visible = onlyOpen\n  ? tasks.filter(task => task.status !== 'done')\n  : tasks;\n\n// React renderöi näkymän uudelleen tilan muuttuessa.`,
    points: ["useState säilyttää komponentin tilan.", "Suodatettu lista muodostetaan nykyisestä tilasta.", "Tilan muuttaminen päivittää näkyvän tehtävälistan."],
    exercise: "Kokeile Vain avoimet -painiketta ja tarkista, mitä tehtäviä näkyy.",
  },
  {
    id: "playwright", number: "04", technology: "Playwright", title: "Käyttäjän polku testiksi", minutes: 20,
    description: "Automatisoi tehtävän luominen ja varmista tallennuksen säilyminen.",
    file: "tests/e2e/project.spec.ts",
    code: `import { test, expect } from '@playwright/test';\n\ntest('tehtävä säilyy sivun latauksessa', async ({ page }) => {\n  await page.goto('/');\n  await page.getByRole('button', { name: 'Tehtävät' }).click();\n  await page.getByRole('button', { name: 'Uusi tehtävä' }).click();\n  await page.getByLabel('Tehtävän nimi').fill('Laatukatselmointi');\n  await page.getByRole('button', { name: 'Tallenna tehtävä' }).click();\n  await expect(page.getByText('Laatukatselmointi')).toBeVisible();\n  await page.reload();\n});`,
    points: ["getByRole ja getByLabel käyttävät käyttäjälle näkyviä nimiä.", "await odottaa asynkronisen toimenpiteen valmistumista.", "Sivun lataus testaa tallentumista; pelkkä onnistumisviesti ei riitä."],
    exercise: "Suorita testi paikallisesti. Lisää testi, joka luo samannimisen tehtävän toiseen projektiin.",
  },
  {
    id: "ai", number: "05", technology: "AI & QA", title: "Virheestä havaintoon", minutes: 15,
    description: "Tutki, miten testit ja tekoälyavusteinen analyysi tukevat laadunvarmistusta.",
    file: "QA-labra",
    code: `// Esimerkki testihavainnon yhteenvedosta\nconst result = {\n  check: 'document-version',\n  expected: 4,\n  actual: 3,\n  passed: false,\n};`,
    points: ["Tarkistuksen odotettu ja todellinen tulos erotetaan toisistaan.", "Virhe on toistettava ennen korjaamista.", "AI voi auttaa analyysissä, mutta testin todisteet ratkaisevat."],
    exercise: "Avaa QA-labra, lisää harjoitusvirhe ja tutki tulosta.",
  },
  {
    id: "ci", number: "06", technology: "CI/CD", title: "Testit osaksi työnkulkua", minutes: 20,
    description: "Suorita tarkistukset automaattisesti versionhallinnan yhteydessä.",
    file: ".github/workflows/quality.yml",
    code: `name: Quality\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: '22'\n      - run: npm ci\n      - run: npm run typecheck\n      - run: npm test`,
    points: ["CI toistaa tarkistukset jokaiselle muutokselle.", "Tyypintarkistus ja testaus ovat eri vaiheita.", "Pakollinen hyväksyntä vaatii GitHubin branch protection- tai ruleset-asetuksen."],
    exercise: "Tutustu projektin CI-työnkulkuun ja kokeile tarkistuksia paikallisesti.",
  },
];


// QA-labran mallipohjaiset testitapaukset.
export type TestCase = "version" | "dependency" | "permission";

export type QACase = {
  label: string;
  risk: string;
  requirement: string;
  manual: string[];
  test: string;
};

export const cases: Record<TestCase, QACase> = {
  version: {
    label: "Dokumenttiversionumeron kasvaminen",
    risk: "Uusi versio ei päivity tai häviää sivun latauksessa.",
    requirement: "Kun dokumenttiin lisätään uusi versio, viimeisimmän version numeron on kasvettava ja muutoksen on säilyttävä uudelleenlatauksessa.",
    manual: [
      "Avaa Dokumentit-näkymä ja tarkista dokumentin nykyinen versio.",
      "Lisää dokumenttiin uusi versio ja anna muutoskuvaus.",
      "Varmista, että versionumero kasvaa yhdellä.",
      "Lataa sivu uudelleen ja tarkista versionumero sekä muutoskuvaus.",
    ],
    test: `import { test, expect } from "@playwright/test";

test("uusi dokumenttiversio säilyy latauksessa", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Dokumentit", exact: true }).click();
  const doc = page.getByTestId("document-d1");
  await expect(doc.getByTestId("latest-version")).toHaveText("v3");
  await doc.getByRole("button", { name: "Uusi versio" }).click();
  await page.getByLabel("Muutoskuvaus").fill("Ovien mitoitus tarkistettu");
  await page.getByRole("button", { name: "Lisää versio", exact: true }).click();
  await expect(doc.getByTestId("latest-version")).toHaveText("v4");
  await page.reload();
  await page.getByRole("button", { name: "Dokumentit", exact: true }).click();
  await expect(doc.getByTestId("latest-version")).toHaveText("v4");
});`,
  },
  dependency: {
    label: "Tehtävän riippuvuuden noudattaminen",
    risk: "Tehtävä voidaan merkitä valmiiksi ennen edeltävää tehtävää.",
    requirement: "Riippuvaista tehtävää ei saa merkitä valmiiksi, jos sen edeltävä tehtävä on keskeneräinen.",
    manual: [
      "Avaa Tehtävät-näkymä ja etsi tehtävä, jolla on keskeneräinen edeltäjä.",
      "Yritä muuttaa riippuvaisen tehtävän tilaksi Valmis.",
      "Varmista, että järjestelmä ilmoittaa riippuvuudesta.",
      "Tarkista, että tehtävän tila pysyy muuttumattomana.",
    ],
    test: `import { test, expect } from "@playwright/test";

test("riippuvuus estää tehtävän valmistumisen", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Tehtävät", exact: true }).click();
  const status = page.getByRole("combobox", { name: "Tila: Julkisivumateriaalien tilaus" });
  await status.selectOption("done");
  await expect(page.getByRole("alert")).toContainText("Edeltävän tehtävän on oltava valmis.");
  await expect(status).toHaveValue("todo");
});`,
  },
  permission: {
    label: "Lukijan muokkausoikeuksien esto",
    risk: "Lukija pystyy lisäämään tai muuttamaan dokumenttiversioita.",
    requirement: "Lukijaroolissa dokumenttiversion lisääminen on estettävä, eikä dokumentin tila saa muuttua.",
    manual: [
      "Avaa Dokumentit-näkymä ja vaihda harjoitusrooliksi Lukija.",
      "Yritä lisätä dokumenttiin uusi versio.",
      "Tarkista, että sovellus ilmoittaa käyttöoikeuden puuttumisesta.",
      "Varmista, ettei dokumentin versionumero muutu.",
    ],
    test: `import { test, expect } from "@playwright/test";

test("lukijan muokkaus estetään", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Dokumentit", exact: true }).click();
  await page.getByLabel("Harjoitusrooli").selectOption("viewer");
  const doc = page.getByTestId("document-d1");
  await doc.getByRole("button", { name: "Uusi versio" }).click();
  await page.getByLabel("Muutoskuvaus").fill("Luvaton muutos");
  await page.getByRole("button", { name: "Lisää versio", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Lukijalla ei ole oikeutta lisätä versiota.");
  await expect(doc.getByTestId("latest-version")).toHaveText("v3");
});`,
  },
};

export function makePrompt(testCase: TestCase, context: string): string {
  const item = cases[testCase];
  const additional = context.trim();
  return [
    "Toimi kokeneena QA-asiantuntijana ja Playwright-testiautomaation suunnittelijana.",
    `Testattava riski: ${item.label}`,
    `Riski: ${item.risk}`,
    `Hyväksymiskriteeri: ${item.requirement}`,
    "Laadi positiivinen ja negatiivinen testitapaus, testidata, toistettavat vaiheet ja Playwright-testiluonnos.",
    "Perustele odotetut tulokset. Huomioi käyttöoikeudet, tietojen pysyvyys ja testien eristys tarpeen mukaan.",
    "Älä oleta testejä suoritetuiksi; kerro mitkä tiedot pitää tarkistaa sovelluksesta.",
    ...(additional ? [`Lisäkonteksti: ${additional}`] : []),
  ].join("\n\n");
}
