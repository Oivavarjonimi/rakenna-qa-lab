
import { test, expect } from "@playwright/test";

test("sovellus käynnistyy ja näyttää käyttöliittymän", async ({ page }) => {
  const errors: string[] = [];

  // Kerää selaimen JavaScript-virheet.
  page.on("pageerror", (error) => {
    console.error("JAVASCRIPT-VIRHE:", error.message);
    errors.push(error.message);
  });

  // Kerää selaimen konsolivirheet.
  page.on("console", (message) => {
    if (message.type() === "error") {
      console.error("KONSOLIVIRHE:", message.text());
    }
  });

  // Havaitse epäonnistuneet verkkopyynnöt.
  page.on("requestfailed", (request) => {
    console.error(
      "VERKKOVIRHE:",
      request.url(),
      request.failure()?.errorText,
    );
  });

  const response = await page.goto("/");

  console.log("HTTP-status:", response?.status());
  console.log("URL:", page.url());
  console.log("Otsikko:", await page.title());

  // Tarkista Reactin juurielementin sisältö.
  const root = page.locator("#root");

  await expect(root).toHaveCount(1);

  console.log(
    "Root-elementin sisältö:",
    (await root.innerText()).slice(0, 2000),
  );

  // Tallenna kuvakaappaus.
  await page.screenshot({
    path: "startup-debug.png",
    fullPage: true,
  });

  console.log(
    "Painikkeiden määrä:",
    await page.getByRole("button").count(),
  );

  // JavaScript ei saa kaatua käynnistyksessä.
  expect(errors, "Sovelluksen JavaScript-virheet").toEqual([]);

  // Varmista, että käyttöliittymä renderöityi.
  await expect(
    page.getByRole("button", {
      name: "Tehtävät",
      exact: true,
    }),
  ).toBeVisible({ timeout: 10000 });
});
