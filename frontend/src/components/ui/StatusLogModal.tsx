import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Filter } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { getRelativeTime, shortenAddress } from "../../lib/utils";
import { BLOCK_EXPLORER } from "../../config/contract";
import type { StatusLogEntry } from "../../types";

type FilterType = "all" | "claimed" | "minted" | "transfer" | "refill";

interface StatusLogModalProps {
  onClose: () => void;
}

const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Claims", value: "claimed" },
  { label: "Mints", value: "minted" },
  { label: "Transfers", value: "transfer" },
  { label: "Refills", value: "refill" },
];

const typeLabel = (entry: StatusLogEntry): string => {
  if (entry.type === "claimed") return `Claimed ${entry.amount} MTK`;
  if (entry.type === "minted") return `Minted ${entry.amount} MTK`;
  if (entry.type === "transfer") return `Transferred ${entry.amount} MTK`;
  return "Faucet Refilled";
};

const typeBorderColor: Record<StatusLogEntry["type"], string> = {
  claimed: "border-primary",
  minted: "border-secondary",
  transfer: "border-tertiary-dim",
  refill: "border-outline-variant",
};

export const StatusLogModal: React.FC<StatusLogModalProps> = ({ onClose }) => {
  const { statusLog } = useApp();
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = useMemo(
    () =>
      filter === "all" ? statusLog : statusLog.filter((e) => e.type === filter),
    [statusLog, filter]
  );

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="glass-card rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
            <h3 className="font-headline text-xl font-bold uppercase">
              Transaction Log
            </h3>
            <button
              onClick={onClose}
              className="text-outline hover:text-on-surface transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          <div className="px-6 pt-4 pb-2 flex items-center gap-2 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-outline flex-shrink-0" />
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={[
                  "px-3 py-1 rounded-full font-label text-[10px] uppercase tracking-widest transition-all",
                  filter === opt.value
                    ? "bg-primary text-on-primary"
                    : "border border-outline-variant/30 text-on-surface-variant hover:border-primary/40 hover:text-primary",
                ].join(" ")}
              >
                {opt.label}
              </button>
            ))}
            <span className="ml-auto text-[10px] text-outline font-label">
              {filtered.length} entries
            </span>
          </div>

          {/* Log list */}
          <div className="overflow-y-auto flex-1 px-6 pb-6 space-y-3 mt-2">
            <AnimatePresence initial={false}>
              {filtered.length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-on-surface-variant font-body text-sm py-8"
                >
                  No {filter === "all" ? "" : filter} transactions yet.
                </motion.p>
              )}
              {filtered.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: i * 0.03 }}
                  className={[
                    "border-l-2 pl-4 py-2",
                    entry.type === "refill" ? "opacity-60" : "",
                    typeBorderColor[entry.type],
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-body text-on-surface font-medium">
                        {typeLabel(entry)}
                      </p>
                      {entry.address && (
                        <p className="text-xs font-body text-on-surface-variant truncate mt-0.5">
                          {shortenAddress(entry.address, 6)}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-[10px] font-label text-outline uppercase">
                        {getRelativeTime(entry.timestamp)}
                      </span>
                      {entry.txHash && (
                        <a
                          href={`${BLOCK_EXPLORER}/tx/${entry.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-primary hover:underline flex items-center gap-0.5 font-label uppercase"
                        >
                          Tx <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
