import { DataTable, Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import type { PlaywrightWorld } from '../support/world.js';

type ControlOptions = {
  includeHidden?: boolean;
};

async function findControl(
  world: PlaywrightWorld,
  label: string,
  options: ControlOptions = {}
): Promise<Locator> {
  const { page } = world;
  const includeHidden = options.includeHidden ?? false;
  const roleOptions = { name: label, exact: true, includeHidden };

  const button = page.getByRole('button', roleOptions);
  const buttonCount = await button.count();
  if (buttonCount > 0) {
    if (buttonCount === 1) {
      return button;
    }
    return button.first();
  }

  const link = page.getByRole('link', roleOptions);
  const linkCount = await link.count();
  if (linkCount > 0) {
    if (linkCount === 1) {
      return link;
    }

    const mainRegion = page.getByRole('main', { includeHidden });
    if ((await mainRegion.count()) > 0) {
      const mainLink = mainRegion.getByRole('link', roleOptions);
      if ((await mainLink.count()) > 0) {
        return mainLink.first();
      }
    }

    return link.first();
  }

  throw new Error(`Control "${label}" not found on the page`);
}

Given('I open the page {string}', async function (
  this: PlaywrightWorld,
  path: string
) {
  await this.page.goto(path);
});

Given('the cookie banner storage is cleared', async function (
  this: PlaywrightWorld
) {
  await this.context.addInitScript(() => {
    try {
      localStorage.removeItem('cookieConsent');
    } catch {
      /* ignore */
    }
  });
  try {
    await this.page.evaluate(() => {
      localStorage.removeItem('cookieConsent');
    });
  } catch {
    /* ignore if navigation has not happened yet */
  }
});

When('I click the control {string}', async function (
  this: PlaywrightWorld,
  label: string
) {
  const control = await findControl(this, label);
  await control.click();
});

When('I use the language toggle to switch to {string}', async function (
  this: PlaywrightWorld,
  label: string
) {
  const control = await findControl(this, label);
  await control.click();
  await this.page.waitForLoadState('networkidle');
});

When('I open the first lightbox image', async function (this: PlaywrightWorld) {
  const trigger = this.page.locator('[data-lightbox]').first();
  await expect(trigger).toBeVisible();
  await trigger.click();
  const overlay = this.page.locator('#lightbox-overlay');
  await expect(overlay).toBeVisible();
});

Then('I should be at path {string}', async function (
  this: PlaywrightWorld,
  expectedPath: string
) {
  const url = await this.page.url();
  const { pathname } = new URL(url);
  const normalise = (value: string) => {
    if (value === '/') return '/';
    return value.endsWith('/') ? value.slice(0, -1) : value;
  };
  expect(normalise(pathname)).toBe(normalise(expectedPath));
});

Then('I should see heading {string}', async function (
  this: PlaywrightWorld,
  text: string
) {
  const heading = this.page.getByRole('heading', {
    level: 1,
    name: text,
    includeHidden: true
  });
  expect(await heading.count()).toBeGreaterThan(0);
});

Then('I should see the button {string}', async function (
  this: PlaywrightWorld,
  label: string
) {
  const control = await findControl(this, label);
  await expect(control).toBeVisible();
});

Then('I should see the hidden button {string}', async function (
  this: PlaywrightWorld,
  label: string
) {
  const control = await findControl(this, label, { includeHidden: true });
  expect(await control.count()).toBeGreaterThan(0);
});

Then('the main navigation should list:', async function (
  this: PlaywrightWorld,
  table: DataTable
) {
  const expected = table.raw().map((row) => row[0]);
  const items = await this.page.locator('header nav a').allTextContents();
  const normalised = items.map((item) => item.trim());
  expect(normalised).toEqual(expected);
});

Then('the hero intro should be {string}', async function (
  this: PlaywrightWorld,
  text: string
) {
  const heroSection = this.page.locator('section.container').first();
  const paragraph = heroSection.locator('p').first();
  await expect(paragraph).toHaveText(text);
});

Then('the intro paragraph should be {string}', async function (
  this: PlaywrightWorld,
  text: string
) {
  const intro = this.page.locator('section.container').first().locator('p').first();
  await expect(intro).toHaveText(text);
});

Then('the contact lead text should be {string}', async function (
  this: PlaywrightWorld,
  text: string
) {
  const lead = this.page.locator('section.container').locator('p').first();
  await expect(lead).toHaveText(text);
});

Then('the cookie message should be {string}', async function (
  this: PlaywrightWorld,
  text: string
) {
  const banner = this.page.locator('#cookie-banner');
  await this.page.waitForFunction(() => {
    const el = document.getElementById('cookie-banner');
    return el != null && !el.classList.contains('hidden');
  });
  await expect(banner).toBeVisible();
  const message = banner.locator('p');
  await expect(message).toHaveText(text);
});
