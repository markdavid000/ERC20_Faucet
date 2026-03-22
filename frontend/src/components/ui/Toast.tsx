import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info, X, ExternalLink } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { BLOCK_EXPLORER } from "../../config/contract";
import type { ToastType } from "../../types";

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-tertiary-dim flex-shrink-0" />,
  error: <XCircle className="w-5 h-5 text-error flex-shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />,
  info: <Info className="w-5 h-5 text-primary flex-shrink-0" />,
};

const borderColors: Record<ToastType, string> = {
  success: "border-l-tertiary-dim",
  error: "border-l-error",
  warning: "border-l-yellow-400",
  info: "border-l-primary",
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-6 right-4 md:right-6 z-[200] flex flex-col gap-3 w-[calc(100vw-2rem)] max-w-sm pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className={[
              "glass-card rounded-xl p-4 border-l-4 pointer-events-auto",
              "flex items-start gap-3 min-w-0",
              borderColors[toast.type],
            ].join(" ")}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <p className="font-label text-sm font-bold text-on-surface">{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-on-surface-variant font-body mt-0.5 truncate">{toast.message}</p>
              )}
              {toast.txHash && (
                <a
                  href={`${BLOCK_EXPLORER}/tx/${toast.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                >
                  View Tx <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-outline hover:text-on-surface transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
