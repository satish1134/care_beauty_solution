import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Package,
  Heart,
  MapPin,
  Award,
  User,
  LogOut,
  Truck,
  CheckCircle,
  Clock,
  ArrowRight,
  Plus,
  Trash2,
  Gift,
} from 'lucide-react';
import { ProductCardMarketplace } from '../product/ProductCardMarketplace';

export const UserAccountModalMarketplace: React.FC = () => {
  const {
    isAccountModalOpen,
    setIsAccountModalOpen,
    accountActiveTab,
    setAccountActiveTab,
    currentUser,
    updateUserProfile,
    orders,
    wishlist,
    savedAddresses,
    addSavedAddress,
    removeSavedAddress,
    logout,
    openPdp,
    showToast,
  } = useStore();

  const [newAddressType, setNewAddressType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newRecipientName, setNewRecipientName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddressLine, setNewAddressLine] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPincode, setNewPincode] = useState('');
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // Profile Form State
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || '');
  const [profileSkinType, setProfileSkinType] = useState(currentUser?.skinType || 'Combination');

  React.useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || '');
      setProfilePhone(currentUser.phone || '');
      setProfileEmail(currentUser.email || '');
      setProfileSkinType(currentUser.skinType || 'Combination');
    }
  }, [currentUser]);

  if (!isAccountModalOpen) return null;

  const handleSaveAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipientName || !newAddressLine || !newCity || !newPincode) return;
    addSavedAddress({
      type: newAddressType,
      recipientName: newRecipientName,
      phone: newPhone || currentUser?.phone || '',
      addressLine1: newAddressLine,
      city: newCity,
      state: newState || 'Karnataka',
      pincode: newPincode,
      isDefault: savedAddresses.length === 0,
    });
    setIsAddingAddress(false);
    setNewRecipientName('');
    setNewPhone('');
    setNewAddressLine('');
    setNewCity('');
    setNewPincode('');
  };

  const handleSaveProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: profileName.trim() || 'Customer',
      phone: profilePhone.trim(),
      email: profileEmail.trim(),
      skinType: profileSkinType,
    });
  };

  return (
    <div
      id="user-account-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={() => setIsAccountModalOpen(false)}
    >
      <div
        id="user-account-modal-dialog"
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsAccountModalOpen(false)}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-white/80 hover:bg-neutral-100 text-neutral-500 transition shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Sidebar Tabs */}
        <div className="w-full md:w-64 bg-[#FAF9F6] border-r border-[#E5E5E5] p-5 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            {/* User Profile Summary */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#E85D5D] text-white flex items-center justify-center font-bold text-lg">
                {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-[#1A1A1A] truncate">
                  {currentUser?.name || 'Care Member'}
                </h3>
                <p className="text-[11px] text-[#6B6B6B] truncate">
                  {currentUser?.email || currentUser?.phone || 'Verified Customer'}
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="space-y-1">
              <button
                onClick={() => setAccountActiveTab('orders')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                  accountActiveTab === 'orders'
                    ? 'bg-white text-[#E85D5D] border border-[#E5E5E5] shadow-xs'
                    : 'text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-neutral-100'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>My Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => setAccountActiveTab('wishlist')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                  accountActiveTab === 'wishlist'
                    ? 'bg-white text-[#E85D5D] border border-[#E5E5E5] shadow-xs'
                    : 'text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-neutral-100'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>My Wishlist ({wishlist.length})</span>
              </button>

              <button
                onClick={() => setAccountActiveTab('addresses')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                  accountActiveTab === 'addresses'
                    ? 'bg-white text-[#E85D5D] border border-[#E5E5E5] shadow-xs'
                    : 'text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-neutral-100'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Saved Addresses</span>
              </button>

              <button
                onClick={() => setAccountActiveTab('rewards')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                  accountActiveTab === 'rewards'
                    ? 'bg-white text-[#E85D5D] border border-[#E5E5E5] shadow-xs'
                    : 'text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-neutral-100'
                }`}
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span>Care Coins &amp; Club</span>
              </button>

              <button
                onClick={() => setAccountActiveTab('profile')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                  accountActiveTab === 'profile'
                    ? 'bg-white text-[#E85D5D] border border-[#E5E5E5] shadow-xs'
                    : 'text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-neutral-100'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile Settings</span>
              </button>
            </nav>
          </div>

          <button
            onClick={() => {
              logout();
              setIsAccountModalOpen(false);
            }}
            className="w-full flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-red-600 pt-4 border-t border-[#E5E5E5]"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-white max-h-[80vh] md:max-h-[90vh]">
          {/* 1. ORDERS TAB */}
          {accountActiveTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-[#1A1A1A]">Order History &amp; Live Tracking</h2>

              {orders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Package className="w-12 h-12 text-neutral-300 mx-auto" />
                  <p className="text-sm font-semibold text-[#1A1A1A]">No orders placed yet</p>
                  <p className="text-xs text-[#6B6B6B]">Your purchases will appear here with live tracking.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div key={ord.id} className="border border-[#E5E5E5] rounded-xl p-4 sm:p-5 space-y-4 bg-[#FAF9F6]">
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E5E5] pb-3 text-xs">
                        <div>
                          <span className="text-[#6B6B6B]">Order ID: </span>
                          <strong className="text-[#1A1A1A]">{ord.id}</strong>
                          <span className="text-neutral-400 mx-2">•</span>
                          <span className="text-neutral-500">{ord.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="badge-forest-green text-[10px] px-2 py-0.5 font-bold">
                            {ord.status.toUpperCase()}
                          </span>
                          <span className="text-xs font-bold text-[#1A1A1A]">
                            Total: ₹{ord.totalAmount}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {ord.items.map((it) => (
                          <div key={it.id} className="flex items-center gap-3">
                            <img
                              src={it.product.images[0]}
                              alt={it.product.name}
                              className="w-12 h-12 object-contain bg-white rounded border border-[#E5E5E5] p-1 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-[#1A1A1A] truncate">{it.product.name}</p>
                              <p className="text-[11px] text-[#6B6B6B]">
                                {it.variant.name} • Qty: {it.quantity} • ₹{it.variant.price * it.quantity}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                openPdp(it.product);
                                setIsAccountModalOpen(false);
                              }}
                              className="text-xs text-[#E85D5D] hover:underline font-bold"
                            >
                              Buy Again
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Tracking timeline bar */}
                      <div className="bg-white border border-[#E5E5E5] p-3 rounded-lg flex items-center justify-between text-[11px] text-[#2D5A3D] font-semibold">
                        <div className="flex items-center gap-1.5">
                          <Truck className="w-4 h-4 text-[#2D5A3D]" />
                          <span>Delivery via Bluedart Air Express ({ord.shippingAddress.city})</span>
                        </div>
                        <span>Expected by Tomorrow, 4 PM</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. WISHLIST TAB */}
          {accountActiveTab === 'wishlist' && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-[#1A1A1A]">My Saved Wishlist ({wishlist.length})</h2>
              {wishlist.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Heart className="w-12 h-12 text-neutral-300 mx-auto" />
                  <p className="text-sm font-semibold text-[#1A1A1A]">Your Wishlist is Empty</p>
                  <p className="text-xs text-[#6B6B6B]">Tap the heart icon on any product to save it for later.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlist.map((item) => (
                    <ProductCardMarketplace key={item.id} product={item} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. ADDRESSES TAB */}
          {accountActiveTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#1A1A1A]">Saved Delivery Addresses</h2>
                <button
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="btn-primary-coral text-xs px-3 py-1.5 font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              {isAddingAddress && (
                <form onSubmit={handleSaveAddressSubmit} className="bg-[#FAF9F6] border border-[#E5E5E5] rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-[#1A1A1A]">New Delivery Location</h4>
                  <div className="flex gap-2">
                    {['Home', 'Work', 'Other'].map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setNewAddressType(t as any)}
                        className={`text-xs px-3 py-1 rounded-md border font-medium ${
                          newAddressType === t ? 'bg-[#1A1A1A] text-white' : 'bg-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Recipient Full Name"
                      value={newRecipientName}
                      onChange={(e) => setNewRecipientName(e.target.value)}
                      className="bg-white border border-[#E5E5E5] text-xs p-2 rounded-lg"
                    />
                    <input
                      type="tel"
                      placeholder="10-Digit Mobile"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="bg-white border border-[#E5E5E5] text-xs p-2 rounded-lg"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="House/Flat No, Street, Landmark"
                    value={newAddressLine}
                    onChange={(e) => setNewAddressLine(e.target.value)}
                    className="w-full bg-white border border-[#E5E5E5] text-xs p-2 rounded-lg"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="bg-white border border-[#E5E5E5] text-xs p-2 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={newState}
                      onChange={(e) => setNewState(e.target.value)}
                      className="bg-white border border-[#E5E5E5] text-xs p-2 rounded-lg"
                    />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="Pincode"
                      value={newPincode}
                      onChange={(e) => setNewPincode(e.target.value)}
                      className="bg-white border border-[#E5E5E5] text-xs p-2 rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-3 py-1.5 border border-[#E5E5E5] text-xs font-semibold rounded-lg"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary-coral text-xs px-4 py-1.5 font-bold">
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {savedAddresses.map((addr) => (
                  <div key={addr.id} className="border border-[#E5E5E5] rounded-xl p-4 flex items-start justify-between bg-white">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-neutral-100 text-neutral-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          {addr.type}
                        </span>
                        <h4 className="text-xs font-bold text-[#1A1A1A]">{addr.recipientName}</h4>
                        <span className="text-xs text-[#6B6B6B]">({addr.phone})</span>
                      </div>
                      <p className="text-xs text-[#6B6B6B]">{addr.addressLine1}</p>
                      <p className="text-xs text-[#6B6B6B] font-medium">
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                    </div>
                    <button
                      onClick={() => removeSavedAddress(addr.id)}
                      className="text-neutral-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. REWARDS TAB */}
          {accountActiveTab === 'rewards' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#1A1A1A] to-neutral-800 text-white rounded-2xl p-6 relative overflow-hidden shadow-lg">
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#E85D5D] font-bold block mb-1">
                      Care Beauty Club • Platinum Tier
                    </span>
                    <h3 className="text-3xl font-bold">450 Care Coins</h3>
                    <p className="text-xs text-neutral-300 mt-1">
                      Worth <strong className="text-white">₹450</strong> off your next order. (1 Coin = ₹1)
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                    <Gift className="w-7 h-7" />
                  </div>
                </div>
              </div>

              <div className="bg-[#FAF9F6] border border-[#E5E5E5] rounded-xl p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                  Refer Friends &amp; Earn ₹150 Credit
                </h4>
                <p className="text-xs text-[#6B6B6B]">
                  Share your referral link with family. When they place their first order above ₹499, both of you receive ₹150 in Care Coins!
                </p>
                <div className="flex">
                  <input
                    type="text"
                    readOnly
                    value="https://carebeauty.in/invite/CARE-9921"
                    className="bg-white border border-[#E5E5E5] text-xs px-3 py-2 rounded-l-lg flex-1 font-mono text-[#1A1A1A]"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText('https://carebeauty.in/invite/CARE-9921');
                      showToast('Referral link copied!', 'success');
                    }}
                    className="bg-[#1A1A1A] text-white text-xs font-bold px-4 py-2 rounded-r-lg hover:bg-black"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 5. PROFILE TAB */}
          {accountActiveTab === 'profile' && (
            <form onSubmit={handleSaveProfileSubmit} className="space-y-6">
              <h2 className="text-base font-bold text-[#1A1A1A]">Profile &amp; Skin Preferences</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#1A1A1A] block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full bg-[#FAF9F6] border border-[#E5E5E5] text-xs p-2.5 rounded-lg font-medium focus:outline-none focus:border-[#E85D5D]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#1A1A1A] block mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="10-digit mobile"
                      className="w-full bg-[#FAF9F6] border border-[#E5E5E5] text-xs p-2.5 rounded-lg focus:outline-none focus:border-[#E85D5D]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#1A1A1A] block mb-1">Email</label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-[#FAF9F6] border border-[#E5E5E5] text-xs p-2.5 rounded-lg focus:outline-none focus:border-[#E85D5D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1A1A1A] block mb-1">Primary Skin Type</label>
                  <select
                    value={profileSkinType}
                    onChange={(e) => setProfileSkinType(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E5E5E5] text-xs p-2.5 rounded-lg font-medium focus:outline-none focus:border-[#E85D5D]"
                  >
                    <option value="Combination">Combination (Oily T-Zone, Dry Cheeks)</option>
                    <option value="Dry">Dry &amp; Barrier Compromised</option>
                    <option value="Oily">Oily &amp; Acne Prone</option>
                    <option value="Sensitive">Sensitive &amp; Redness Prone</option>
                    <option value="Normal">Normal Skin</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn-primary-coral text-xs px-6 py-2.5 font-bold"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
