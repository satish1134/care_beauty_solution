import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, CreditCard, Banknote, Sparkles, MapPin, Truck } from 'lucide-react';
import { CartItem, Address, PaymentMethod, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  discountAmount: number;
  appliedCoupon: string | null;
  onClearCart: () => void;
  onOrderPlaced: (order: Order) => void;
  userPhone: string | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  discountAmount,
  appliedCoupon,
  onClearCart,
  onOrderPlaced,
  userPhone,
}) => {
  if (!isOpen) return null;

  // Address Form State
  const [fullName, setFullName] = useState('Ananya Sharma');
  const [phone, setPhone] = useState(userPhone || '9876543210');
  const [email, setEmail] = useState('ananya.sharma@example.com');
  const [addressLine1, setAddressLine1] = useState('Flat 402, Sunshine Heights');
  const [addressLine2, setAddressLine2] = useState('100 Feet Road, Indiranagar');
  const [landmark, setLandmark] = useState('Near Metro Pillar 84');
  const [pincode, setPincode] = useState('560038');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('RAZORPAY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const effectiveSubtotal = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(effectiveSubtotal * 0.18 * 100) / 100;
  const shippingFee = effectiveSubtotal >= 499 ? 0 : 50;
  const totalAmount = Math.round((effectiveSubtotal + taxAmount + shippingFee) * 100) / 100;

  // Auto Lookup Pincode Helper
  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPincode(val);
    if (val === '560038' || val === '560001') {
      setCity('Bengaluru');
      setState('Karnataka');
    } else if (val === '110001') {
      setCity('New Delhi');
      setState('Delhi');
    } else if (val === '400001') {
      setCity('Mumbai');
      setState('Maharashtra');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const shippingAddress: Address = {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      pincode,
    };

    let razorpayOrderId = '';
    let razorpayPaymentId = '';

    try {
      if (paymentMethod === 'RAZORPAY') {
        // Step 1: Call Razorpay API endpoint to create order
        const rzpRes = await fetch('/api/payments/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: totalAmount }),
        });
        const rzpData = await rzpRes.json();
        if (rzpData.success) {
          razorpayOrderId = rzpData.data.id;
          razorpayPaymentId = `pay_rzp_${Date.now()}`;

          // Step 2: Signature verification test call
          await fetch('/api/payments/razorpay/verify-signature', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: razorpayOrderId,
              razorpay_payment_id: razorpayPaymentId,
              razorpay_signature: 'sig_mock_signature_verified',
            }),
          });
        }
      }

      // Step 3: Create Order on Backend API
      const orderPayload = {
        customerName: fullName,
        customerPhone: phone,
        customerEmail: email,
        shippingAddress,
        items: items.map(i => ({
          id: `oi-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          productId: i.productId,
          variantId: i.variantId,
          productName: i.productName,
          variantName: i.variantName,
          productImage: i.productImage,
          price: i.price,
          quantity: i.quantity,
          subtotal: i.price * i.quantity,
        })),
        subtotal,
        discountAmount,
        couponCode: appliedCoupon || undefined,
        taxAmount,
        shippingFee,
        totalAmount,
        paymentMethod,
        razorpayOrderId,
        razorpayPaymentId,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      setIsProcessing(false);

      if (data.success) {
        setCompletedOrder(data.data);
        onOrderPlaced(data.data);
        onClearCart();
      } else {
        alert(data.message || 'Failed to place order');
      }
    } catch (err: any) {
      setIsProcessing(false);
      alert(`Order error: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-emerald-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative max-h-[92vh] flex flex-col my-auto border border-emerald-100">
        {/* Header */}
        <div className="p-4 bg-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <h2 className="font-serif font-bold text-lg">Secure Express Checkout</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-emerald-800 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {completedOrder ? (
            /* Order Success View */
            <div className="text-center py-8 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-800 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h3 className="text-2xl font-serif font-bold text-slate-900">
                Thank You, {completedOrder.customerName}!
              </h3>

              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Your order <span className="font-bold text-emerald-900">#{completedOrder.orderNumber}</span> has been confirmed. A confirmation SMS will be sent to <span className="font-semibold text-slate-800">{completedOrder.customerPhone}</span>.
              </p>

              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-left max-w-md mx-auto text-xs space-y-2">
                <div className="flex justify-between font-bold text-emerald-950 border-b border-emerald-200 pb-2">
                  <span>Order Reference</span>
                  <span>{completedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Payment Status</span>
                  <span className="font-bold text-emerald-800">{completedOrder.paymentStatus} ({completedOrder.paymentMethod})</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Total Paid</span>
                  <span className="font-bold text-slate-900">₹{completedOrder.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Delivery Address</span>
                  <span className="text-right max-w-[200px] truncate">{completedOrder.shippingAddress.addressLine1}, {completedOrder.shippingAddress.city}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="bg-emerald-950 text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-emerald-900 transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Shipping Address Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                  <MapPin className="w-4 h-4 text-emerald-700" /> 1. Shipping Address (India)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600">Mobile Number (SMS Updates) *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-600">Flat / House No. / Building *</label>
                    <input
                      type="text"
                      required
                      value={addressLine1}
                      onChange={e => setAddressLine1(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600">PIN Code *</label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={handlePincodeChange}
                      className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-700 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Street / Area / Sector</label>
                    <input
                      type="text"
                      value={addressLine2}
                      onChange={e => setAddressLine2(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600">Landmark (Optional)</label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={e => setLandmark(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600">State *</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={e => setState(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                  <CreditCard className="w-4 h-4 text-emerald-700" /> 2. Select Payment Method
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Razorpay Card / UPI */}
                  <div
                    onClick={() => setPaymentMethod('RAZORPAY')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3 ${
                      paymentMethod === 'RAZORPAY'
                        ? 'border-emerald-700 bg-emerald-50/70 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-emerald-800 mt-0.5" />
                    <div>
                      <div className="font-bold text-xs text-slate-900 flex items-center gap-1">
                        <span>Razorpay Payment Gateway</span>
                        <span className="bg-amber-400 text-emerald-950 text-[9px] font-extrabold px-1.5 py-0.2 rounded">FAST</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        UPI (GPay / PhonePe / Paytm), Credit/Debit Cards, NetBanking
                      </p>
                    </div>
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3 ${
                      paymentMethod === 'COD'
                        ? 'border-emerald-700 bg-emerald-50/70 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-emerald-800 mt-0.5" />
                    <div>
                      <div className="font-bold text-xs text-slate-900">Cash on Delivery (COD)</div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Pay cash upon delivery at your doorstep
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary Line */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 text-sm">Total Payable: ₹{totalAmount.toFixed(2)}</div>
                  <div className="text-slate-500 text-[11px]">Includes ₹{taxAmount.toFixed(2)} GST & Express Delivery</div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg transition active:scale-95"
                >
                  {isProcessing ? 'Verifying & Placing Order...' : `Pay & Complete Order`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
