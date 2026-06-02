import { config } from 'dotenv';
config({ path: '.env' });

import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

test('customer can complete a booking', async ({ page }) => {
  await page.goto('/#book');

  // Step 0: pick the first service
  await page.locator('#book .choice').first().click();
  await page.locator('#book').getByRole('button', { name: /Continue/i }).click();

  // Step 1: pick "No preference" (first stylist choice)
  await page.locator('#book .choice').first().click();
  await page.locator('#book').getByRole('button', { name: /Continue/i }).click();

  // Step 2: pick the first available date, wait for slots, pick the first slot
  await page.locator('#book .date-chip').first().click();
  const slot = page.locator('#book .slot:not(.disabled)').first();
  await slot.waitFor({ state: 'visible', timeout: 15_000 });
  await slot.click();
  await page.locator('#book').getByRole('button', { name: /Continue/i }).click();

  // Step 3: details
  await page.getByLabel(/Full name/i).fill('Playwright Test');
  await page.getByLabel(/Mobile number/i).fill('0773699620');
  await page.locator('#book').getByRole('button', { name: /Confirm booking/i }).click();

  // Confirmation
  await expect(page.getByText(/You.?re booked in/i)).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText(/VS-/)).toBeVisible();
});

// Clean up the real booking rows this spec creates. We build a service-role
// client inline rather than importing `lib/supabase/admin` because that module
// imports `server-only`, which Playwright's bundler refuses to load.
test.afterAll(async () => {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
  await admin.from('bookings').delete().eq('customer_name', 'Playwright Test');
});
