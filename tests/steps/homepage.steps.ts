import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { PlaywrightWorld } from '../support/world.js';

Given('I open the homepage', async function (this: PlaywrightWorld) {
  await this.page.goto('http://localhost:4321/');
});

Then('I should see the hero title', async function (this: PlaywrightWorld) {
  const heading = this.page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();
});
