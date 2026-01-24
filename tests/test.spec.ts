import { test, expect } from "@playwright/test";
import { MainPage } from "../pages/MainPage";
import { ProductsPage } from "../pages/ProductsPage";
import { CheckoutPage } from "../pages/CheckoutPage";

test("Weathershopper tasks", async ({ page }) => {
  let product1 = "";
  let product2 = "";
  const mainPage = new MainPage(page);
  await mainPage.goto();
  const temperature = await mainPage.getTemperatureValue();

  if (temperature < 19) {
    product1 = "aloe";
    product2 = "almond";
    await mainPage.clickBuyMoisturizers();
  } else if (temperature > 34) {
    product1 = "spf-50";
    product2 = "spf-30";
    await mainPage.clickBuySunscreens();
  } else {
    throw new Error("Undefined temperature");
  }

  const productsPage = new ProductsPage(page);
  await productsPage.page.waitForLoadState("domcontentloaded");
  await productsPage.addCheapestProductCardWithSubstring(product1);
  await productsPage.addCheapestProductCardWithSubstring(product2);
  await productsPage.cartButton.click();
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.verifyItemsInCart(product1);
  await checkoutPage.verifyItemsInCart(product2);
  await checkoutPage.payWithCardButton.click();
  await checkoutPage.fillPaymentDataAndClickPay();

  await Promise.all([
    page.waitForResponse(
      (r) =>
        r.request().method() === "POST" &&
        r.url().includes("/confirmation") &&
        r.status() === 200,
    ),
    expect(checkoutPage.paymentSuccessMessage).toBeVisible({
      timeout: 10000,
    }),
  ]);
});
