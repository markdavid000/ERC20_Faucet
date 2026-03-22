import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Badge } from "../ui/Badge";
import { SectionHeader } from "../ui/SectionHeader";
import { useMintMTK } from "../../hooks/useMintMTK";
import { useApp } from "../../context/AppContext";
import { shortenAddress } from "../../lib/utils";
import { BLOCK_EXPLORER } from "../../config/contract";

export const AdminSection: React.FC = () => {
  const { isConnected, address } = useApp();
  const { loading, success, txHash, error, mint, reset } = useMintMTK();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [recipientError, setRecipientError] = useState("");
  const [amountError, setAmountError] = useState("");

  const handleMint = async () => {
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
    await mint(recipient, amount);
  };

  const handleReset = () => {
    reset();
    setRecipient("");
    setAmount("");
  };

  return (
    <section className="mb-32" id="admin">
      <SectionHeader
        title="Void Architect Panel"
        subtitle="Owner-only minting interface."
        badge={<Badge variant="secondary">Authorized Access Only</Badge>}
      />

      <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-outline-variant/50 via-transparent to-outline-variant/50">
        <div className="bg-surface-container-low rounded-2xl p-8 md:p-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between gap-6 mb-12">
            <div>
              <Badge variant="secondary" className="mb-4">Authorized Access Only</Badge>
              <h2 className="font-headline text-3xl font-bold uppercase tracking-tight">
                Void Architect Panel
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-outline" />
              {isConnected && address ? (
                <span className="text-on-surface-variant font-body text-sm">
                  Connected as{" "}
                  <span className="text-secondary font-semibold">{shortenAddress(address)}</span>
                </span>
              ) : (
                <span className="text-on-surface-variant font-body text-sm">Not Connected</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mint form */}
            <div className="space-y-8">
              {!isConnected && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-container border border-outline-variant/20">
                  <AlertCircle className="w-5 h-5 text-outline flex-shrink-0 mt-0.5" />
                  <p className="text-on-surface-variant text-sm font-body">
                    Connect your wallet to access admin functions.
                  </p>
                </div>
              )}

              <Input
                label="Recipient Address"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => { setRecipient(e.target.value); setRecipientError(""); }}
                error={recipientError}
                accentColor="secondary"
                disabled={!isConnected}
              />

              <Input
                label="Amount (MTK)"
                placeholder="1000"
                type="number"
                min="0"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setAmountError(""); }}
                error={amountError}
                accentColor="secondary"
                disabled={!isConnected}
              />

              <Button
                variant="secondary"
                size="lg"
                loading={loading}
                loadingText="Minting…"
                disabled={loading || !isConnected}
                onClick={handleMint}
                className="px-12"
              >
                Mint Tokens
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
                      <p className="text-error font-bold text-sm">Mint Failed</p>
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
                      <p className="text-on-tertiary font-bold text-sm font-label">Mint Successful!</p>
                      <p className="text-on-surface-variant text-xs font-body">
                        {amount} MTK minted to {shortenAddress(recipient)}
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

            {/* Security info */}
            <div className="glass-card rounded-xl p-6 border-l-4 border-secondary">
              <h4 className="font-headline font-bold mb-4 uppercase text-secondary flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Security Protocol
              </h4>
              <ul className="space-y-4 text-sm text-on-surface-variant font-body">
                {[
                  "Only addresses with the MINTER_ROLE can execute these transactions.",
                  "All minting events are broadcasted to the public ledger for auditability.",
                  "The minting function respects the Max Supply constant in the MTK contract.",
                ].map((text, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex gap-3"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>{text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
