import React, { useState, useEffect } from 'react';
import { X, MapPin, Plus, Trash2, Edit2, CheckCircle, Home, Briefcase, Star } from 'lucide-react';

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface AddressBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string | null;
  onSelectAddress?: (addr: Address) => void;
}

export const AddressBookModal: React.FC<AddressBookModalProps> = ({
  isOpen,
  onClose,
  accessToken,
  onSelectAddress,
}) => {
  if (!isOpen) return null;

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddr, setEditingAddr] = useState<Address | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = async () => {
    try {
      const token = accessToken || localStorage.getItem('care_access_token');
      const res = await fetch('/api/user/addresses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setAddresses(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch addresses', err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [accessToken, isOpen]);

  const openCreateForm = () => {
    setEditingAddr(null);
    setFullName('');
    setPhone('');
    setStreet('');
    setLandmark('');
    setCity('');
    setState('Karnataka');
    setPincode('');
    setIsDefault(addresses.length === 0);
    setIsFormOpen(true);
    setError(null);
  };

  const openEditForm = (addr: Address) => {
    setEditingAddr(addr);
    setFullName(addr.fullName);
    setPhone(addr.phone);
    setStreet(addr.street);
    setLandmark(addr.landmark || '');
    setCity(addr.city);
    setState(addr.state);
    setPincode(addr.pincode);
    setIsDefault(addr.isDefault);
    setIsFormOpen(true);
    setError(null);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !street || !city || !pincode) {
      setError('Please fill in all required address fields');
      return;
    }

    setIsLoading(true);
    setError(null);
    const token = accessToken || localStorage.getItem('care_access_token');

    try {
      const url = editingAddr ? `/api/user/addresses/${editingAddr.id}` : '/api/user/addresses';
      const method = editingAddr ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName, phone, street, landmark, city, state, pincode, isDefault }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        setIsFormOpen(false);
        fetchAddresses();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setIsLoading(false);
      setError('Failed to save address');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    const token = accessToken || localStorage.getItem('care_access_token');
    try {
      const res = await fetch(`/api/user/addresses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchAddresses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetDefault = async (id: string) => {
    const token = accessToken || localStorage.getItem('care_access_token');
    try {
      const res = await fetch(`/api/user/addresses/${id}/default`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchAddresses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-emerald-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-emerald-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-800" />
            <h3 className="font-serif font-bold text-lg text-slate-900">Delivery Address Book</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 py-4 space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-xs p-2.5 rounded-xl font-medium">{error}</div>}

          {!isFormOpen ? (
            <>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">Saved Addresses ({addresses.length})</span>
                <button
                  onClick={openCreateForm}
                  className="bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Address
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                  <p className="text-xs text-slate-500">No delivery addresses saved yet.</p>
                  <button onClick={openCreateForm} className="text-xs font-bold text-emerald-800 underline">
                    + Add your primary address
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map(addr => (
                    <div
                      key={addr.id}
                      className={`p-4 rounded-2xl border transition relative ${
                        addr.isDefault ? 'border-emerald-700 bg-emerald-50/40' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{addr.fullName}</span>
                            <span className="text-[11px] text-slate-500 font-mono">({addr.phone})</span>
                            {addr.isDefault && (
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Star className="w-3 h-3 fill-emerald-700" /> Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {addr.street}, {addr.landmark ? `${addr.landmark}, ` : ''}
                            {addr.city}, {addr.state} - <span className="font-mono font-bold text-slate-900">{addr.pincode}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditForm(addr)}
                            className="p-1 text-slate-400 hover:text-emerald-700 transition"
                            title="Edit Address"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-1 text-slate-400 hover:text-red-600 transition"
                            title="Delete Address"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleSetDefault(addr.id)}
                            className="text-emerald-800 font-semibold text-[11px] hover:underline"
                          >
                            Set as Default
                          </button>
                        )}
                        {onSelectAddress && (
                          <button
                            onClick={() => {
                              onSelectAddress(addr);
                              onClose();
                            }}
                            className="ml-auto bg-amber-400 text-emerald-950 font-bold px-3 py-1 rounded-lg text-[11px]"
                          >
                            Deliver Here
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* ================= ADD / EDIT ADDRESS FORM ================= */
            <form onSubmit={handleSaveAddress} className="space-y-3">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                {editingAddr ? 'Edit Delivery Address' : 'Add New Delivery Address'}
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Priya Sharma"
                    className="w-full text-xs border border-slate-300 rounded-xl p-2 mt-1"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full text-xs border border-slate-300 rounded-xl p-2 mt-1 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600">House/Flat No. & Street Address *</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                  placeholder="Flat 402, Lotus Heights, 100ft Road"
                  className="w-full text-xs border border-slate-300 rounded-xl p-2 mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600">Landmark (Optional)</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={e => setLandmark(e.target.value)}
                  placeholder="Near Toit Brewery"
                  className="w-full text-xs border border-slate-300 rounded-xl p-2 mt-1"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="w-full text-xs border border-slate-300 rounded-xl p-2 mt-1"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={e => setState(e.target.value)}
                    placeholder="Karnataka"
                    className="w-full text-xs border border-slate-300 rounded-xl p-2 mt-1"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600">PIN Code *</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    placeholder="560038"
                    maxLength={6}
                    className="w-full text-xs border border-slate-300 rounded-xl p-2 mt-1 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="defaultAddress"
                  checked={isDefault}
                  onChange={e => setIsDefault(e.target.checked)}
                  className="rounded text-emerald-800"
                />
                <label htmlFor="defaultAddress" className="text-xs text-slate-600 font-medium cursor-pointer">
                  Set as default shipping address
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-emerald-950 hover:bg-emerald-900 text-white text-xs font-bold py-2.5 rounded-xl shadow-md"
                >
                  {isLoading ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
