import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { PlaywrightWorld } from "../support/world.js";

// Independent expectations: dates are concert dates, not photo publication dates.
const archive = [
  ["2026-07-11", "Połchowo"],
  ["2026-07-10", "Stężyca"],
  ["2026-05-23", "Sycowa Huta"],
  ["2025-12-06", "Gdynia"],
  ["2025-05-18", "Sopot"],
  ["2025-01-26", "Gdańsk"],
  ["2025-01-10", "Koszalin"],
  ["2024-12-13", "Chorzów"],
  ["2024-12-07", "Gdynia"],
  ["2024-12-06", "Malbork"],
  ["2024-09-21", "Toruń"],
  ["2024-09-20", "Białystok"],
  ["2024-08-30", "Gdańsk"],
  ["2024-07-20", "Kaliska"],
  ["2024-05-05", "Bydgoszcz"],
  ["2023-11-18", "Gdynia"],
  ["2022-11-19", "Gdynia"],
  ["2021-08-07", "Żukowo"],
  ["2019-12-07", "Gdynia"],
  ["2019-09-07", "Gdańsk"],
  ["2019-04-26", "Lębork"],
  ["2019-01-26", "Gdynia"]
];

Then("the concert archive should contain the researched shows", async function (this: PlaywrightWorld) {
  const cards = this.page.locator(".concert-entry:not([data-private-concert])");
  await expect(cards).toHaveCount(archive.length);
  const actual = await cards.evaluateAll((items) => items.map((item) => [
    item.querySelector("time")?.getAttribute("datetime"),
    item.querySelector("h3")?.textContent
  ]));
  expect(actual).toEqual(archive);
  expect(new Set(actual.map(([date, city]) => `${date}/${city}`)).size).toBe(archive.length);
  await expect(this.page.locator('.memory-card time[datetime="2024-12-12"]')).toHaveCount(0);
  await expect(this.page.locator(".archive-section")).not.toContainText("Łódź");
  await expect(cards.filter({ hasText: "Połchowo" })).toContainText("Rock na Fali");
  await expect(cards.filter({ hasText: "Koszalin" }).locator(".memory-venue")).toHaveCount(0);
});

Then("the concert archive should show local previews without duplicating the original photograph", { timeout: 20000 }, async function (this: PlaywrightWorld) {
  await expect(this.page.locator('.memory-card img[src="/images/blues.jpg"]')).toHaveCount(1);
  const previews = this.page.locator(".memory-preview img");
  await expect(previews).toHaveCount(10);
  for (const image of await previews.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveAttribute("src", /^\/images\/concerts\/[a-z0-9-]+\.webp$/);
    await expect(image).toHaveAttribute("loading", "lazy");
    await expect(image).toHaveAttribute("alt", /\S/);
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
    expect(await image.evaluate((element) => getComputedStyle(element).objectFit)).toBe("contain");
  }
  await expect(this.page.locator(".memory-card:not([data-private-concert]) .memory-art")).toHaveCount(4);
  await expect(this.page.locator(".older-list img")).toHaveCount(0);
  const thumbnailLinks = await this.page.locator(".memory-preview-link").evaluateAll((links) => links.map((link) => ({
    href: link.getAttribute("href"), source: link.closest(".memory-card")?.querySelector(".source-link")?.getAttribute("href")
  })));
  for (const link of thumbnailLinks) expect(link.href).toBe(link.source);
});

Then("the next concert should start at nineteen thirty with tickets available", async function (this: PlaywrightWorld) {
  const poster = this.page.locator(".show-poster");
  await expect(poster).toHaveCount(1);
  await expect(poster.locator(".poster-time time")).toHaveText("19:30");
  await expect(poster.locator(".poster-time time")).toHaveAttribute("datetime", "2026-12-05T19:30:00+01:00");
  await expect(poster.locator(".primary-action")).toHaveAttribute("href", "https://www.bluesclub.pl/project/trolling-stones-out-of-control-tour-2024/");
  await expect(poster.locator(".ticket-note")).toHaveCount(0);
});

Then("the concert metadata should include the full archive and local start time", async function (this: PlaywrightWorld) {
  const raw = await this.page.locator('.shows-page script[type="application/ld+json"]').textContent();
  const events = JSON.parse(raw ?? "{}")["@graph"];
  expect(events).toHaveLength(archive.length + 1);
  expect(events[0].startDate).toBe("2026-12-05T19:30:00+01:00");
  expect(events[0].offers.url).toBe("https://www.bluesclub.pl/project/trolling-stones-out-of-control-tour-2024/");
  expect(events.slice(1).map((event: { startDate: string }) => event.startDate)).toEqual(archive.map(([date]) => date));
  expect(events.slice(1).every((event: { offers?: unknown }) => !event.offers)).toBe(true);
});

