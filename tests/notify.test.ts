import { it, expect } from 'vitest';
import { confirmationHtml } from '@/lib/notify/templates';

it('renders confirmation html with reference, price and first name', () => {
  const html = confirmationHtml({
    reference: 'VS-AB123', customerName: 'Nimal Perera', customerPhone: '0773699620',
    serviceName: 'Gents Cut & Style', stylistName: 'Ruwan', whenLabel: 'Tue 2 Jun, 10:00 AM',
    priceLkr: 900, durationMin: 40,
  });
  expect(html).toContain('VS-AB123');
  expect(html).toContain('LKR 900');
  expect(html).toContain('Nimal'); // first name only
  expect(html).not.toContain('Perera');
});
