import { Page, Locator } from "@playwright/test";

export class MainPage {
  readonly page: Page;
  readonly buyMoisturizersButton: Locator;
  readonly buySunscreensButton: Locator;
  readonly temperatureSpan: Locator;

  constructor(page: Page) {
    this.page = page;
    this.buyMoisturizersButton = page.getByRole("button", {
      name: "Buy moisturizers",
    });
    this.buySunscreensButton = page.getByRole("button", {
      name: "Buy sunscreens",
    });
    this.temperatureSpan = page.locator("#temperature");
  }

  async goto() {
    await this.page.goto("/");
  }

  async clickBuyMoisturizers() {
    await this.buyMoisturizersButton.click();
  }

  async clickBuySunscreens() {
    await this.buySunscreensButton.click();
  }

  async getTemperatureValue(): Promise<number> {
    const text = await this.temperatureSpan.innerText();
    const normalized = text
      .replace("−", "-")
      .replace(/\s+/g, "")
      .replace(/[^\d.-]/g, "");

    return Number(normalized);
  }
}
