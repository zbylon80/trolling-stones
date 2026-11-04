import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { PlaywrightWorld } from "../support/world.js";

Then("the gallery should show the main photos, promotional photos and concerts in order",
  async function (this: PlaywrightWorld) {
    const orderedSections = this.page.locator("h1 + #gallery-main + #gallery-promotional + #gallery-concerts");
    await expect(orderedSections).toHaveCount(1);
    await expect(this.page.locator("#gallery-main img[data-lightbox-hide-caption]")).toHaveCount(5);
    await expect(this.page.locator("#gallery-promotional .photo-album")).toHaveCount(1);
    const promo = this.page.locator("#gallery-promotional #portrety");
    await expect(promo.locator("summary strong")).toHaveText(/^(Sesja zdjęciowa zespołu|Band photo shoot)$/);
    await expect(promo.locator(".album-photo")).toHaveCount(99);
    await expect(promo.locator(".album-photo").last()).toHaveAttribute("href", "/images/gallery/sesja-2024/001.webp");
    await expect(this.page.locator("#gallery-concerts .photo-album").first()).toHaveAttribute("id", "czerwona-scena");
    const en = new URL(this.page.url()).pathname.startsWith("/en/");
    const lesniczowka = this.page.locator("#gallery-concerts #swiatla-sceny");
    const summary = lesniczowka.locator("summary");
    await expect(summary.locator("strong")).toHaveText("Leśniczówka Rock’n’Roll Cafe, Chorzów");
    await expect(summary.locator("a")).toHaveCount(0);
    await expect(summary.locator("time")).toHaveAttribute("datetime", "2024-12-13");
    await summary.press("Enter");
    const concertStory = lesniczowka.locator(".album-note").first();
    await expect(concertStory).toBeVisible();
    await expect(concertStory).toContainText("Out Of Control");
    const venueHistory = lesniczowka.getByRole("link", { name: en ? "About the venue (in Polish)" : "Historia klubu" });
    await expect(venueHistory).toHaveAttribute("href", "https://lesniczowka.art.pl/o-nas/");
    await expect(venueHistory).toHaveAttribute("target", "_blank");
    await summary.press("Enter");
    await expect(this.page.locator("#gallery-archive #scena-i-publicznosc time")).toHaveCount(0);
    await expect(this.page.locator("#gallery-archive #scena-i-publicznosc .album-photo")).toHaveCount(28);
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
    await expect(this.page.locator("main figcaption")).toHaveCount(3);
    await expect(this.page.locator("main [data-lightbox]:not([data-lightbox-hide-caption])")).toHaveCount(3);
    for (const index of [3, 6, 9]) {
      await expect(photos.nth(index).locator("figcaption")).toContainText(/Krzysztof [„“]Jary” Jaryczewski/);
    }
    await album.locator("summary").press("Enter");
  }
);

Then("the WOŚP album should open without visible photo captions and keep the alt text {string}", { timeout: 15000 },
  async function (this: PlaywrightWorld, alt: string) {
    const { page } = this;
    await page.setViewportSize({ width: 360, height: 800 });
    const albums = page.locator(".photo-album");
    await expect(albums).toHaveCount(11);
    await expect(page.locator(".album-photo")).toHaveCount(428);
    await expect(page.locator(".photo-album[open]")).toHaveCount(0);
    const album = page.locator("#wosp-gdansk-2025");
    await album.locator("summary").press("Enter");
    await expect(album).toHaveAttribute("open", "");
    await expect(album.locator(".album-photo")).toHaveCount(55);
    const photo = album.locator(".album-photo").first();
    await expect(photo.locator("img")).toHaveAttribute("loading", "lazy");
    await expect(photo.locator("img")).toHaveAttribute("alt", alt);
    await expect(album.locator("figcaption")).toHaveCount(0);
    await expect(photo).toHaveAttribute("href", "/images/gallery/wosp-gdansk-2025/001.webp");
    await photo.click();
    const overlay = page.locator("#lightbox-overlay");
    const largePhoto = page.locator("#lightbox-image");
    await expect(overlay).toBeVisible();
    await expect(largePhoto).toHaveAttribute("src", "/images/gallery/wosp-gdansk-2025/001.webp");
    await expect(page.locator("#lightbox-caption")).toBeHidden();
    await expect.poll(() => largePhoto.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    await page.keyboard.press("ArrowRight");
    await expect(largePhoto).toHaveAttribute("src", "/images/gallery/wosp-gdansk-2025/002.webp");
    await page.keyboard.press("Escape");
    await expect(overlay).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator("main img[data-lightbox-hide-caption]")).toHaveCount(5);
  }
);
