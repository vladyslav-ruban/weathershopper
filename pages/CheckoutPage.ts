import { expect, Locator, Page } from "@playwright/test";

export class CheckoutPage {
  readonly page: Page;
  readonly payWithCardButton: Locator;
  readonly paymentSuccessMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.payWithCardButton = page.getByRole("button", {
      name: "Pay with Card",
    });
    this.paymentSuccessMessage = page.getByRole("heading", {
      level: 2,
      name: "PAYMENT SUCCESS",
    });
  }

  async verifyItemsInCart(query: string): Promise<void> {
    const pattern = new RegExp(query, "i");
    await expect(this.page.getByRole("cell", { name: pattern })).toBeVisible();
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
