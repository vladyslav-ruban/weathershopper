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
    await this.page.goto("https://weathershopper.pythonanywhere.com/");
  }

  async clickBuyMoisturizers() {
    await this.buyMoisturizersButton.click();
  }

  async clickBuySunscreens() {
    await this.buySunscreensButton.click();
  }

  async getTemperatureValue(): Promise<number> {
    return this.temperatureSpan.evaluate((el) => {
      const raw = el.firstChild?.textContent?.trim().replace("−", "-");

      return Number(raw);
    });
  }
}
