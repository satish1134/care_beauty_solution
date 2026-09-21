'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  X,
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  Lock,
  Sparkles
} from 'lucide-react';
import { useCart, Address } from '@/lib/cart-context';

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    closeCheckout,
    items,
    subtotal,
    discount,
    shippingFee,
    total,
    user,
    placeOrder,
    openProfile
  } = useCart();

  const [step, setStep] = useState<'address' | 'payment' | 'success'>('address');
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  // Form State
  const defaultAddr = user?.addresses[0];
  const [formData, setFormData] = useState<Address>({
    id: defaultAddr?.id || 'addr-current',
    fullName: defaultAddr?.fullName || user?.name || '',
    phone: defaultAddr?.phone || user?.phone || '',
    street: defaultAddr?.street || '',
    city: defaultAddr?.city || 'Gurugram',
    state: defaultAddr?.state || 'Haryana',
    pincode: defaultAddr?.pincode || '122001'
  });

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD'>('UPI');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8920');
  const [isProcessing, setIsProcessing] = useState(false);
  const [addressError, setAddressError] = useState('');

  if (!isCheckoutOpen) return null;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError('');
    if (!formData.fullName || !formData.phone || !formData.street || !formData.pincode) {
      setAddressError('Please fill out all mandatory address fields before continuing.');
      return;
    }
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const order = placeOrder({
        paymentMethod,
        address: formData
      });
      setConfirmedOrder(order);
      setIsProcessing(false);
      setStep('success');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl bg-[#FBF9F5] text-[#1C1917] rounded-3xl border border-[#E8E2D5] shadow-2xl overflow-hidden flex flex-col my-auto"
      >
        {/* Header */}
        <div className="bg-[#03290A] text-[#EDE6D8] px-6 py-4 flex items-center justify-between border-b border-[#083e13]">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-40">
              <Image
                src="/images/header.png"
                alt="CARE-A"
                fill
                className="object-contain object-left"
              />
            </div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#E5B85C] border-l border-[#0a3f18] pl-3">
              Secure Checkout
            </span>
          </div>

          <button
            onClick={closeCheckout}
            className="p-1.5 rounded-full text-[#C5BCAB] hover:text-white hover:bg-[#084717] transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* STEP 1: Delivery Address */}
        {step === 'address' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-[#785412] uppercase font-bold tracking-wider">
                  Step 1 of 2
                </span>
                <h3 className="font-editorial text-2xl font-bold text-[#1C1917]">
                  Delivery Address
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#064E3B] font-semibold bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#A7F3D0]">
                <Truck size={14} />
                <span>Express Dispatch (3-4 Days)</span>
              </div>
            </div>

            {addressError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {addressError}
              </div>
            )}

            <form onSubmit={handleAddressSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#57534E] block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Sandy Verma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CCB8] bg-white focus:outline-none focus:border-[#1C1917]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#57534E] block mb-1">Mobile Number (WhatsApp Updates)</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CCB8] bg-white focus:outline-none focus:border-[#1C1917]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#57534E] block mb-1">Flat / House No. / Street Address</label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  placeholder="e.g. 402, Lotus Greens Boulevard, Sector 12"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CCB8] bg-white focus:outline-none focus:border-[#1C1917]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#57534E] block mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="122001"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CCB8] bg-white focus:outline-none focus:border-[#1C1917] font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#57534E] block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CCB8] bg-white focus:outline-none focus:border-[#1C1917]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#57534E] block mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CCB8] bg-white focus:outline-none focus:border-[#1C1917]"
                  />
                </div>
              </div>

              {/* Order quick summary box */}
              <div className="p-4 rounded-2xl bg-[#F5EFE6] border border-[#E5DEC9] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#785412] font-mono font-semibold">Total Payable</span>
                  <div className="font-bold text-base text-[#1C1917]">₹{total}</div>
                </div>
                <span className="text-xs text-[#57534E]">({items.reduce((s, i) => s + i.quantity, 0)} items in bag)</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#1C1917] hover:bg-[#064E3B] text-white font-bold text-xs uppercase tracking-[0.18em] transition shadow-md flex items-center justify-center gap-2"
              >
                <span>Continue to Payment</span>
                <ArrowRight size={14} />
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: Payment Method */}
        {step === 'payment' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep('address')}
                className="flex items-center gap-1 text-xs text-[#78716C] hover:text-[#1C1917] transition"
              >
                <ChevronLeft size={16} />
                <span>Back to Address</span>
              </button>
              <span className="text-[11px] font-mono text-[#785412] uppercase font-bold tracking-wider">
                Step 2 of 2
              </span>
            </div>

            <h3 className="font-editorial text-2xl font-bold text-[#1C1917]">
              Choose Payment Method
            </h3>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              {/* 1. UPI */}
              <label
                onClick={() => setPaymentMethod('UPI')}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                  paymentMethod === 'UPI'
                    ? 'border-[#064E3B] bg-[#F4F9F5] ring-2 ring-[#064E3B]/20'
                    : 'border-[#E8E2D5] bg-white hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-[#064E3B]">
                    <QrCode size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1C1917]">Instant UPI (Fastest)</h4>
                    <p className="text-[11px] text-[#78716C]">Google Pay, PhonePe, Paytm, BHIM</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'UPI'}
                  onChange={() => setPaymentMethod('UPI')}
                  className="accent-[#064E3B] w-4 h-4"
                />
              </label>

              {paymentMethod === 'UPI' && (
                <div className="p-4 bg-white rounded-2xl border border-[#A7F3D0] space-y-2 text-xs">
                  <label className="font-bold text-[#57534E] block">UPI ID / VPA</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@okhdfcbank"
                    className="w-full px-3 py-2 rounded-xl border border-[#D5CCB8] bg-[#FAF7F2] font-mono text-xs focus:outline-none"
                  />
                  <p className="text-[10px] text-[#78716C]">
                    You will receive an instant payment request on your UPI app.
                  </p>
                </div>
              )}

              {/* 2. Cards */}
              <label
                onClick={() => setPaymentMethod('Card')}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                  paymentMethod === 'Card'
                    ? 'border-[#064E3B] bg-[#F4F9F5] ring-2 ring-[#064E3B]/20'
                    : 'border-[#E8E2D5] bg-white hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-[#1D4ED8]">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1C1917]">Credit / Debit Cards</h4>
                    <p className="text-[11px] text-[#78716C]">Visa, Mastercard, RuPay, Amex</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Card'}
                  onChange={() => setPaymentMethod('Card')}
                  className="accent-[#064E3B] w-4 h-4"
                />
              </label>

              {paymentMethod === 'Card' && (
                <div className="p-4 bg-white rounded-2xl border border-[#BFDBFE] space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-[#57534E] block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#D5CCB8] bg-[#FAF7F2] font-mono text-xs focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM / YY"
                      defaultValue="08/28"
                      className="px-3 py-2 rounded-xl border border-[#D5CCB8] bg-[#FAF7F2] font-mono text-xs focus:outline-none"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      defaultValue="•••"
                      className="px-3 py-2 rounded-xl border border-[#D5CCB8] bg-[#FAF7F2] font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* 3. Cash on Delivery */}
              <label
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                  paymentMethod === 'COD'
                    ? 'border-[#064E3B] bg-[#F4F9F5] ring-2 ring-[#064E3B]/20'
                    : 'border-[#E8E2D5] bg-white hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center text-[#B45309]">
                    <Banknote size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1C1917]">Cash on Delivery (COD)</h4>
                    <p className="text-[11px] text-[#78716C]">Pay cash or UPI at doorstep</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="accent-[#064E3B] w-4 h-4"
                />
              </label>
            </div>

            {/* Price Review */}
            <div className="p-4 rounded-2xl bg-[#F5EFE6] border border-[#E5DEC9] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#57534E]">
                <span>Items Subtotal</span>
                <span className="font-mono">₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#064E3B] font-semibold">
                  <span>Discount Applied</span>
                  <span className="font-mono">-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-[#57534E]">
                <span>Express Shipping</span>
                <span className="font-mono font-semibold text-[#064E3B]">
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#1C1917] pt-2 border-t border-[#E8E2D5]">
                <span>Total Amount</span>
                <span className="font-mono">₹{total}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full py-4 rounded-full bg-[#064E3B] hover:bg-[#08634B] text-white font-bold text-xs uppercase tracking-[0.18em] transition shadow-lg flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <Lock size={14} />
                  <span>Pay ₹{total} & Confirm Order</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 3: Order Success Confirmation */}
        {step === 'success' && confirmedOrder && (
          <div className="p-8 text-center space-y-6">
            <div className="w-18 h-18 mx-auto rounded-full bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#064E3B]">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <span className="text-[11px] font-mono text-[#064E3B] uppercase font-bold tracking-widest bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#A7F3D0]">
                Order Confirmed
              </span>
              <h3 className="font-editorial text-3xl font-bold text-[#1C1917] mt-3">
                Thank You, {confirmedOrder.deliveryAddress.fullName}!
              </h3>
              <p className="text-xs text-[#78716C] mt-2">
                Order ID: <strong className="font-mono text-[#1C1917]">{confirmedOrder.id}</strong>
              </p>
            </div>

            {/* Tracking summary card */}
            <div className="p-5 rounded-2xl bg-[#F5EFE6] border border-[#E5DEC9] text-left space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-2">
                <span className="font-bold text-[#1C1917]">Estimated Delivery</span>
                <span className="font-mono text-[#064E3B] font-bold">In 3 Business Days</span>
              </div>
              <div>
                <span className="text-[11px] text-[#78716C]">Shipping To:</span>
                <p className="font-semibold text-[#1C1917] mt-0.5">
                  {confirmedOrder.deliveryAddress.street}, {confirmedOrder.deliveryAddress.city},{' '}
                  {confirmedOrder.deliveryAddress.state} - {confirmedOrder.deliveryAddress.pincode}
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#E8E2D5]">
                <span>Payment Mode: <strong>{confirmedOrder.paymentMethod}</strong></span>
                <span className="font-mono font-bold text-sm text-[#1C1917]">
                  Total Paid: ₹{confirmedOrder.total}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  closeCheckout();
                  openProfile();
                }}
                className="flex-1 py-3 rounded-full bg-[#1C1917] hover:bg-[#064E3B] text-white font-bold text-xs uppercase tracking-wider transition shadow-sm"
              >
                View in My Orders
              </button>
              <button
                onClick={closeCheckout}
                className="flex-1 py-3 rounded-full border border-[#D5CCB8] bg-white hover:bg-[#F5EFE6] text-[#1C1917] font-bold text-xs uppercase tracking-wider transition"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
