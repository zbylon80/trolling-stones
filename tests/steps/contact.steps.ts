import { DataTable, Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { PlaywrightWorld } from '../support/world.js';

Given('I open the kontakt page', async function (this: PlaywrightWorld) {
  await this.page.goto('/kontakt');
});

When(
  'I open the kontakt page in English',
  async function (this: PlaywrightWorld) {
    await this.page.goto('/en/kontakt');
  }
);

Then('the heading should be {string}', async function (
  this: PlaywrightWorld,
  text: string
) {
  const heading = this.page.getByRole('heading', { level: 1, name: text });
  await expect(heading).toBeVisible();
});

Then(
  'I should see manager details:',
  async function (this: PlaywrightWorld, table: DataTable) {
    const rows = table.hashes();

    for (const row of rows) {
      const fieldLabel = row.field;
      const valueText = row.value;

      await expect(this.page.getByText(fieldLabel, { exact: false })).toBeVisible();
      if (valueText) {
        const link = this.page.getByRole('link', { name: valueText });
        await expect(link).toBeVisible();
      }
    }
  }
);

Then(
  'the social link {string} should point to {string}',
  async function (this: PlaywrightWorld, name: string, url: string) {
    const link = this.page.getByRole('link', { name });
    await expect(link).toHaveAttribute('href', url);
  }
);

Then(
  'the rider link should have text {string} and href {string}',
  async function (this: PlaywrightWorld, text: string, href: string) {
    const link = this.page.getByRole('link', { name: text });
    await expect(link).toHaveAttribute('href', href);
  }
);
