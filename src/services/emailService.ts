// Transactional Email Service Abstraction Layer for Care Beauty Solution
import { Order } from '../types';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  metadata?: Record<string, any>;
}

export interface IEmailProvider {
  sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId: string; error?: string }>;
}

export class MockEmailProvider implements IEmailProvider {
  private sentEmails: Array<{
    id: string;
    to: string;
    subject: string;
    html: string;
    sentAt: string;
    metadata?: Record<string, any>;
  }> = [];

  async sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId: string; error?: string }> {
    const id = `email_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const record = {
      id,
      to: options.to,
      subject: options.subject,
      html: options.html,
      sentAt: new Date().toISOString(),
      metadata: options.metadata,
    };

    this.sentEmails.push(record);
    console.log(`[EMAIL SERVICE] Sent email to ${options.to} | Subject: "${options.subject}" (ID: ${id})`);
    return { success: true, messageId: id };
  }

  async sendOrderConfirmationEmail(order: Order): Promise<{ success: boolean; messageId: string }> {
    const recipient = order.customerEmail || 'customer@carebeautysolution.com';
    const subject = `Order Confirmation #${order.orderNumber} — Care Beauty Solution`;

    const itemsHtml = order.items
      .map(
        i => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px 8px;"><img src="${i.productImage}" alt="${i.productName}" style="width: 48px; height: 48px; border-radius: 8px; object-fit: cover;"/></td>
          <td style="padding: 12px 8px; font-weight: bold; color: #0f172a;">${i.productName}<br/><span style="font-weight: normal; font-size: 11px; color: #64748b;">${i.variantName}</span></td>
          <td style="padding: 12px 8px; text-align: center;">${i.quantity}</td>
          <td style="padding: 12px 8px; text-align: right; font-weight: bold; color: #022c22;">₹${(i.price * i.quantity).toFixed(2)}</td>
        </tr>
      `
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #334155;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
          <div style="background-color: #022c22; padding: 24px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-family: Georgia, serif; font-size: 24px; color: #fde68a;">Care Beauty Solution</h1>
            <p style="margin: 4px 0 0; font-size: 12px; color: #a7f3d0;">Clinical Skincare Formulations for Indian Skin</p>
          </div>
          
          <div style="padding: 24px;">
            <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Thank you for your order, ${order.customerName}!</h2>
            <p style="font-size: 14px; line-height: 1.5;">We have received your order <strong style="color: #064e3b;">#${order.orderNumber}</strong> and it is now being prepared at our clinical facility.</p>
            
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin: 20px 0;">
              <table style="width: 100%; font-size: 13px;">
                <tr>
                  <td><strong>Payment Status:</strong> ${order.paymentStatus} (${order.paymentMethod})</td>
                  <td style="text-align: right;"><strong>Order Total:</strong> ₹${order.totalAmount.toFixed(2)}</td>
                </tr>
              </table>
            </div>

            <h3 style="font-size: 16px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
              <thead>
                <tr style="background-color: #f1f5f9; text-align: left; font-size: 11px; text-transform: uppercase; color: #64748b;">
                  <th style="padding: 8px;">Item</th>
                  <th style="padding: 8px;">Product</th>
                  <th style="padding: 8px; text-align: center;">Qty</th>
                  <th style="padding: 8px; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="background-color: #f8fafc; padding: 16px; border-radius: 12px; font-size: 13px; line-height: 1.6;">
              <strong style="color: #0f172a;">Shipping Address:</strong><br/>
              ${order.shippingAddress.fullName}<br/>
              ${order.shippingAddress.addressLine1}${order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}<br/>
              ${order.shippingAddress.landmark ? `Landmark: ${order.shippingAddress.landmark}<br/>` : ''}
              ${order.shippingAddress.city}, ${order.shippingAddress.state} — ${order.shippingAddress.pincode}<br/>
              Phone: ${order.shippingAddress.phone}
            </div>
          </div>

          <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 11px; color: #64748b;">
            &copy; 2026 Care Beauty Solution. Fragrance-Free • Non-Comedogenic • Dermatologically Tested.
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: recipient,
      subject,
      html,
      metadata: { orderId: order.id, orderNumber: order.orderNumber },
    });
  }

  getSentEmails() {
    return this.sentEmails;
  }

  getEmailsByRecipient(email: string) {
    const clean = email.trim().toLowerCase();
    return this.sentEmails.filter(e => e.to.toLowerCase() === clean);
  }

  clearEmails() {
    this.sentEmails = [];
  }
}

export const emailService = new MockEmailProvider();
