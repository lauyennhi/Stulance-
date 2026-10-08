import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-white border shadow-lg transition-all transform animate-in fade-in slide-in-from-bottom-3 duration-200 ${
              isSuccess
                ? 'border-[#CDEFE0]'
                : isError
                ? 'border-[#FFD6CC]'
                : 'border-[#DCE8F8]'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && (
                <div className="w-6 h-6 rounded-full bg-[#CDEFE0] flex items-center justify-center text-[#0F5B39]">
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}
              {isError && (
                <div className="w-6 h-6 rounded-full bg-[#FFD6CC] flex items-center justify-center text-[#B83214]">
                  <AlertCircle className="w-4 h-4" />
                </div>
              )}
              {!isSuccess && !isError && (
                <div className="w-6 h-6 rounded-full bg-[#EAF2FC] flex items-center justify-center text-[#3D7DD8]">
                  <Info className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h5 className="font-heading font-semibold text-xs text-[#16243D] leading-tight">
                {toast.title}
              </h5>
              <p className="text-xs text-[#5B6B85] mt-1 leading-relaxed">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#5B6B85] hover:text-[#16243D] p-1 rounded-full hover:bg-slate-100 transition-colors shrink-0"
              aria-label="Đóng thông báo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