Then("the concert sources should link directly to the original reports", async function (this: PlaywrightWorld) {
  const links = this.page.locator(".source-link");
  await expect(links).toHaveCount(20);
  const sources = await links.evaluateAll((items) => items.map((item) => ({
    href: item.getAttribute("href"), target: item.getAttribute("target"), rel: item.getAttribute("rel")
  })));
  for (const source of sources) {
    expect(source.href).toMatch(/^https:\/\//);
    expect(source.target).toBe("_blank");
    expect(source.rel).toBe("noopener noreferrer");
  }
  expect(sources.some(({ href }) => href === "https://www.facebook.com/media/set/?set=a.2285942688399167&type=3")).toBe(true);
  expect(sources.some(({ href }) => href === "https://ckgminapuck.pl/kalendarz/rock-na-fali-polchowo/")).toBe(true);
});

Then("the private shows should have illustrations and well-spaced weekend dates", async function (this: PlaywrightWorld) {
  const cards = this.page.locator("[data-private-concert]");
  await expect(cards).toHaveCount(8);
  const dates = await cards.locator("time").evaluateAll((items) => items.map((item) => item.getAttribute("datetime")!));
  expect(dates).toEqual([
    "2026-10-02", "2026-08-22", "2026-03-13", "2026-01-17",
    "2025-10-10", "2025-08-23", "2025-06-20", "2025-03-15"
  ]);
  const allDates = await this.page.locator(".concert-entry time, .date-stamp").evaluateAll((items) => items.map((item) => item.getAttribute("datetime")!));
  expect(new Set(allDates).size).toBe(allDates.length);
  for (const year of ["2025", "2026"]) expect(dates.filter((date) => date.startsWith(year))).toHaveLength(4);
  for (const date of dates) {
    const timestamp = Date.parse(`${date}T12:00:00Z`);
    expect([5, 6]).toContain(new Date(timestamp).getUTCDay());
    expect(date < "2026-10-25").toBe(true);
    for (const other of allDates.filter((value) => value !== date)) {
      expect(Math.abs(timestamp - Date.parse(`${other}T12:00:00Z`)) / 86400000).toBeGreaterThanOrEqual(14);
    }
  }
  const displayed = await this.page.locator(".concert-entry time").evaluateAll((items) => items.map((item) => item.getAttribute("datetime")!));
  expect(displayed).toEqual([...displayed].sort().reverse());
  await expect(cards.locator("a, img")).toHaveCount(0);
  await expect(cards.locator("svg.private-event-thumbnail")).toHaveCount(8);
  await expect(cards.getByRole("img")).toHaveCount(8);
  await expect(this.page.locator(".demo-label, [data-demo-concert]")).toHaveCount(0);
  await expect(this.page.locator(".archive-section")).not.toContainText(/Wpis testowy|Sample entry/);
  const gradients = await cards.locator("radialGradient").evaluateAll((items) => items.map((item) => item.id));
  expect(new Set(gradients).size).toBe(8);
  const expectedHeading = new URL(this.page.url()).pathname.startsWith("/en/") ? "Private event" : "Impreza zamknięta";
  for (const card of await cards.all()) {
    await expect(card.locator("h3")).toHaveText(expectedHeading);
    await expect(card.locator("svg")).toHaveAttribute("aria-label", /\S/);
  }
});

Then("older shows should expand into a compact list and collapse with the keyboard", async function (this: PlaywrightWorld) {
  const details = this.page.locator(".older-shows");
  const summary = details.locator("summary");
  const list = details.locator(".older-list");
  const rows = list.locator(".older-concert");
  await expect(details).not.toHaveAttribute("open", "");
  await expect(list).toBeHidden();
  await expect(summary.locator(".when-closed")).toBeVisible();
  await expect(summary.locator(".when-open")).toBeHidden();
  const mainDates = await this.page.locator(".archive-grid time").evaluateAll((items) => items.map((item) => item.getAttribute("datetime")!));
  expect(mainDates).toHaveLength(23);
  expect(mainDates.every((date) => date >= "2024-01-01")).toBe(true);
  expect(mainDates.filter((date) => date.startsWith("2024"))).toHaveLength(8);
  await summary.focus();
  await summary.press("Enter");
  await expect(details).toHaveAttribute("open", "");
  await expect(list).toBeVisible();
  await expect(summary.locator(".when-open")).toBeVisible();
  await expect(rows).toHaveCount(7);
  await expect(list.locator("img, .memory-card")).toHaveCount(0);
  const oldDates = await rows.locator("time").evaluateAll((items) => items.map((item) => item.getAttribute("datetime")!));
  expect(oldDates).toEqual(archive.filter(([date]) => date < "2024-01-01").map(([date]) => date));
  for (const row of await rows.all()) {
    await expect(row.locator("h3")).toBeVisible();
    await expect(row.locator(".older-location p")).toBeVisible();
    await expect(row.locator("a")).toBeVisible();
    await expect(row.locator("a")).toHaveAttribute("href", /^https:\/\//);
  }
  expect(await this.page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await summary.press("Space");
  await expect(details).not.toHaveAttribute("open", "");
  await expect(list).toBeHidden();
  await expect(summary).toBeFocused();
});
