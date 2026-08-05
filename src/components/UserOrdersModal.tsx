import React from 'react';
import { X, Package, Clock, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface UserOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  phone: string;
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
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-emerald-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative max-h-[92vh] flex flex-col my-auto border border-emerald-100">
        {/* Header */}
        <div className="p-4 bg-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-300" />
            <h2 className="font-serif font-bold text-lg">My Orders ({phone})</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-emerald-800 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-slate-500 font-medium text-sm">No active or past orders found for this number.</p>
            </div>
          ) : (
            orders.map(ord => (
              <div key={ord.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                {/* Header info */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">Order #{ord.orderNumber}</span>
                    <span className="text-slate-400 ml-2">({new Date(ord.createdAt).toLocaleDateString('en-IN')})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-900 font-bold px-2.5 py-0.5 rounded-full">
                      {ord.status}
                    </span>
                    <span className="font-bold text-slate-900">₹{ord.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Status Progress Timeline */}
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-600 mb-2">Live Fulfillment Status:</div>
                  <div className="flex items-center justify-between relative">
                    {STATUS_STEPS.slice(0, 5).map((st, idx) => {
                      const isCompleted = STATUS_STEPS.indexOf(ord.status) >= idx;
                      return (
                        <div key={st} className="flex flex-col items-center z-10 text-[10px]">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                              isCompleted ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-400'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                          </div>
                          <span className={`mt-1 font-semibold ${isCompleted ? 'text-emerald-900' : 'text-slate-400'}`}>
                            {st}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items preview */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-700">Order Items:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ord.items.map(item => (
                      <div key={item.id} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 text-xs">
                        <img src={item.productImage} alt={item.productName} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <div className="font-bold text-slate-900 truncate">{item.productName}</div>
                          <div className="text-[11px] text-slate-500">{item.variantName} x {item.quantity}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
