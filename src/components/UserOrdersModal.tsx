import React, { useState } from 'react';
import { X, Package, Clock, Truck, CheckCircle2, User, MapPin, Award, Sparkles, ShieldCheck, Mail, Phone, ShoppingBag, Edit3, Save } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface UserOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  phone?: string;
  email?: string;
  fullName?: string;
  onUpdateProfile?: (data: { fullName: string; email: string; phone: string }) => void;
  onOpenAddresses?: () => void;
}

const STATUS_STEPS: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

export const UserOrdersModal: React.FC<UserOrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  phone,
  email,
  fullName,
  onUpdateProfile,
  onOpenAddresses,
}) => {
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'ORDERS' | 'BENEFITS'>('PROFILE');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const getEffectiveName = () => fullName || localStorage.getItem('care_user_name') || 'Care Customer';
  const getEffectiveEmail = () => email || localStorage.getItem('care_user_email') || 'customer@carebeautysolution.com';
  const getEffectivePhone = () => phone || localStorage.getItem('care_user_phone') || '';

  const [userName, setUserName] = useState<string>(getEffectiveName);
  const [userEmail, setUserEmail] = useState<string>(getEffectiveEmail);
  const [userPhone, setUserPhone] = useState<string>(getEffectivePhone);

  // Sync state whenever modal opens or props change
  React.useEffect(() => {
    if (isOpen) {
      setUserName(getEffectiveName());
      setUserEmail(getEffectiveEmail());
      setUserPhone(getEffectivePhone());
      setIsEditingProfile(false);
    }
  }, [isOpen, fullName, email, phone]);

  const handleSaveProfile = () => {
    if (isEditingProfile) {
      const cleanName = userName.trim() || 'Care Customer';
      const cleanEmail = userEmail.trim().toLowerCase();
      const cleanPhone = userPhone.replace(/\D/g, '').slice(-10);

      localStorage.setItem('care_user_name', cleanName);
      if (cleanEmail) localStorage.setItem('care_user_email', cleanEmail);
      if (cleanPhone) localStorage.setItem('care_user_phone', cleanPhone);

      setUserName(cleanName);
      setUserEmail(cleanEmail);
      setUserPhone(cleanPhone);

      if (onUpdateProfile) {
        onUpdateProfile({ fullName: cleanName, email: cleanEmail, phone: cleanPhone });
      }
      setIsEditingProfile(false);
    } else {
      setIsEditingProfile(true);
    }
  };

  if (!isOpen) return null;

  const totalSpent = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const loyaltyPoints = Math.floor(totalSpent * 0.1);

  const displayInitials = (userName || 'Care Customer').trim().charAt(0).toUpperCase() || 'C';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative max-h-[92vh] flex flex-col my-auto border border-stone-200">
        
        {/* Profile Header Banner */}
        <div className="p-6 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-amber-50 relative overflow-hidden shrink-0 border-b border-amber-900/50">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400/50 flex items-center justify-center text-amber-300 font-serif font-bold text-2xl shadow-inner">
                {displayInitials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif font-extrabold text-xl text-amber-100">{userName}</h2>
                  <span className="bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" /> Gold Botanical Member
                  </span>
                </div>
                <p className="text-xs text-amber-200/80 font-mono mt-0.5">+91 {userPhone} • {userEmail}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:text-white rounded-full transition shadow-sm cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Account Summary Stats Bar */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-amber-900/40 text-center text-xs">
            <div className="bg-stone-900/60 backdrop-blur p-2.5 rounded-xl border border-amber-900/30">
              <span className="text-[10px] uppercase font-bold text-amber-300/80 tracking-wider block">Total Orders</span>
              <span className="font-serif font-extrabold text-lg text-white">{orders.length}</span>
            </div>
            <div className="bg-stone-900/60 backdrop-blur p-2.5 rounded-xl border border-amber-900/30">
              <span className="text-[10px] uppercase font-bold text-amber-300/80 tracking-wider block">Total Spent</span>
              <span className="font-serif font-extrabold text-lg text-white">₹{totalSpent.toFixed(0)}</span>
            </div>
            <div className="bg-stone-900/60 backdrop-blur p-2.5 rounded-xl border border-amber-900/30">
              <span className="text-[10px] uppercase font-bold text-amber-300/80 tracking-wider block">CARe Points</span>
              <span className="font-serif font-extrabold text-lg text-amber-300">{loyaltyPoints} PTS</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 pt-2 shrink-0">
          <button
            onClick={() => setActiveTab('PROFILE')}
            className={`px-5 py-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
              activeTab === 'PROFILE'
                ? 'border-amber-700 text-amber-900 bg-white rounded-t-xl'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <User className="w-4 h-4" /> Account Details
          </button>
          <button
            onClick={() => setActiveTab('ORDERS')}
            className={`px-5 py-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
              activeTab === 'ORDERS'
                ? 'border-amber-700 text-amber-900 bg-white rounded-t-xl'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Package className="w-4 h-4" /> My Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('BENEFITS')}
            className={`px-5 py-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
              activeTab === 'BENEFITS'
                ? 'border-amber-700 text-amber-900 bg-white rounded-t-xl'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Award className="w-4 h-4" /> VIP Privileges
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 bg-stone-50/50">
          
          {/* TAB 1: PROFILE DETAILS */}
          {activeTab === 'PROFILE' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-700" /> Personal Profile
                  </h3>
                  <button
                    onClick={handleSaveProfile}
                    className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 transition cursor-pointer"
                  >
                    {isEditingProfile ? <Save className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                    <span>{isEditingProfile ? 'Save Changes' : 'Edit Profile'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-stone-500 block mb-1">Full Name</label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    ) : (
                      <div className="font-bold text-stone-900 text-sm bg-stone-50 p-2.5 rounded-xl border border-stone-100">{userName}</div>
                    )}
                  </div>

                  <div>
                    <label className="font-bold text-stone-500 block mb-1">Mobile Number (+91)</label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={userPhone}
                        onChange={e => setUserPhone(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    ) : (
                      <div className="font-bold text-stone-900 text-sm bg-stone-50 p-2.5 rounded-xl border border-stone-100 flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-amber-700" /> +91 {userPhone}
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-stone-500 block mb-1">Email Address</label>
                    {isEditingProfile ? (
                      <input
                        type="email"
                        value={userEmail}
                        onChange={e => setUserEmail(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    ) : (
                      <div className="font-bold text-stone-900 text-sm bg-stone-50 p-2.5 rounded-xl border border-stone-100 flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-amber-700" /> {userEmail}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Saved Address Shortcut */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 text-sm">Delivery Address Book</div>
                    <div className="text-xs text-stone-500">Manage saved shipping addresses for faster 1-click checkout</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (onOpenAddresses) onOpenAddresses();
                  }}
                  className="bg-stone-900 hover:bg-stone-950 text-amber-300 font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm"
                >
                  Manage Addresses
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS LIST */}
          {activeTab === 'ORDERS' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3">
                  <Package className="w-12 h-12 text-stone-300 mx-auto" />
                  <h4 className="font-bold text-stone-800 text-base">No Orders Found</h4>
                  <p className="text-stone-500 text-xs max-w-sm mx-auto">You have not placed any orders yet. Explore our clinical skincare range to place your first order.</p>
                </div>
              ) : (
                orders.map(ord => (
                  <div key={ord.id} className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4 shadow-sm">
                    {/* Header info */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3 text-xs">
                      <div>
                        <span className="font-extrabold text-stone-900 text-sm">Order #{ord.orderNumber}</span>
                        <span className="text-stone-400 ml-2 font-mono">({new Date(ord.createdAt).toLocaleDateString('en-IN')})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="bg-amber-100 text-amber-900 font-extrabold text-[11px] px-3 py-1 rounded-full uppercase border border-amber-300">
                          {ord.status}
                        </span>
                        <span className="font-bold text-stone-900 text-sm">₹{ord.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Status Progress Timeline */}
                    <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                      <div className="text-[11px] font-bold text-stone-600 mb-2">Live Delivery Timeline:</div>
                      <div className="flex items-center justify-between relative">
                        {STATUS_STEPS.slice(0, 5).map((st, idx) => {
                          const isCompleted = STATUS_STEPS.indexOf(ord.status) >= idx;
                          return (
                            <div key={st} className="flex flex-col items-center z-10 text-[10px]">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                                  isCompleted ? 'bg-amber-800 text-white shadow-sm' : 'bg-stone-200 text-stone-400'
                                }`}
                              >
                                {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                              </div>
                              <span className={`mt-1 font-semibold ${isCompleted ? 'text-amber-900 font-bold' : 'text-stone-400'}`}>
                                {st}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Items preview */}
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-stone-700">Ordered Products:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {ord.items.map(item => (
                          <div key={item.id} className="flex items-center gap-3 bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-xs">
                            <img src={item.productImage} alt={item.productName} className="w-10 h-10 rounded-lg object-cover bg-white" />
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-stone-900 truncate">{item.productName}</div>
                              <div className="text-[11px] text-stone-500">{item.variantName} x {item.quantity} • ₹{item.price * item.quantity}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: VIP PRIVILEGES */}
          {activeTab === 'BENEFITS' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-amber-50 to-stone-100 p-5 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-700" />
                  <h3 className="font-serif font-bold text-amber-950 text-base">Gold Botanical Circle Member</h3>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  As a registered CARe member, every purchase earns you 10% cash equivalent in CARe Beauty Points.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-white p-3 rounded-xl border border-amber-200/80 text-xs space-y-1">
                    <div className="font-bold text-amber-900">✨ Priority Shipping</div>
                    <div className="text-stone-500 text-[11px]">Orders placed by Gold Members receive priority dispatch within 12 hours.</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-amber-200/80 text-xs space-y-1">
                    <div className="font-bold text-amber-900">🎁 Exclusive Product Drops</div>
                    <div className="text-stone-500 text-[11px]">Early access to new clinical dermatologist formulations.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
