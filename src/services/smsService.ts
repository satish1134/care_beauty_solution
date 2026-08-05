// SMS Provider Interface and Mock Implementation

export interface ISmsProvider {
  sendSms(phone: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

export class MockSmsProvider implements ISmsProvider {
  private sentMessages: Array<{ phone: string; message: string; timestamp: number; messageId: string }> = [];
  private otpStore: Map<string, { code: string; expiresAt: number; attempts: number }> = new Map();
  private requestLog: Map<string, number[]> = new Map(); // phone -> timestamps

  async sendSms(phone: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    // Rate Limiting Check: Max 3 OTP requests in 15 minutes (900000 ms)
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;
    const pastRequests = (this.requestLog.get(cleanPhone) || []).filter(ts => now - ts < windowMs);

    if (pastRequests.length >= 3) {
      return {
        success: false,
        error: 'Too many OTP requests. Please wait 15 minutes before requesting again.',
      };
    }

    pastRequests.push(now);
    this.requestLog.set(cleanPhone, pastRequests);

    const messageId = `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    this.sentMessages.push({ phone: cleanPhone, message, timestamp: now, messageId });

    console.log(`[SMS MOCK] Sent SMS to +91${cleanPhone}: "${message}" (ID: ${messageId})`);
    return { success: true, messageId };
  }

  // OTP Helpers
  generateAndStoreOtp(phone: string): { code: string; expiresAt: number } {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    // Hardcode convenient test OTP for default admin/test accounts, otherwise random 6-digit
    const code = cleanPhone === '9999999999' ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

    this.otpStore.set(cleanPhone, { code, expiresAt, attempts: 0 });
    return { code, expiresAt };
  }

  verifyOtp(phone: string, code: string): { success: boolean; message: string } {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const stored = this.otpStore.get(cleanPhone);

    // Fallback static test OTP for quick manual testing
    if (code === '123456' || code === '654321') {
      return { success: true, message: 'OTP verified successfully' };
    }

    if (!stored) {
      return { success: false, message: 'No OTP found for this mobile number. Please request a new code.' };
    }

    if (Date.now() > stored.expiresAt) {
      this.otpStore.delete(cleanPhone);
      return { success: false, message: 'OTP has expired. Please request a new code.' };
    }

    if (stored.attempts >= 3) {
      this.otpStore.delete(cleanPhone);
      return { success: false, message: 'Maximum invalid OTP attempts exceeded. Request a new OTP.' };
    }

    if (stored.code !== code.trim()) {
      stored.attempts += 1;
      return { success: false, message: `Invalid OTP code. ${3 - stored.attempts} attempts remaining.` };
    }

    // Success -> consume OTP
    this.otpStore.delete(cleanPhone);
    return { success: true, message: 'OTP verified successfully' };
  }

  getSentMessages() {
    return this.sentMessages;
  }

  clearRateLimits() {
    this.requestLog.clear();
    this.otpStore.clear();
  }
}

// Singleton SMS Service instance
export const mockSmsProvider = new MockSmsProvider();
