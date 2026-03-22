import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SendHorizonal, CheckCircle, AlertCircle, ExternalLink, TriangleAlert } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { SectionHeader } from "../ui/SectionHeader";
import { useTransferToken } from "../../hooks/useTransferToken";
import { useApp } from "../../context/AppContext";
import { shortenAddress } from "../../lib/utils";
import { BLOCK_EXPLORER } from "../../config/contract";

export const TransferSection: React.FC = () => {
  const { isConnected, userStats } = useApp();
  const { loading, success, txHash, error, transfer, reset } = useTransferToken();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [recipientError, setRecipientError] = useState("");
  const [amountError, setAmountError] = useState("");

  const handleTransfer = async () => {
    setRecipientError("");
    setAmountError("");
    let valid = true;
    if (!recipient.trim()) {
      setRecipientError("Recipient address is required.");
      valid = false;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setAmountError("Amount must be greater than 0.");
      valid = false;
    }
    if (!valid) return;
    await transfer(recipient, amount);
  };

  const handleReset = () => {
    reset();
    setRecipient("");
    setAmount("");
  };

  return (
    <section className="mb-32" id="transfer">
      <SectionHeader title="Void Transfer" subtitle="Beam your assets across the synthetic network." />

      <GlassCard padding="xl" className="relative overflow-hidden">
        {/* BG icon */}
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <SendHorizonal className="w-28 h-28" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <div className="space-y-8">
            {!isConnected && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-container border border-outline-variant/20">
                <AlertCircle className="w-5 h-5 text-outline flex-shrink-0 mt-0.5" />
                <p className="text-on-surface-variant text-sm font-body">
                  Connect your wallet to transfer tokens.
                </p>
              </div>
            )}

            <Input
              label="Recipient Address"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => { setRecipient(e.target.value); setRecipientError(""); }}
              error={recipientError}
              disabled={!isConnected}
            />

            <Input
              label="Amount (MTK)"
              placeholder="0.00"
              type="number"
              min="0"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setAmountError(""); }}
              error={amountError}
              hint={userStats ? `Your balance: ${userStats.balance} MTK` : undefined}
              disabled={!isConnected}
            />

            <Button
              variant="primary"
              size="xl"
              fullWidth
              gradient
              loading={loading}
              loadingText="Transferring…"
              disabled={loading || !isConnected}
              onClick={handleTransfer}
            >
              Transfer Tokens
            </Button>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-error-container/10 border border-error/20"
                >
                  <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-error font-bold text-sm">Transfer Failed</p>
                    <p className="text-on-surface-variant text-xs truncate">{error}</p>
                  </div>
                  <button onClick={reset} className="text-xs text-outline hover:text-on-surface uppercase font-label">
                    Dismiss
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success */}
            <AnimatePresence>
              {success && txHash && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-tertiary-container/10 border border-tertiary-container/20"
                >
                  <div className="h-10 w-10 rounded-full bg-tertiary-container flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-on-tertiary" />
                  </div>
                  <div>
                    <p className="text-on-tertiary font-bold text-sm font-label">Transfer Complete!</p>
                    <p className="text-on-surface-variant text-xs font-body">
                      {amount} MTK sent to {shortenAddress(recipient)}
                    </p>
                  </div>
                  <a
                    href={`${BLOCK_EXPLORER}/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-primary text-xs font-label uppercase hover:underline flex items-center gap-1"
                    onClick={handleReset}
                  >
                    View Tx <ExternalLink className="w-3 h-3" />
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Info Panel */}
          <div className="bg-surface-container/50 rounded-2xl p-8 border border-outline-variant/20">
            <h4 className="font-headline font-bold mb-6 uppercase text-primary-dim flex items-center gap-2">
              <TriangleAlert className="w-4 h-4" />
              Network Protocol
            </h4>
            <ul className="space-y-5 text-sm text-on-surface-variant font-body">
              {[
                "Transfers are irreversible once broadcast to the void.",
                "Ensure the recipient address supports MTK on this network.",
                "Standard network gas fees apply for all peer-to-peer transfers.",
                "Always double-check the recipient address before confirming.",
              ].map((text, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="flex gap-3"
                >
                  <span className="text-primary mt-0.5 flex-shrink-0">▸▸</span>
                  <span>{text}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </GlassCard>
    </section>
  );
};
