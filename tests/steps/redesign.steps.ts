import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { PlaywrightWorld } from "../support/world.js";

Given("I use a mobile viewport", async function (this: PlaywrightWorld) {
  await this.page.setViewportSize({ width: 390, height: 844 });
});

Given("I use a narrow viewport", async function (this: PlaywrightWorld) {
  await this.page.setViewportSize({ width: 320, height: 780 });
});

When("I open the mobile menu", async function (this: PlaywrightWorld) {
  await this.page.locator("#site-menu summary").click();
});

When("I press Escape", async function (this: PlaywrightWorld) {
  await this.page.keyboard.press("Escape");
});

Then("the mobile menu should be closed", async function (this: PlaywrightWorld) {
  await expect(this.page.locator("#site-menu")).not.toHaveAttribute("open", "");
  await expect(this.page.locator(".site-nav")).toBeHidden();
});

Then("the mobile menu should be open", async function (this: PlaywrightWorld) {
  await expect(this.page.locator(".site-nav")).toBeVisible();
});

Then("focus should return to the mobile menu", async function (this: PlaywrightWorld) {
  await expect(this.page.locator("#site-menu summary")).toBeFocused();
});

Given("the YouTube player is stubbed", async function (this: PlaywrightWorld) {
  await this.context.route("https://www.youtube-nocookie.com/**", (route) =>
    route.fulfill({ contentType: "text/html", body: "<!doctype html><title>Test player</title>" })
  );
});

Then("a YouTube player should not be loaded", async function (this: PlaywrightWorld) {
  await expect(this.page.locator("#yt-container iframe")).toHaveCount(0);
});

Then("the latest YouTube player should be loaded", async function (this: PlaywrightWorld) {
  await expect(this.page.locator("#yt-container iframe")).toHaveAttribute("src", "https://www.youtube-nocookie.com/embed/8VtqYMDBSe8?autoplay=1");
});

Then("the selected clip counter should be {string}", async function (this: PlaywrightWorld, counter: string) {
  await expect(this.page.locator("[data-video-count]")).toHaveText(counter);
});

Then("the page should fit the viewport", async function (this: PlaywrightWorld) {
  expect(await this.page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

Then("the band metadata should be valid JSON", async function (this: PlaywrightWorld) {
  const data = await this.page.locator('head script[type="application/ld+json"]').textContent();
  expect(JSON.parse(data ?? "{}")["@type"]).toBe("MusicGroup");
});

Then("the language alternates should include Polish and English", async function (this: PlaywrightWorld) {
  await expect(this.page.locator('link[rel="alternate"][hreflang="pl"]')).toHaveAttribute("href", "https://trollingstones.pl/");
  await expect(this.page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", "https://trollingstones.pl/en");
});

Then("the gallery should show {int} photographs", async function (this: PlaywrightWorld, count: number) {
  await expect(this.page.locator(".gallery-item:visible")).toHaveCount(count);
});

Then("focus should be inside the photo preview", async function (this: PlaywrightWorld) {
  await expect(this.page.locator("#lightbox-close")).toBeFocused();
});

Then("the photo preview should close and restore focus", async function (this: PlaywrightWorld) {
  await expect(this.page.locator("#lightbox-overlay")).not.toBeVisible();
  await expect(this.page.locator("[data-lightbox]").first()).toBeFocused();
});

Then("the past Blues Club article should not offer tickets", async function (this: PlaywrightWorld) {
  const article = this.page.locator('[id="2025-12-06-gdynia"]');
  await expect(article).toBeVisible();
  await expect(article.getByRole("link", { name: /Kup bilety/i })).toHaveCount(0);
  await expect(article.getByText("Wydarzenie minione")).toBeVisible();
});

When("I follow the Blues Club memory", async function (this: PlaywrightWorld) {
  await this.page.locator(".story-link").click();
});

Then("I should reach the Blues Club story", async function (this: PlaywrightWorld) {
  await expect(this.page).toHaveURL(/\/aktualnosci#2025-12-07-blues-club-podziekowania$/);
  await expect(this.page.locator('[id="2025-12-07-blues-club-podziekowania"]')).toBeInViewport();
});
