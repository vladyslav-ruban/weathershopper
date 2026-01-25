import { expect, Locator, Page } from "@playwright/test";

export class CheckoutPage {
  readonly page: Page;
  readonly payWithCardButton: Locator;
  readonly paymentSuccessMessage: Locator;
  readonly totalPrice: Locator;

  constructor(page: Page) {
    this.page = page;

    this.payWithCardButton = page.getByRole("button", {
      name: "Pay with Card",
    });
    this.paymentSuccessMessage = page.getByRole("heading", {
      level: 2,
      name: "PAYMENT SUCCESS",
    });
    this.totalPrice = page.locator("#total");
  }

  async verifyCartItem(name: string, price: number): Promise<void> {
    const row = this.page
      .getByRole("row")
      .filter({ has: this.page.getByRole("cell", { name }) });

    await expect(row, `Row for item "${name}" should exist`).toHaveCount(1);

    await expect(
      row.getByRole("cell", { name: String(price) }),
      `Price for "${name}" should be ${price}`,
    ).toBeVisible();
  }

  async verifyTotalPrice(price1: number, price2: number): Promise<void> {
    expect(this.totalPrice).toContainText(String(price1 + price2));
  }

  async fillPaymentDataAndClickPay(): Promise<void> {
    const stripeFrame = this.page
      .locator('iframe[name="stripe_checkout_app"]')
      .contentFrame();
    await stripeFrame
      .getByRole("textbox", { name: "Email" })
      .pressSequentially("testemail@testemail.com", { delay: 100 });
    await stripeFrame
      .getByRole("textbox", { name: "Card number" })
      .pressSequentially("5555555555554444", { delay: 100 });
    await stripeFrame
      .getByRole("textbox", { name: "MM / YY" })
      .pressSequentially("01 / 29", { delay: 100 });
    await stripeFrame
      .getByRole("textbox", { name: "CVC" })
      .pressSequentially("123", { delay: 100 });
    const zipCodeInput = stripeFrame.getByRole("textbox", { name: "ZIP Code" });
    await zipCodeInput.waitFor({ state: "visible" });
    await zipCodeInput.pressSequentially("28045", { delay: 100 });
    await stripeFrame.getByRole("button", { name: /Pay/i }).click();
  }
}
