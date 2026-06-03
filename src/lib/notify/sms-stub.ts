import type { Notifier, BookingConfirmation } from './types';

// Placeholder until a real SMS provider (Notify.lk / Twilio) is wired.
export class SmsStubNotifier implements Notifier {
  async sendBookingConfirmation(c: BookingConfirmation): Promise<void> {
    console.info(`[sms-stub] would text ${c.customerPhone}: booking ${c.reference} confirmed`);
  }
}
