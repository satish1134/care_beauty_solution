import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  FileText,
  Printer,
  X,
  User,
  MapPin,
  CreditCard,
  RefreshCw,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';

interface OrderFulfillmentProps {
  orders: Order[];
  onRefreshData: () => void;
}

export const OrderFulfillment: React.FC<OrderFulfillmentProps> = ({
  orders,
  onRefreshData,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<Order | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery);
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        onRefreshData();
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (err) {
      alert('Error communicating with backend server.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Delivered
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Truck className="w-3 h-3" /> Shipped
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Clock className="w-3 h-3" /> Processing
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-slate-700 text-slate-300 border border-slate-600">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold font-serif text-white">Order Pipeline & Fulfillment</h2>
          <p className="text-slate-400 text-xs mt-1">Manage order statuses, shipping updates, customer invoices, and dispatch logistics.</p>
        </div>
        <button
          onClick={onRefreshData}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Pipeline</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Order ID, customer name or phone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700/80 rounded-xl px-4 py-2 text-xs text-slate-200 font-medium focus:outline-none focus:border-emerald-500"
        >
          <option value="ALL">All Order Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-6">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Items & Total</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-6 text-right">Actions & Status Switch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 font-mono">
                    <div className="font-bold text-emerald-400">{order.id}</div>
                    <div className="text-[11px] text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-white">{order.customerName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{order.customerPhone}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-amber-400 font-mono text-sm">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </div>
                  </td>
                  <td className="py-4 px-4">{getStatusBadge(order.status)}</td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <select
                      disabled={updatingOrderId === order.id}
                      value={order.status}
                      onChange={e => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>

                    <button
                      onClick={() => setInvoiceModalOrder(order)}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors inline-flex items-center gap-1 text-[11px] px-2.5 font-medium"
                      title="Generate Printable Packing Slip"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-400" /> Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice / Packing Slip Modal */}
      {invoiceModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 w-full max-w-xl rounded-3xl p-6 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setInvoiceModalOrder(null)}
              className="absolute right-5 top-5 p-2 text-slate-500 hover:text-slate-900 rounded-xl bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Invoice Header */}
            <div className="border-b border-slate-200 pb-4 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold font-serif text-emerald-950">CARe Beauty Solution</h3>
                <p className="text-xs text-slate-500 font-mono">Tax Invoice & Packing Slip</p>
              </div>
              <div className="text-right font-mono text-xs">
                <div className="font-bold text-amber-700">{invoiceModalOrder.id}</div>
                <div className="text-slate-500">{new Date(invoiceModalOrder.createdAt).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="font-bold text-slate-700 block mb-1">Billed To:</span>
                <div className="font-semibold text-slate-900">{invoiceModalOrder.customerName}</div>
                <div className="text-slate-600 font-mono">{invoiceModalOrder.customerPhone}</div>
                <div className="text-slate-600">{invoiceModalOrder.customerEmail || 'No email provided'}</div>
              </div>
              <div>
                <span className="font-bold text-slate-700 block mb-1">Shipping Address:</span>
                <div className="text-slate-700 leading-relaxed">{invoiceModalOrder.shippingAddress}</div>
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 font-mono text-[11px] uppercase text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Item & Variant</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-4 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {invoiceModalOrder.items.map((item, i) => (
                    <tr key={i}>
                      <td className="py-2.5 px-4 font-sans font-medium text-slate-900">
                        {item.productName} ({item.variantName})
                      </td>
                      <td className="py-2.5 px-3 text-center">{item.quantity}</td>
                      <td className="py-2.5 px-4 text-right font-bold text-amber-700">₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="border-t border-slate-200 pt-3 flex justify-between items-center font-mono text-sm">
              <span className="font-bold text-slate-700">Total Paid (COD/UPI):</span>
              <span className="font-bold text-emerald-800 text-lg">₹{invoiceModalOrder.totalAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => window.print()}
                className="w-full py-3 rounded-2xl bg-emerald-950 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                Print Packing Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
