import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
  ExternalLink,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { BLOCK_EXPLORER } from "../../config/contract";
import type { ToastType } from "../../types";

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-4 h-4 text-tertiary-dim flex-shrink-0" />,
  error: <XCircle className="w-4 h-4 text-error flex-shrink-0" />,
  warning: <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />,
  info: <Info className="w-4 h-4 text-primary flex-shrink-0" />,
};

const borderColors: Record<ToastType, string> = {
  success: "border-l-tertiary-dim",
  error: "border-l-error",
  warning: "border-l-yellow-400",
  info: "border-l-primary",
};

// Fix #8: top-right position, just below the 80px navbar (h-20 = 5rem)
export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div
      style={{ top: "5.5rem" }} // sits just below the 80px (5rem) navbar
      className="fixed right-4 md:right-6 z-[200] flex flex-col gap-2 w-[calc(100vw-2rem)] max-w-xs pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 60, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className={[
              "glass-card rounded-xl p-3.5 border-l-4 pointer-events-auto",
              "flex items-start gap-2.5 min-w-0 shadow-xl",
              borderColors[toast.type],
            ].join(" ")}
          >
            <div className="mt-0.5">{icons[toast.type]}</div>
            <div className="flex-1 min-w-0">
              <p className="font-label text-xs font-bold text-on-surface leading-snug">
                {toast.title}
              </p>
              {toast.message && (
                <p className="text-[11px] text-on-surface-variant font-body mt-0.5 break-words">
                  {toast.message}
                </p>
              )}
              {toast.txHash && (
                <a
                  href={`${BLOCK_EXPLORER}/tx/${toast.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline mt-1 font-label uppercase"
                >
                  View Tx <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-outline hover:text-on-surface transition-colors mt-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
