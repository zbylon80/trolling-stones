import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { PlaywrightWorld } from "../support/world.js";

Then("the gallery should show the main photos, promotional photos and concerts in order",
  async function (this: PlaywrightWorld) {
    const orderedSections = this.page.locator("h1 + #gallery-main + #gallery-promotional + #gallery-concerts");
    await expect(orderedSections).toHaveCount(1);
    await expect(this.page.locator("#gallery-main img[data-lightbox-hide-caption]")).toHaveCount(5);
    await expect(this.page.locator("#gallery-promotional .photo-album").first()).toHaveAttribute("id", "portrety");
    await expect(this.page.locator("#gallery-promotional #sesja-2024")).toHaveCount(1);
    await expect(this.page.locator("#gallery-concerts .photo-album").first()).toHaveAttribute("id", "czerwona-scena");
    await expect(this.page.locator("#gallery-archive #archiwum")).toHaveCount(1);
  }
);

Then("the Blues Club album should credit the guests and caption Jary's photos",
  async function (this: PlaywrightWorld) {
    const album = this.page.locator("#gallery-concerts #czerwona-scena");
    await expect(album.locator("time")).toHaveAttribute("datetime", "2025-12-06");
    await album.locator("summary").press("Enter");
    await expect(album.locator(".album-note")).toContainText("Paula Szczepkowska");
    await expect(album.locator(".album-note")).toContainText("Jaryczewski");
    const photos = album.locator(".album-grid > li");
    await expect(photos).toHaveCount(10);
    for (const index of [3, 6, 9]) {
      await expect(photos.nth(index).locator("figcaption")).toContainText(/Krzysztof [„“]Jary” Jaryczewski/);
    }
    await album.locator("summary").press("Enter");
  }
);

Then("the gallery should open the WOŚP album with the caption {string}", { timeout: 15000 },
  async function (this: PlaywrightWorld, caption: string) {
    const { page } = this;
    await page.setViewportSize({ width: 360, height: 800 });
    const albums = page.locator(".photo-album");
    await expect(albums).toHaveCount(12);
    await expect(page.locator(".album-photo")).toHaveCount(428);
    await expect(page.locator(".photo-album[open]")).toHaveCount(0);
    const album = page.locator("#wosp-gdansk-2025");
    await album.locator("summary").press("Enter");
    await expect(album).toHaveAttribute("open", "");
    await expect(album.locator(".album-photo")).toHaveCount(55);
    const photo = album.locator(".album-photo").first();
    await expect(photo.locator("img")).toHaveAttribute("loading", "lazy");
    await expect(photo.locator("img")).toHaveAttribute("alt", caption);
    await expect(album.locator("figcaption").first()).toHaveText(caption);
    await expect(photo).toHaveAttribute("href", "/images/gallery/wosp-gdansk-2025/001.webp");
    await photo.click();
    const overlay = page.locator("#lightbox-overlay");
    const largePhoto = page.locator("#lightbox-image");
    await expect(overlay).toBeVisible();
    await expect(largePhoto).toHaveAttribute("src", "/images/gallery/wosp-gdansk-2025/001.webp");
    await expect(page.locator("#lightbox-caption")).toHaveText(caption);
    await expect.poll(() => largePhoto.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    await page.keyboard.press("ArrowRight");
    await expect(largePhoto).toHaveAttribute("src", "/images/gallery/wosp-gdansk-2025/002.webp");
    await page.keyboard.press("Escape");
    await expect(overlay).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator("main img[data-lightbox-hide-caption]")).toHaveCount(5);
  }
);
