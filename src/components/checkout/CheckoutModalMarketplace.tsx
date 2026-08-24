import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  CheckCircle,
  MapPin,
  CreditCard,
  QrCode,
  Truck,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
} from 'lucide-react';

export const CheckoutModalMarketplace: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    cart,
    cartFinalTotal,
    cartSubtotal,
    cartShippingFee,
    cartTotalDiscount,
    placeOrder,
    setAccountActiveTab,
    setIsAccountModalOpen,
    goHome,
    selectedCity,
    selectedPincode,
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [createdOrderId, setCreatedOrderId] = useState<string>('');

  // Step 1: Address Form State
  const [fullName, setFullName] = useState('Priya Sharma');
  const [phone, setPhone] = useState('9876543210');
  const [addressLine1, setAddressLine1] = useState('Flat 402, Green Glen Layout, Bellandur');
  const [city, setCity] = useState(selectedCity || 'Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState(selectedPincode || '560038');

  // Step 2: Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('priyasharma@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('789');

  if (!isCheckoutModalOpen) return null;

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleConfirmAndPay = () => {
    const newOrder = placeOrder({
      fullName,
      phone,
      addressLine1,
      city,
      state,
      pincode,
      paymentMethod,
    });
    setCreatedOrderId(newOrder.id);
    setStep(3);
  };

  const handleTrackOrder = () => {
    setIsCheckoutModalOpen(false);
    setAccountActiveTab('orders');
    setIsAccountModalOpen(true);
  };

  return (
    <div
      id="checkout-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={() => step !== 3 && setIsCheckoutModalOpen(false)}
    >
      <div
        id="checkout-modal-panel"
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E5E5E5] flex items-center justify-between bg-[#FAF9F6]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#2D5A3D]" />
            <h2 className="text-base font-bold text-[#1A1A1A]">
              Care Beauty Solution • 100% Encrypted Checkout
            </h2>
          </div>
          {step !== 3 && (
            <button
              onClick={() => setIsCheckoutModalOpen(false)}
              className="p-1.5 rounded-full hover:bg-neutral-200 text-neutral-500 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Indicator */}
        {step !== 3 && (
          <div className="px-6 pt-4 flex items-center justify-center gap-3 text-xs font-bold">
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
                step === 1 ? 'bg-[#E85D5D] text-white' : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              1. Delivery Address
            </span>
            <span className="text-neutral-300">→</span>
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
                step === 2 ? 'bg-[#E85D5D] text-white' : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              2. Payment &amp; Review
            </span>
          </div>
        )}

        <div className="p-6">
          {/* STEP 1: Address */}
          {step === 1 && (
            <form onSubmit={handleNextToPayment} className="space-y-4">
              <h3 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E85D5D]" />
                <span>Shipping Address Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E5E5E5] text-xs p-2.5 rounded-lg focus:outline-none focus:border-[#E85D5D]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">Mobile Number (For Delivery SMS) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E5E5E5] text-xs p-2.5 rounded-lg focus:outline-none focus:border-[#E85D5D]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">Flat, House No., Building, Apartment *</label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E5E5E5] text-xs p-2.5 rounded-lg focus:outline-none focus:border-[#E85D5D]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E5E5E5] text-xs p-2.5 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E5E5E5] text-xs p-2.5 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E5E5E5] text-xs p-2.5 rounded-lg"
                  />
                </div>
              </div>

              {/* Order quick summary */}
              <div className="bg-[#FAF9F6] border border-[#E5E5E5] p-3 rounded-lg flex items-center justify-between text-xs">
                <span className="text-[#6B6B6B]">Total Payable ({cart.length} items):</span>
                <span className="text-base font-bold text-[#E85D5D]">₹{cartFinalTotal}</span>
              </div>

              <button
                type="submit"
                className="btn-primary-coral w-full py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2"
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: Payment */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#1A1A1A]">Select Payment Mode</h3>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-[#6B6B6B] hover:text-[#1A1A1A] flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Address
                </button>
              </div>

              {/* Payment Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* UPI */}
                <label
                  onClick={() => setPaymentMethod('upi')}
                  className={`border rounded-xl p-4 cursor-pointer flex flex-col justify-between transition ${
                    paymentMethod === 'upi'
                      ? 'border-[#E85D5D] bg-red-50/50 ring-2 ring-red-100'
                      : 'border-[#E5E5E5] hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-[#E85D5D]" /> UPI Instant (GPay / PhonePe / Paytm)
                    </span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="text-[#E85D5D]"
                    />
                  </div>
                  <p className="text-[11px] text-[#6B6B6B]">Zero transaction fees • Instant verification</p>
                </label>

                {/* Credit / Debit Card */}
                <label
                  onClick={() => setPaymentMethod('card')}
                  className={`border rounded-xl p-4 cursor-pointer flex flex-col justify-between transition ${
                    paymentMethod === 'card'
                      ? 'border-[#E85D5D] bg-red-50/50 ring-2 ring-red-100'
                      : 'border-[#E5E5E5] hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-[#2D5A3D]" /> Debit / Credit Card
                    </span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="text-[#E85D5D]"
                    />
                  </div>
                  <p className="text-[11px] text-[#6B6B6B]">Visa, Mastercard, RuPay &amp; Amex</p>
                </label>

                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`border rounded-xl p-4 cursor-pointer flex flex-col justify-between transition ${
                    paymentMethod === 'cod'
                      ? 'border-[#E85D5D] bg-red-50/50 ring-2 ring-red-100'
                      : 'border-[#E5E5E5] hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#1A1A1A]" /> Cash on Delivery (COD)
                    </span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-[#E85D5D]"
                    />
                  </div>
                  <p className="text-[11px] text-[#6B6B6B]">Pay cash or UPI at your doorstep</p>
                </label>

                {/* NetBanking */}
                <label
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`border rounded-xl p-4 cursor-pointer flex flex-col justify-between transition ${
                    paymentMethod === 'netbanking'
                      ? 'border-[#E85D5D] bg-red-50/50 ring-2 ring-red-100'
                      : 'border-[#E5E5E5] hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#6B6B6B]" /> Net Banking
                    </span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'netbanking'}
                      onChange={() => setPaymentMethod('netbanking')}
                      className="text-[#E85D5D]"
                    />
                  </div>
                  <p className="text-[11px] text-[#6B6B6B]">All major Indian banks supported</p>
                </label>
              </div>

              {/* Dynamic Input depending on Payment Option */}
              {paymentMethod === 'upi' && (
                <div className="bg-[#FAF9F6] border border-[#E5E5E5] p-4 rounded-xl space-y-2">
                  <label className="text-xs font-bold text-[#1A1A1A] block">Virtual Payment Address (VPA / UPI ID)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-white border border-[#E5E5E5] text-xs p-2.5 rounded-lg font-medium"
                  />
                  <p className="text-[11px] text-[#2D5A3D]">✓ Instant payment request will be sent to your UPI App</p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="bg-[#FAF9F6] border border-[#E5E5E5] p-4 rounded-xl space-y-3">
                  <div>
                    <label className="text-xs font-bold text-[#1A1A1A] block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-white border border-[#E5E5E5] text-xs p-2.5 rounded-lg font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#1A1A1A] block mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-white border border-[#E5E5E5] text-xs p-2.5 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#1A1A1A] block mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-white border border-[#E5E5E5] text-xs p-2.5 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Price Breakdown Final */}
              <div className="bg-[#FAF9F6] border border-[#E5E5E5] p-4 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between text-[#6B6B6B]">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-semibold text-[#1A1A1A]">₹{cartSubtotal}</span>
                </div>
                {cartTotalDiscount > 0 && (
                  <div className="flex justify-between text-[#2D5A3D]">
                    <span>Discount</span>
                    <span>-₹{cartTotalDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#6B6B6B]">
                  <span>Delivery Charges</span>
                  <span className="text-[#2D5A3D] font-bold">{cartShippingFee === 0 ? 'FREE' : `₹${cartShippingFee}`}</span>
                </div>
                <div className="border-t border-[#E5E5E5] pt-2 flex justify-between text-base font-bold text-[#1A1A1A]">
                  <span>Amount to Pay</span>
                  <span className="text-[#E85D5D]">₹{cartFinalTotal}</span>
                </div>
              </div>

              <button
                id="confirm-pay-order-btn"
                onClick={handleConfirmAndPay}
                className="btn-primary-coral w-full py-3.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Pay ₹{cartFinalTotal} &amp; Place Order</span>
              </button>
            </div>
          )}

          {/* STEP 3: Order Placed Success */}
          {step === 3 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#EBF4EE] text-[#2D5A3D] flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#1A1A1A]">Order Confirmed! 🎉</h3>
                <p className="text-xs text-[#6B6B6B]">
                  Thank you, <strong>{fullName}</strong>. Your clinical skincare package is being prepared with sterile lab seal.
                </p>
              </div>

              <div className="bg-[#FAF9F6] border border-[#E5E5E5] rounded-xl p-4 text-left space-y-2 text-xs max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-[#6B6B6B]">Order ID:</span>
                  <span className="font-mono font-bold text-[#1A1A1A]">{createdOrderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6B6B]">Estimated Delivery:</span>
                  <span className="font-bold text-[#2D5A3D]">Tomorrow by 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6B6B]">Delivery Address:</span>
                  <span className="text-[#1A1A1A] text-right font-medium max-w-[200px] truncate">
                    {addressLine1}, {city}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#E5E5E5] pt-2 font-bold">
                  <span>Paid Amount:</span>
                  <span className="text-[#E85D5D]">₹{cartFinalTotal}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={handleTrackOrder}
                  className="btn-primary-coral text-xs px-6 py-3 font-bold flex items-center justify-center gap-1.5"
                >
                  <Truck className="w-4 h-4" />
                  <span>Track in My Orders</span>
                </button>
                <button
                  onClick={() => {
                    setIsCheckoutModalOpen(false);
                    goHome();
                  }}
                  className="bg-white border border-[#E5E5E5] text-[#1A1A1A] hover:bg-neutral-50 text-xs px-6 py-3 rounded-lg font-bold"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
