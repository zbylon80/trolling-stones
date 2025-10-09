import { setWorldConstructor, World } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
import type { Browser, BrowserContext, Page } from '@playwright/test';

let sharedBrowser: Browser | null = null;

const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:4321';

export interface PlaywrightWorld extends World {
  context: BrowserContext;
  page: Page;
  init(): Promise<void>;
  cleanup(): Promise<void>;
}

async function ensureSharedBrowser(): Promise<Browser> {
  if (!sharedBrowser) {
    sharedBrowser = await chromium.launch();
  }

  return sharedBrowser;
}

export async function disposeSharedBrowser(): Promise<void> {
  if (sharedBrowser) {
    await sharedBrowser.close();
    sharedBrowser = null;
  }
}

class CustomWorld extends World implements PlaywrightWorld {
  context!: BrowserContext;
  page!: Page;

  async init() {
    const browser = await ensureSharedBrowser();
    this.context = await browser.newContext({ baseURL });
    this.page = await this.context.newPage();
  }

  async cleanup() {
    await this.page?.close();
    await this.context?.close();
  }
}

setWorldConstructor(CustomWorld);

export { ensureSharedBrowser };
