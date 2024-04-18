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


test('test add a new listing', async ({ page }) => {
  await page.goto('http://localhost:8080/api/login-callback?key=alpha&id=6619e83c2fb8ef96b281431d');
  await page.getByRole('link', { name: 'Profile' }).click();
  await page.getByRole('button', { name: 'Add New Listing' }).click();
  await page.getByPlaceholder('Enter the title of your').click();
  await page.getByPlaceholder('Enter the title of your').fill('Used Monitor');
  await page.getByPlaceholder('Provide a detailed').click();
  await page.getByPlaceholder('Provide a detailed').fill('A used monitor in excellent condition');
  await page.getByLabel('Category').selectOption('Electronics');
  await page.getByPlaceholder('Enter the price').click();
  await page.getByPlaceholder('Enter the price').fill('85');
  await page.getByLabel('Condition').selectOption('Used');
  await page.getByPlaceholder('Enter the location of your').click();
  await page.getByPlaceholder('Enter the location of your').fill('West Campus');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.locator('#app')).toContainText('Used Monitor');
  await page.getByLabel('Return to home').click();
  await page.getByRole('button', { name: 'Electronics' }).click();
  await page.getByRole('heading', { name: 'Used Monitor' }).nth(0).click();
  await expect(page.locator('h1')).toContainText('Used Monitor');
});