import { expect, test } from "@playwright/test";

type InteractionCheck = {
  role: "link" | "button";
  name: string;
  scope?: string;
};

type RouteCheck = {
  path: string;
  headingName: string;
  interactions?: InteractionCheck[];
  requiredText?: string[];
  expectPolishChars?: boolean;
};

const polishCharsRegex = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/;

const pageChecks: RouteCheck[] = [
  {
    path: "/",
    headingName: "TRolling Stones - oficjalna strona",
    interactions: [
      { role: "link", name: "Zobacz koncerty", scope: "main" },
      { role: "link", name: "Aktualności", scope: "main" }
    ],
    expectPolishChars: true
  },
  {
    path: "/koncerty",
    headingName: "Koncerty",
    requiredText: ["Sprzedaż wkrótce"],
    expectPolishChars: true
  },
  {
    path: "/galeria",
    headingName: "Galeria",
    expectPolishChars: true
  },
  {
    path: "/aktualnosci",
    headingName: "Aktualności",
    expectPolishChars: true
  },
  {
    path: "/bio",
    headingName: "Bio",
    expectPolishChars: true
  },
  {
    path: "/sklad",
    headingName: "Skład",
    expectPolishChars: true
  },
  {
    path: "/kontakt",
    headingName: "Kontakt",
    interactions: [
      { role: "link", name: "booking@trollingstones.pl" },
      { role: "link", name: "+48 509 243 245" },
      { role: "link", name: "Rider techniczny (PDF)" }
    ],
    expectPolishChars: true
  }
];

const goto = async (page: import("@playwright/test").Page, path: string) => {
  await page.goto(path, { waitUntil: "networkidle" });
};

pageChecks.forEach(({ path, headingName, interactions = [], requiredText = [], expectPolishChars }) => {
  test.describe(path, () => {
    test("renders the main heading", async ({ page }) => {
      await goto(page, path);
      await expect(page.getByRole("heading", { level: 1, name: headingName })).toBeVisible();
    });

    if (interactions.length > 0) {
      test("contains required buttons or links", async ({ page }) => {
        await goto(page, path);
        for (const interaction of interactions) {
          const scope = interaction.scope ? page.locator(interaction.scope) : page;
          await expect(scope.getByRole(interaction.role, { name: interaction.name, exact: true })).toBeVisible();
        }
      });
    }

    if (requiredText.length > 0) {
      test("renders important copy", async ({ page }) => {
        await goto(page, path);
        const main = page.locator("main");
        for (const snippet of requiredText) {
          await expect(main).toContainText(snippet);
        }
      });
    }

    if (expectPolishChars) {
      test("includes Polish diacritics", async ({ page }) => {
        await goto(page, path);
        const content = await page.locator("body").innerText();
        expect(content).toMatch(polishCharsRegex);
      });
    }
  });
});

test("header navigation exposes all sections", async ({ page }) => {
  await goto(page, "/");
  const nav = page.locator("header nav");
  const navLinks = ["Koncerty", "Galeria", "Aktualności", "Bio", "Skład", "Kontakt"];
  for (const link of navLinks) {
    await expect(nav.getByRole("link", { name: link, exact: true })).toBeVisible();
  }
});

test("cookie banner buttons are actionable", async ({ page }) => {
  await goto(page, "/");
  const banner = page.locator("#cookie-banner");
  await banner.waitFor({ state: "visible" });
  await expect(banner.getByRole("link", { name: "Ustawienia", exact: true })).toBeVisible();
  await expect(banner.getByRole("button", { name: "Odrzuć", exact: true })).toBeVisible();
  const accept = banner.getByRole("button", { name: "Akceptuj wszystkie", exact: true });
  await expect(accept).toBeVisible();
  await accept.click();
  await expect(banner).toHaveClass(/hidden/);
});

