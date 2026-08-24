import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-container"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={`toast-item-${toast.id}`}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium transition-all shadow-md ${
            toast.type === 'success'
              ? 'bg-[#1A1A1A] text-white border-neutral-800'
              : toast.type === 'error'
              ? 'bg-rose-900 text-white border-rose-700'
              : 'bg-neutral-900 text-white border-neutral-800'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#2D5A3D] shrink-0 fill-green-400/20" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-[#E85D5D] shrink-0" />}
          <span className="flex-1 text-xs sm:text-sm">{toast.text}</span>
        </div>
      ))}
    </div>
  );
};
