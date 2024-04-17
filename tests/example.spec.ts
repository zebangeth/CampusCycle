import { test, expect } from '@playwright/test';

test('test contact seller', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  await page.getByRole('button', { name: 'Outdoors' }).click();
  await page.getByRole('img', { name: 'Mountain Bike image' }).click();
  await expect(page.getByRole('button', { name: 'Contact Seller' })).toBeVisible();
  await page.getByRole('button', { name: 'Contact Seller' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.locator('div').filter({ hasText: /^phoneNumber: 987-654-3210 Copy$/ }).getByRole('button').click();
});
