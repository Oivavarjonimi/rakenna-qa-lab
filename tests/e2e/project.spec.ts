
import { test, expect, type Page } from "@playwright/test";

// Jokainen testi saa oman selainkontekstinsa.
// Avaa sovellus ennen jokaista testiä.
test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

// Tulosta diagnostiikkatiedot, jos testi epäonnistuu.
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === testInfo.expectedStatus) {
    return;
  }

  console.log("\n=== TESTIN VIRHEDIAGNOSTIIKKA ===");
  console.log("Testi:", testInfo.title);
  console.log("URL:", page.url());

  try {
    console.log("Sivun otsikko:", await page.title());

    const buttons = await page
      .getByRole("button")
      .allTextContents();

    console.log("Painikkeet:", buttons);

    const screenshot = testInfo.outputPath("debug-page.png");

    await page.screenshot({
      path: screenshot,
      fullPage: true,
      timeout: 5000,
    });

    await testInfo.attach("debug-page", {
      path: screenshot,
      contentType: "image/png",
    });

    console.log("Kuvakaappaus:", screenshot);
  } catch (error) {
    console.log("Diagnostiikka epäonnistui:", error);
  }

  console.log("================================\n");
});

// Luo yksilöllinen tehtävänimi.
function uniqueTaskName(): string {
  return `Laatukatselmointi-${crypto.randomUUID()}`;
}

// Avaa Tehtävät-näkymä ja tarkista painikkeen näkyvyys.
async function openTasks(page: Page) {
  const button = page.getByRole("button", {
    name: "Tehtävät",
    exact: true,
  });

  await expect(
    button,
    "Tehtävät-painiketta ei löydy. Tarkista sivun URL, palvelin ja painikkeen nimi.",
  ).toBeVisible({ timeout: 10000 });

  await button.click();
}

// Luo tehtävä valittuun projektiin.
async function createTask(
  page: Page,
  name: string,
  cost = "500",
) {
  await page.getByRole("button", {
    name: "Uusi tehtävä",
    exact: true,
  }).click();

  await page.getByLabel("Tehtävän nimi", {
    exact: true,
  }).fill(name);

  await page.getByLabel("Kustannusarvio (€)", {
    exact: true,
  }).fill(cost);

  await page.getByRole("button", {
    name: "Tallenna tehtävä",
    exact: true,
  }).click();

  await expect(
    page.getByText(name, { exact: true }),
  ).toBeVisible();
}

// 1. Tehtävän tallennus ja projektikohtaisuus
test("uusi tehtävä säilyy sivun latauksessa ja kuuluu oikeaan projektiin", async ({
  page,
}) => {
  await openTasks(page);

  await createTask(page, "Laatukatselmointi");

  await page.reload();
  await openTasks(page);

  await expect(
    page.getByText("Laatukatselmointi", { exact: true }),
  ).toBeVisible();

  await page.getByLabel("Valittu projekti").selectOption("p2");

  await expect(
    page.getByText("Laatukatselmointi", { exact: true }),
  ).toHaveCount(0);
});

// 2. Virheellisen tehtävänimen validointi
test("pelkistä välilyönneistä koostuva nimi hylätään", async ({
  page,
}) => {
  await page.getByRole("button", {
    name: "Uusi tehtävä",
    exact: true,
  }).click();

  await page.getByLabel("Tehtävän nimi", {
    exact: true,
  }).fill("   ");

  await page.getByRole("button", {
    name: "Tallenna tehtävä",
    exact: true,
  }).click();

  await expect(page.getByRole("alert")).toContainText(
    "Tehtävän nimi on pakollinen.",
  );

  await expect(page.getByRole("dialog")).toBeVisible();
});

// 3. Tehtävien riippuvuuksien tarkistaminen
test("riippuvuus estää tehtävän valmistumisen", async ({
  page,
}) => {
  await openTasks(page);

  const status = page.getByRole("combobox", {
    name: "Tila: Julkisivumateriaalien tilaus",
  });

  await status.selectOption("done");

  await expect(page.getByRole("alert")).toContainText(
    "Edeltävän tehtävän on oltava valmis.",
  );

  await expect(status).toHaveValue("todo");
});

