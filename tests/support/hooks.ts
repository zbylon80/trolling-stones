import { After, AfterAll, Before, BeforeAll, Status } from '@cucumber/cucumber';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import type { ITestCaseHookParameter } from '@cucumber/cucumber';
import type { PlaywrightWorld } from './world.js';
import { disposeSharedBrowser, ensureSharedBrowser } from './world.js';

const tracesDir = path.resolve('artifacts', 'traces');

function slugify(name: string): string {
  const hash = createHash('md5').update(name).digest('hex').slice(0, 6);
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + `-${hash}`
  );
}

BeforeAll(async function () {
  await ensureSharedBrowser();
});

Before(async function (this: PlaywrightWorld) {
  await this.init();
  await this.context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true
  });
});

After(async function (
  this: PlaywrightWorld,
  { pickle, result }: ITestCaseHookParameter
) {
  const scenarioName = pickle.name;
  const shouldKeepTrace = result?.status === Status.FAILED;

  if (shouldKeepTrace) {
    await mkdir(tracesDir, { recursive: true });
    const traceName = `${slugify(scenarioName)}.zip`;
    const tracePath = path.join(tracesDir, traceName);
    await this.context.tracing.stop({ path: tracePath });
  } else {
    await this.context.tracing.stop();
  }

  await this.cleanup();
});

AfterAll(async function () {
  await disposeSharedBrowser();
});
