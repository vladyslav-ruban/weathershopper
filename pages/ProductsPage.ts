import { expect, Locator, Page } from "@playwright/test";

export class ProductsPage {
  private readonly page: Page;
  private readonly productCards: Locator;
  private readonly cartButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.cartButton = page.getByRole("button", { name: "Cart", exact: false });
    this.productCards = page.locator(".text-center.col-4");
  }

  async goToCart(): Promise<void> {
    await this.cartButton.click();
  }

  async waitForReady(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
  }

  private priceLine(card: Locator): Locator {
    return card.locator("p", { hasText: "Price:" });
  }

  private addButton(card: Locator): Locator {
    return card.locator("button.btn.btn-primary", { hasText: "Add" });
  }

  private productTitle(card: Locator): Locator {
    return card.locator("p.font-weight-bold");
  }

  private async productPrice(card: Locator): Promise<number> {
    const priceText = (await this.priceLine(card).innerText()).trim();

    const afterColon = priceText.split(":").pop()?.trim();
    if (!afterColon) {
      throw new Error(`Bad price format: "${priceText}"`);
    }

    const raw = afterColon.startsWith("Rs.")
      ? afterColon.slice("Rs.".length).trim()
      : afterColon;

    const price = Number(raw);
    if (Number.isNaN(price)) {
      throw new Error(`Cannot parse price from: "${priceText}"`);
    }

    return price;
  }

  async getCheapestProductCardWithSubstring(
    substring: string,
  ): Promise<{ productCard: Locator; name: string; price: number }> {
    await this.productCards.first().waitFor({ state: "visible" });
    const cards = await this.productCards.all();

    let bestCard: Locator | null = null;
    let bestPrice = Number.POSITIVE_INFINITY;
    let bestName = "";

    for (const card of cards) {
      const name = (await this.productTitle(card).innerText()).trim();
      const normalizedName = name.toLowerCase();

      if (!normalizedName.includes(substring.toLowerCase())) continue;

      const price = await this.productPrice(card);

      if (price < bestPrice) {
        bestPrice = price;
        bestCard = card;
        bestName = name;
      }
    }

    if (!bestCard) {
      throw new Error(`No product card found with substring "${substring}"`);
    }

    return {
      productCard: bestCard,
      name: bestName,
      price: bestPrice,
    };
  }

  async addProduct(productCard: Locator): Promise<void> {
    await this.addButton(productCard).click();
  }
}