// 4. Dokumenttiversion tallennuksen tarkistaminen
test("uusi dokumenttiversio säilyy latauksessa", async ({
  page,
}) => {
  await page.getByRole("button", {
    name: "Dokumentit",
    exact: true,
  }).click();

  const doc = page.getByTestId("document-d1");

  await expect(doc.getByTestId("latest-version")).toHaveText("v3");

  await doc.getByRole("button", {
    name: "Uusi versio",
  }).click();

  await page.getByLabel("Muutoskuvaus").fill(
    "Ovien mitoitus tarkistettu",
  );

  await page.getByRole("button", {
    name: "Lisää versio",
    exact: true,
  }).click();

  await expect(doc.getByTestId("latest-version")).toHaveText("v4");

  await page.reload();

  await page.getByRole("button", {
    name: "Dokumentit",
    exact: true,
  }).click();

  await expect(doc.getByTestId("latest-version")).toHaveText("v4");

  await doc.getByRole("button", {
    name: "4 versiota",
  }).click();

  await expect(
    page.getByText("Ovien mitoitus tarkistettu", {
      exact: true,
    }),
  ).toHaveCount(2);
});

// 5. Käyttöoikeuksien tarkistaminen
test("lukijan muokkaus estetään", async ({ page }) => {
  await page.getByRole("button", {
    name: "Dokumentit",
    exact: true,
  }).click();

  await page.getByLabel("Harjoitusrooli").selectOption("viewer");

  const doc = page.getByTestId("document-d1");

  await doc.getByRole("button", {
    name: "Uusi versio",
  }).click();

  await page.getByLabel("Muutoskuvaus").fill("Luvaton muutos");

  await page.getByRole("button", {
    name: "Lisää versio",
    exact: true,
  }).click();

  await expect(page.getByRole("alert")).toContainText(
    "Lukijalla ei ole oikeutta lisätä versiota.",
  );

  await page.getByRole("button", {
    name: "Sulje ikkuna",
  }).click();

  await expect(doc.getByTestId("latest-version")).toHaveText("v3");
});

// 6. QA-labran harjoitusvirheen tunnistaminen
test("QA-labra havaitsee versionumeron harjoitusvirheen", async ({
  page,
}) => {
  await page.getByRole("button", {
    name: "QA-labra",
    exact: true,
  }).click();

  await page.getByRole("button", {
    name: "Suorita tarkistukset",
    exact: true,
  }).click();

  await expect(
    page.getByText("6 / 6 tarkistusta läpäisty"),
  ).toBeVisible();

  await page.getByLabel("Harjoitusvirhe", {
    exact: true,
  }).selectOption("version");

  await page.getByRole("button", {
    name: "Suorita tarkistukset",
    exact: true,
  }).click();

  await expect(
    page.getByText("5 / 6 tarkistusta läpäisty"),
  ).toBeVisible();

  await expect(
    page.getByText("1 havaittu virhe — testi teki tehtävänsä"),
  ).toBeVisible();
});

// 7. JavaScript-harjoituksen laskennan tarkistaminen
test("JavaScript-harjoitus laskee työn alla olevien tehtävien summan", async ({
  page,
}) => {
  await page.getByRole("button", {
    name: "Oppimispolku",
    exact: true,
  }).click();

  await page.getByLabel("JavaScript-harjoituskoodi").fill(
    "return tasks.filter(t => t.status === 'doing').reduce((s, t) => s + t.cost, 0);",
  );

  await page.getByRole("button", {
    name: "Suorita JavaScript",
    exact: true,
  }).click();

  await expect(
    page.getByText(
      "Tulos vastaa työn alla olevien tehtävien kustannussummaa.",
    ),
  ).toBeVisible();
});

// 8. Samannimisten tehtävien projektikohtainen eristäminen
test("samannimiset tehtävät pysyvät omissa projekteissaan", async ({
  page,
}) => {
  const taskName = uniqueTaskName();

  // Projekti 1
  await page.getByLabel("Valittu projekti").selectOption("p1");
  await openTasks(page);
  await createTask(page, taskName);

  await expect(
    page.getByText(taskName, { exact: true }),
  ).toHaveCount(1);

  // Projekti 2
  await page.getByLabel("Valittu projekti").selectOption("p2");

  // Projektin 1 tehtävä ei saa näkyä projektissa 2.
  await expect(
    page.getByText(taskName, { exact: true }),
  ).toHaveCount(0);

  // Luo samanniminen tehtävä projektiin 2.
  await createTask(page, taskName);

  await expect(
    page.getByText(taskName, { exact: true }),
  ).toHaveCount(1);

  // Lataa sivu uudelleen.
  await page.reload();
  await openTasks(page);

  // Tarkista projekti 1.
  await page.getByLabel("Valittu projekti").selectOption("p1");

  await expect(
    page.getByText(taskName, { exact: true }),
  ).toHaveCount(1);

  // Tarkista projekti 2.
  await page.getByLabel("Valittu projekti").selectOption("p2");

  await expect(
    page.getByText(taskName, { exact: true }),
  ).toHaveCount(1);
});
