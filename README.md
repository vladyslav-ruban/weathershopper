# Weathershopper Playwright Tests

End-to-end Playwright tests for the Weathershopper demo site. The suite
selects products based on the current temperature, adds the cheapest
matching items to the cart, and completes a Stripe test checkout.

## Project Structure

- `pages/`: Page Object Model classes for main, products, and checkout pages.
- `tests/`: Playwright test specs.
- `playwright.config.ts`: Playwright configuration.

## Prerequisites

- Node.js 18+ recommended
- npm

## Install

```bash
npm install
```

## Run Tests

```bash
npx playwright test
```

## Tasks

- Main:
  Shop for moisturizers if the weather is below 19 degrees. Shop for suncreens if the weather is above 34 degrees.
- Moisturizers:
  Add two moisturizers to your cart. First, select the least expensive mositurizer that contains Aloe. For your second moisturizer, select the least expensive moisturizer that contains almond. Click on cart when you are done.
- Sunscreens:
  Add two sunscreens to your cart. First, select the least expensive sunscreen that is SPF-50. For your second sunscreen, select the least expensive sunscreen that is SPF-30. Click on the cart when you are done.
- Checkout:
  Verify that the shopping cart looks correct. Then, fill out your payment details and submit the form. You can Google for 'Stripe test card numbers' to use valid cards. Note: The payment screen will error 5% of the time by design
- Payment:
  Verify if the payment was successful. The app is setup so there is a 5% chance that your payment failed.

## Notes

- Test waits for the "PAYMENT SUCCESS" message and the `/confirmation` request to succeed.
- Error thrown in case 19 >= temperature <= 34, because no handling of this condition expected.
- Test fails in case of "5% error" because no handling of this condition expected.
