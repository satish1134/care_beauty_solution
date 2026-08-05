import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  Tag,
  FileText,
  Plus,
  Trash2,
  Edit,
  TrendingUp,
  Clock,
  Upload,
  RefreshCw,
  GitBranch,
  Database,
  CheckCircle2,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Product, Category, Coupon, AuditLog, Order, OrderStatus } from '../types';

interface AdminPanelProps {
  products: Product[];
  categories: Category[];
  coupons: Coupon[];
  auditLogs: AuditLog[];
  orders: Order[];
  onRefreshData: () => void;
  onOpenGitGuide: () => void;
}

const SALES_CHART_DATA = [
  { day: 'Mon', sales: 12400, orders: 12 },
  { day: 'Tue', sales: 18900, orders: 18 },
  { day: 'Wed', sales: 24500, orders: 24 },
  { day: 'Thu', sales: 31200, orders: 29 },
  { day: 'Fri', sales: 42800, orders: 41 },
  { day: 'Sat', sales: 58900, orders: 56 },
  { day: 'Sun', sales: 64100, orders: 62 },
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  categories,
  coupons,
  auditLogs,
  orders,
  onRefreshData,
  onOpenGitGuide,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'coupons' | 'audit' | 'database'>('analytics');

  // Add Product Form Modal state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductTagline, setNewProductTagline] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductCategory, setNewProductCategory] = useState(categories[0]?.id || '');
  const [newVariantName, setNewVariantName] = useState('50 ml Jar');
  const [newVariantPrice, setNewVariantPrice] = useState('599');
  const [newVariantStock, setNewVariantStock] = useState('50');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Status update note state for orders
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [newOrderStatus, setNewOrderStatus] = useState<OrderStatus>('PROCESSING');
  const [statusNote, setStatusNote] = useState('');

  // Add Coupon form state
  const [couponCode, setCouponCode] = useState('');
  const [couponValue, setCouponValue] = useState('10');
  const [couponMinAmount, setCouponMinAmount] = useState('499');

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

  // Handle Image Upload
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, imageName: file.name }),
        });
        const data = await res.json();
        setIsUploading(false);
        if (data.success) {
          setUploadedImageUrl(data.url);
        }
      } catch (err) {
        setIsUploading(false);
        alert('Image upload failed');
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit Add Product
  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductCategory) return;

    try {
      const payload = {
        name: newProductName,
        tagline: newProductTagline || 'Dermatologist Formulated Skincare',
        description: newProductDesc || 'Clinical skincare solution engineered for barrier repair and skin nourishment.',
        categoryId: newProductCategory,
        categoryName: categories.find(c => c.id === newProductCategory)?.name || 'Skincare',
        keyIngredients: ['Ceramides', 'Hyaluronic Acid', 'Niacinamide'],
        fullIngredients: 'Aqua, Glycerin, Niacinamide, Ceramide NP, Hyaluronic Acid, Phenoxyethanol.',
        howToUse: 'Apply 2-3 pumps daily after cleansing.',
        skinConcerns: ['Dryness', 'Sun Protection'],
        skinTypes: ['All Skin Types'],
        variants: [
          {
            name: newVariantName,
            sku: `CBS-${newProductName.slice(0, 3).toUpperCase()}-1`,
            price: Number(newVariantPrice),
            stock: Number(newVariantStock),
          },
        ],
        images: [
          {
            id: `img-${Date.now()}`,
            url: uploadedImageUrl || 'https://images.unsplash.com/photo-1608248597261-e4d354714552?auto=format&fit=crop&w=800&q=80',
            altText: newProductName,
            isPrimary: true,
          },
        ],
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsAddProductOpen(false);
        setNewProductName('');
        setNewProductTagline('');
        setNewProductDesc('');
        setUploadedImageUrl('');
        onRefreshData();
      } else {
        alert(data.message || 'Error adding product');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    onRefreshData();
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newOrderStatus, note: statusNote }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedOrderId(null);
        setStatusNote('');
        onRefreshData();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Add Coupon
  const handleAddCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode,
          discountType: 'PERCENTAGE',
          discountValue: Number(couponValue),
          minOrderAmount: Number(couponMinAmount),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCouponCode('');
        onRefreshData();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen pb-16">
      {/* Top Admin Bar */}
      <div className="bg-emerald-950 text-white px-6 py-4 border-b border-emerald-800 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-400 text-emerald-950 rounded-xl font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold">Back-Office Admin Console</h1>
              <p className="text-xs text-emerald-300">Care Beauty Solution • www.carebeautysolution.com</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={onRefreshData}
              className="bg-emerald-800 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Sync Live Data
            </button>
            <button
              onClick={onOpenGitGuide}
              className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition"
            >
              <GitBranch className="w-3.5 h-3.5" /> Git Connect Guide
            </button>
          </div>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="bg-white border-b border-slate-200 px-6 py-2 shadow-sm sticky top-[61px] z-30">
        <div className="max-w-7xl mx-auto flex space-x-2 text-xs font-bold overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition ${
              activeTab === 'analytics' ? 'bg-emerald-950 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-amber-400" /> Analytics & Sales
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition ${
              activeTab === 'products' ? 'bg-emerald-950 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Package className="w-4 h-4 text-teal-300" /> Catalog Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition ${
              activeTab === 'orders' ? 'bg-emerald-950 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-amber-300" /> Order Desk ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition ${
              activeTab === 'coupons' ? 'bg-emerald-950 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Tag className="w-4 h-4 text-emerald-400" /> Promo Coupons ({coupons.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition ${
              activeTab === 'audit' ? 'bg-emerald-950 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-400" /> Security Audit Log
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition ${
              activeTab === 'database' ? 'bg-emerald-950 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Database className="w-4 h-4 text-teal-300" /> Database & Git
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* =========================================
            TAB 1: ANALYTICS & DASHBOARD
           ========================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold text-slate-500">Gross Sales Revenue</div>
                <div className="text-2xl font-bold text-emerald-950 mt-1">₹{totalRevenue.toFixed(2)}</div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">↑ +24.8% vs last week</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold text-slate-500">Total Fulfilled Orders</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{totalOrdersCount}</div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">100% Razorpay / COD</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold text-slate-500">Average Order Value (AOV)</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">₹{avgOrderValue.toFixed(2)}</div>
                <div className="text-[11px] text-slate-500 mt-1">Target AOV: ₹1,200</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold text-slate-500">Active Skincare SKUs</div>
                <div className="text-2xl font-bold text-amber-600 mt-1">
                  {products.reduce((acc, p) => acc + p.variants.length, 0)} Variants
                </div>
                <div className="text-[11px] text-slate-500 mt-1">{products.length} Base Formulations</div>
              </div>
            </div>

            {/* Sales Recharts Graph */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-lg text-slate-900">Weekly Revenue & Order Volume Growth</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SALES_CHART_DATA}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip formatter={(value: any) => [`₹${value}`, 'Revenue']} />
                    <Area type="monotone" dataKey="sales" stroke="#047857" fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            TAB 2: PRODUCT CATALOG MANAGEMENT
           ========================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900">Skincare Catalog Management</h3>
                <p className="text-xs text-slate-500">Add unlimited products, variants, price points, and stock levels.</p>
              </div>
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md transition"
              >
                <Plus className="w-4 h-4 text-amber-300" /> Create New Product
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Product Info</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Variants & Pricing</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="p-4 flex items-center gap-3">
                        <img src={p.images[0]?.url} alt={p.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-emerald-50" />
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">{p.tagline}</div>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-emerald-800">{p.categoryName}</td>
                      <td className="p-4">
                        {p.variants.map(v => (
                          <div key={v.id} className="text-[11px] font-mono">
                            {v.name}: <span className="font-bold text-slate-900">₹{v.price}</span>
                          </div>
                        ))}
                      </td>
                      <td className="p-4">
                        {p.variants.map(v => (
                          <div key={v.id} className={`text-[11px] font-semibold ${v.stock <= 10 ? 'text-amber-600' : 'text-slate-700'}`}>
                            {v.stock} units left
                          </div>
                        ))}
                      </td>
                      <td className="p-4 font-bold text-amber-500">⭐ {p.rating} ({p.reviewCount})</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================
            TAB 3: ORDERS & FULFILLMENT DESK
           ========================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-serif font-bold text-lg text-slate-900">Order Dispatch & Status Desk</h3>
              <p className="text-xs text-slate-500">Manage real-time status history (Pending → Confirmed → Shipped → Delivered).</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Order Ref</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Total & Payment</th>
                    <th className="p-4">Current Status</th>
                    <th className="p-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map(ord => (
                    <tr key={ord.id} className="hover:bg-slate-50 transition">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{ord.orderNumber}</div>
                        <div className="text-[11px] text-slate-400">{new Date(ord.createdAt).toLocaleString('en-IN')}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{ord.customerName}</div>
                        <div className="text-[11px] text-slate-500">{ord.customerPhone}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{ord.shippingAddress.city}, {ord.shippingAddress.state}</div>
                      </td>
                      <td className="p-4">
                        {ord.items.map(item => (
                          <div key={item.id} className="text-[11px]">
                            {item.productName} ({item.variantName}) x {item.quantity}
                          </div>
                        ))}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-emerald-950 text-sm">₹{ord.totalAmount.toFixed(2)}</div>
                        <div className="text-[10px] uppercase font-semibold text-slate-500">{ord.paymentMethod} • {ord.paymentStatus}</div>
                      </td>
                      <td className="p-4">
                        <span className="bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-full text-[11px]">
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrderId(ord.id);
                            setNewOrderStatus(ord.status);
                          }}
                          className="bg-emerald-950 text-white font-semibold text-[11px] px-3 py-1.5 rounded-lg hover:bg-emerald-900 transition"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Update Status */}
            {selectedOrderId && (
              <div className="fixed inset-0 z-50 bg-emerald-950/60 flex items-center justify-center p-4">
                <div className="bg-white p-6 rounded-2xl max-w-md w-full space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm">Update Order Status</h4>
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Select Status:</label>
                    <select
                      value={newOrderStatus}
                      onChange={e => setNewOrderStatus(e.target.value as OrderStatus)}
                      className="w-full text-xs border border-slate-300 rounded-xl p-2.5 mt-1"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600">Dispatch / Status Note:</label>
                    <input
                      type="text"
                      placeholder="e.g. Dispatched via BlueDart AWB #BD88921"
                      value={statusNote}
                      onChange={e => setStatusNote(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-xl p-2.5 mt-1"
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setSelectedOrderId(null)} className="px-3 py-2 text-xs font-semibold text-slate-500">
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateOrderStatus(selectedOrderId)}
                      className="bg-emerald-950 text-white px-4 py-2 text-xs font-bold rounded-xl"
                    >
                      Save Status & Log
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================
            TAB 4: PROMO COUPONS MANAGER
           ========================================= */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-serif font-bold text-lg text-slate-900 mb-3">Create New Discount Coupon</h3>
              <form onSubmit={handleAddCouponSubmit} className="flex flex-wrap gap-3 items-end">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Coupon Code</label>
                  <input
                    type="text"
                    placeholder="GLOW10"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    required
                    className="text-xs border border-slate-300 rounded-xl px-3 py-2 uppercase font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Discount %</label>
                  <input
                    type="number"
                    value={couponValue}
                    onChange={e => setCouponValue(e.target.value)}
                    className="text-xs border border-slate-300 rounded-xl px-3 py-2 w-24"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Min Order (₹)</label>
                  <input
                    type="number"
                    value={couponMinAmount}
                    onChange={e => setCouponMinAmount(e.target.value)}
                    className="text-xs border border-slate-300 rounded-xl px-3 py-2 w-28"
                  />
                </div>
                <button type="submit" className="bg-emerald-950 text-white font-bold text-xs px-4 py-2 rounded-xl">
                  Create Coupon
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Coupon Code</th>
                    <th className="p-4">Discount</th>
                    <th className="p-4">Min Order Amount</th>
                    <th className="p-4">Times Redeemed</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {coupons.map(c => (
                    <tr key={c.id}>
                      <td className="p-4 font-bold text-emerald-900 font-mono">{c.code}</td>
                      <td className="p-4 font-semibold">{c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}</td>
                      <td className="p-4 font-medium">₹{c.minOrderAmount}</td>
                      <td className="p-4 text-slate-600">{c.usageCount} times</td>
                      <td className="p-4">
                        <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full text-[10px]">
                          ACTIVE
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================
            TAB 5: AUDIT LOG INSPECTOR
           ========================================= */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-serif font-bold text-lg text-slate-900">Security Audit Trail Log</h3>
              <p className="text-xs text-slate-500">Every admin action (product CRUD, stock updates, order status changes) is recorded.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Actor Email</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Entity</th>
                    <th className="p-4">Audit Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50 transition">
                      <td className="p-4 text-slate-400 font-mono text-[11px]">{new Date(log.timestamp).toLocaleString('en-IN')}</td>
                      <td className="p-4 font-bold text-emerald-900">{log.actorEmail}</td>
                      <td className="p-4 font-bold text-amber-600">{log.action}</td>
                      <td className="p-4 font-semibold text-slate-700">{log.entityType} ({log.entityId})</td>
                      <td className="p-4 text-slate-600">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================
            TAB 6: DATABASE & GIT SETUP
           ========================================= */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6 text-emerald-700" />
                <h3 className="font-serif font-bold text-xl text-slate-900">PostgreSQL + Prisma ORM Architecture</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                The database schema is defined in <code className="bg-slate-100 px-2 py-1 rounded text-emerald-900 font-mono">/packages/database/schema.prisma</code> covering User, Product, ProductVariant, Cart, Order, AuditLog, and Coupon tables.
              </p>

              <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs overflow-x-auto space-y-1">
                <p className="text-amber-400"># Start local PostgreSQL & Redis via Docker Compose:</p>
                <p className="text-emerald-300">docker-compose up -d</p>
                <p className="text-amber-400 mt-2"># Run Prisma database migrations:</p>
                <p className="text-emerald-300">npx prisma migrate dev --name init</p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">Git Repository Initialized on branch `main`</span>
                <button
                  onClick={onOpenGitGuide}
                  className="bg-amber-400 text-emerald-950 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <GitBranch className="w-4 h-4" /> Open Step-by-Step Git Push Guide
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Add Product */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-emerald-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-xl text-slate-900">Create New Product Formulation</h3>
            <form onSubmit={handleAddProductSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Niacinamide 10% Glow Serum"
                  value={newProductName}
                  onChange={e => setNewProductName(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Pore Minimizing & Dark Spot Reduction"
                  value={newProductTagline}
                  onChange={e => setNewProductTagline(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Category *</label>
                <select
                  value={newProductCategory}
                  onChange={e => setNewProductCategory(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-xl p-2.5"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Variant Name</label>
                  <input
                    type="text"
                    value={newVariantName}
                    onChange={e => setNewVariantName(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-xl p-2"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Price (₹)</label>
                  <input
                    type="number"
                    value={newVariantPrice}
                    onChange={e => setNewVariantPrice(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-xl p-2"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Stock Units</label>
                  <input
                    type="number"
                    value={newVariantStock}
                    onChange={e => setNewVariantStock(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-xl p-2"
                  />
                </div>
              </div>

              {/* Upload Image Endpoint */}
              <div>
                <label className="text-xs font-semibold text-slate-600">Product Image Upload</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="w-full text-xs border border-slate-300 rounded-xl p-2"
                />
                {isUploading && <p className="text-[11px] text-amber-600 font-semibold mt-1">Uploading to temp endpoint...</p>}
                {uploadedImageUrl && (
                  <img src={uploadedImageUrl} alt="Preview" className="w-16 h-16 rounded-xl object-cover mt-2 border border-slate-300" />
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-emerald-950 text-white font-bold text-xs px-5 py-2.5 rounded-xl">
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
