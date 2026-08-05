// End-to-End Integration Test for Phase 3 — Cart, Checkout & Razorpay Payments
import { cartService } from './cartService';
import { paymentService } from './paymentService';
import { emailService } from './emailService';
import { authService } from './authService';

export async function runPhase3CheckoutTests(): Promise<{
  success: boolean;
  logs: string[];
  summary: Record<string, any>;
}> {
  const logs: string[] = [];
  const log = (msg: string) => {
    logs.push(`[PHASE 3 TEST] ${msg}`);
    console.log(`[PHASE 3 TEST] ${msg}`);
  };

  try {
    log('Starting Phase 3 End-to-End Checkout Test Execution...');

    // 1. Setup Test User Session & Guest Session
    const guestSessionId = `guest_test_session_${Date.now()}`;
    const testUserId = `usr_test_phase3_${Date.now()}`;
    const userPhone = '9876543210';
    const userEmail = 'ananya.sharma@example.com';
    const userToken = authService.generateAccessToken(testUserId, 'CUSTOMER', userEmail, userPhone);

    log(`Step 1: Created Guest Session ID (${guestSessionId}) and Auth Token for user ${userEmail}`);

    // 2. Add product to Guest Cart
    const testItem = {
      id: 'ci-test-1',
      productId: 'prod-hydrating-moisturizer',
      variantId: 'var-hm-50g',
      productName: 'Hydrating Moisturizer',
      variantName: '50g Jar',
      productImage: 'https://images.unsplash.com/photo-1608248597261-e4d354714552',
      price: 599,
      quantity: 2,
      stock: 50,
    };

    const guestCart = cartService.addItem(testItem, guestSessionId);
    if (guestCart.items.length !== 1 || guestCart.items[0].quantity !== 2) {
      throw new Error('Failed to add item to guest cart');
    }
    log(`Step 2: Successfully added product (${testItem.productName} x2) to guest cart. Item count: ${guestCart.items.length}`);

    // 3. Login User & Merge Guest Cart into DB User Cart
    const userCart = cartService.mergeCart(guestSessionId, testUserId);
    if (userCart.items.length !== 1 || userCart.items[0].variantId !== 'var-hm-50g') {
      throw new Error('Cart merge failed — guest items were not transferred to user cart');
    }
    log(`Step 3: Merged guest cart into authenticated user cart. Total items in user cart: ${userCart.items.length}`);

    // 4. Apply Coupon Code (GLOW200)
    const discountAmount = 200; // ₹200 off for GLOW200
    cartService.applyCoupon('GLOW200', discountAmount, undefined, testUserId);
    log(`Step 4: Applied promo coupon 'GLOW200' to user cart. Discount: ₹${discountAmount}`);

    // 5. Calculate Order Totals
    const subtotal = userCart.items.reduce((acc, i) => acc + i.price * i.quantity, 0); // 599 * 2 = 1198
    const effectiveSubtotal = subtotal - discountAmount; // 1198 - 200 = 998
    const taxAmount = Math.round(effectiveSubtotal * 0.18 * 100) / 100; // 998 * 0.18 = 179.64
    const shippingFee = effectiveSubtotal >= 499 ? 0 : 50; // Free shipping for >= 499
    const totalAmount = Math.round((effectiveSubtotal + taxAmount + shippingFee) * 100) / 100; // 1177.64

    log(`Step 5: Order Breakdown Calculated — Subtotal: ₹${subtotal}, Discount: -₹${discountAmount}, GST (18%): ₹${taxAmount}, Shipping: ₹${shippingFee}, Payable Total: ₹${totalAmount}`);

    // 6. Create Razorpay Payment Order
    const rzpOrder = paymentService.createRazorpayOrder(totalAmount, `receipt_test_${Date.now()}`);
    if (!rzpOrder.id || !rzpOrder.id.startsWith('order_rzp_')) {
      throw new Error('Razorpay order creation failed');
    }
    log(`Step 6: Created Razorpay Order ID: ${rzpOrder.id} (Amount in paise: ${rzpOrder.amount})`);

    // 7. Verify Razorpay Payment Signature (HMAC SHA256)
    const mockPaymentId = `pay_rzp_test_${Date.now()}`;
    const testSignature = paymentService.computeTestSignature(rzpOrder.id, mockPaymentId);
    const verification = paymentService.verifyPaymentSignature(rzpOrder.id, mockPaymentId, testSignature);

    if (!verification.verified) {
      throw new Error(`Razorpay payment signature verification failed: ${verification.message}`);
    }
    log(`Step 7: Razorpay HMAC SHA256 payment signature verified successfully! Signature: ${testSignature.slice(0, 16)}...`);

    // 8. Trigger Webhook Event Simulation
    const rawWebhookPayload = JSON.stringify({
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: mockPaymentId,
            order_id: rzpOrder.id,
            amount: rzpOrder.amount,
            status: 'captured',
          },
        },
      },
    });
    const webhookSig = paymentService.computeWebhookSignature(rawWebhookPayload);
    const webhookCheck = paymentService.verifyWebhookSignature(rawWebhookPayload, webhookSig);

    if (!webhookCheck.verified) {
      throw new Error('Razorpay webhook signature verification failed');
    }
    log(`Step 8: Verified Razorpay Webhook Signature! Event: payment.captured`);

    // 9. Dispatch Transactional Order Confirmation Email via Email Service
    const mockOrderRecord: any = {
      id: `ord-${Date.now()}`,
      orderNumber: `CBS-2026-TEST99`,
      userId: testUserId,
      customerName: 'Ananya Sharma',
      customerPhone: userPhone,
      customerEmail: userEmail,
      shippingAddress: {
        fullName: 'Ananya Sharma',
        phone: userPhone,
        addressLine1: 'Flat 402, Sunshine Heights',
        addressLine2: '100 Feet Road, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
      },
      items: userCart.items,
      subtotal,
      discountAmount,
      taxAmount,
      shippingFee,
      totalAmount,
      paymentMethod: 'RAZORPAY',
      paymentStatus: 'PAID',
      status: 'CONFIRMED',
      razorpayOrderId: rzpOrder.id,
      razorpayPaymentId: mockPaymentId,
      createdAt: new Date().toISOString(),
    };

    const emailRes = await emailService.sendOrderConfirmationEmail(mockOrderRecord);
    if (!emailRes.success) {
      throw new Error('Failed to dispatch transactional order confirmation email');
    }
    log(`Step 9: Order Confirmation Email sent successfully via Email Abstraction Layer! Message ID: ${emailRes.messageId}`);

    // 10. Assert Sent Email in Audit Log
    const userEmails = emailService.getEmailsByRecipient(userEmail);
    if (userEmails.length === 0) {
      throw new Error('Sent confirmation email was not recorded in email service audit logs');
    }
    log(`Step 10: Verified email dispatch in email audit log. Recipient: ${userEmails[0].to}, Subject: "${userEmails[0].subject}"`);

    // 11. Clear Cart After Checkout
    cartService.clearCart(undefined, testUserId);
    const clearedCart = cartService.getCart(undefined, testUserId);
    if (clearedCart.items.length !== 0) {
      throw new Error('Cart was not cleared after order completion');
    }
    log(`Step 11: User cart cleared after successful checkout completion.`);

    log('✅ PHASE 3 CHECKOUT & PAYMENTS E2E INTEGRATION TEST PASSED SUCCESSFULLY!');

    return {
      success: true,
      logs,
      summary: {
        orderNumber: mockOrderRecord.orderNumber,
        razorpayOrderId: rzpOrder.id,
        paymentStatus: mockOrderRecord.paymentStatus,
        totalPaid: mockOrderRecord.totalAmount,
        emailMessageId: emailRes.messageId,
      },
    };
  } catch (err: any) {
    log(`❌ Phase 3 Test Failed: ${err.message}`);
    return {
      success: false,
      logs,
      summary: { error: err.message },
    };
  }
}
