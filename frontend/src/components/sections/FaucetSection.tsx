import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Clock, CheckCircle, ExternalLink, AlertCircle, Timer } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { SectionHeader } from "../ui/SectionHeader";
import { useApp } from "../../context/AppContext";
import { useRequestToken } from "../../hooks/useRequestToken";
import { getRelativeTime, shortenAddress, formatCountdown } from "../../lib/utils";
import { BLOCK_EXPLORER } from "../../config/contract";

export const FaucetSection: React.FC = () => {
  const { address, isConnected, userStats, cooldownSeconds, statusLog } = useApp();
  const { loading, success, txHash, error, requestToken, reset } = useRequestToken();

  const [manualAddress, setManualAddress] = useState("");
  const [addressError, setAddressError] = useState("");

  // Pre-fill address when wallet connects
  useEffect(() => {
    if (address) setManualAddress(address);
  }, [address]);

  const handleRequest = async () => {
    setAddressError("");
    if (!manualAddress || manualAddress.trim().length < 10) {
      setAddressError("Please enter a valid wallet address.");
      return;
    }
    await requestToken();
  };

  const handleReset = () => {
    reset();
  };

  const isCoolingDown = userStats && !userStats.canClaim && cooldownSeconds > 0;

  return (
    <section className="mb-32" id="faucet">
      <SectionHeader title="Faucet Interface" subtitle="Input your address to receive testnet assets." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Faucet Card */}
        <GlassCard className="lg:col-span-2 relative overflow-hidden" padding="xl">
          {/* BG icon */}
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Droplets className="w-28 h-28 text-primary" />
          </div>

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h2 className="font-headline text-3xl font-bold uppercase tracking-tight mb-2">
                Faucet Interface
              </h2>
              <p className="text-on-surface-variant font-body">
                Input your address to receive testnet assets.
              </p>
            </div>

            {/* Cooldown badge */}
            <div className="flex items-center gap-3 bg-secondary-container/20 px-4 py-2 rounded-full border border-secondary-container/30">
              <Clock className="w-4 h-4 text-secondary flex-shrink-0" />
              {isCoolingDown ? (
                <span className="text-secondary font-label text-xs font-bold uppercase tracking-widest">
                  Retry in {formatCountdown(cooldownSeconds)}
                </span>
              ) : (
                <span className="text-tertiary-dim font-label text-xs font-bold uppercase tracking-widest">
                  Ready to Claim
                </span>
              )}
            </div>
          </div>

          <div className="space-y-8">
            {/* Input */}
            <Input
              label="Wallet Address"
              placeholder="0x..."
              value={manualAddress}
              onChange={(e) => {
                setManualAddress(e.target.value);
                setAddressError("");
              }}
              error={addressError}
              accentColor="primary"
            />

            {/* Cooldown Warning */}
            <AnimatePresence>
              {isCoolingDown && isConnected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-error-container/10 border border-error/20"
                >
                  <Timer className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-error font-bold text-sm font-label">Cooldown Active</p>
                    <p className="text-on-surface-variant text-xs font-body mt-0.5">
                      You can claim again in{" "}
                      <span className="text-primary font-semibold font-mono">
                        {formatCountdown(cooldownSeconds)}
                      </span>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Not Connected Warning */}
            <AnimatePresence>
              {!isConnected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-surface-container border border-outline-variant/20"
                >
                  <AlertCircle className="w-5 h-5 text-outline flex-shrink-0 mt-0.5" />
                  <p className="text-on-surface-variant text-sm font-body">
                    Connect your wallet to enable on-chain claiming.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Request Button */}
            <Button
              variant="primary"
              size="xl"
              fullWidth
              loading={loading}
              loadingText="Requesting Tokens…"
              disabled={loading || (isCoolingDown ? true : false)}
              onClick={handleRequest}
            >
              Request Tokens
            </Button>

            {/* Error state */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-error-container/10 border border-error/20"
                >
                  <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-error font-bold text-sm">Transaction Failed</p>
                    <p className="text-on-surface-variant text-xs truncate">{error}</p>
                  </div>
                  <button onClick={handleReset} className="text-xs text-outline hover:text-on-surface uppercase tracking-wider font-label">
                    Dismiss
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success state */}
            <AnimatePresence>
              {success && txHash && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-tertiary-container/10 border border-tertiary-container/20"
                >
                  <div className="h-10 w-10 rounded-full bg-tertiary-container flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-on-tertiary" />
                  </div>
                  <div>
                    <p className="text-on-tertiary font-bold text-sm font-label">Success!</p>
                    <p className="text-on-surface-variant text-xs font-body">
                      100 MTK sent to {shortenAddress(manualAddress)}
                    </p>
                  </div>
                  <a
                    href={`${BLOCK_EXPLORER}/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-primary text-xs font-label uppercase hover:underline flex items-center gap-1"
                  >
                    View Tx <ExternalLink className="w-3 h-3" />
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassCard>

        {/* Status Log */}
        <GlassCard padding="lg">
          <h3 className="font-headline text-xl font-bold uppercase mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Status Log
          </h3>
          <div className="space-y-5">
            {statusLog.slice(0, 6).map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                className={[
                  "border-l-2 pl-4 py-1",
                  entry.type === "refill" ? "border-outline-variant opacity-50" : "border-outline-variant",
                ].join(" ")}
              >
                <p className="text-xs font-label text-outline uppercase mb-1">
                  {getRelativeTime(entry.timestamp)}
                </p>
                <p className="text-sm font-body text-on-surface">
                  {entry.type === "claimed" && `Tokens Requested (${entry.amount} MTK)`}
                  {entry.type === "minted" && `Tokens Minted (${entry.amount} MTK)`}
                  {entry.type === "transfer" && `Transfer (${entry.amount} MTK)`}
                  {entry.type === "refill" && "Faucet Refilled"}
                </p>
                {entry.address && (
                  <p className="text-xs font-body text-on-surface-variant truncate">
                    {shortenAddress(entry.address)}
                  </p>
                )}
                {entry.txHash && (
                  <a
                    href={`${BLOCK_EXPLORER}/tx/${entry.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5"
                  >
                    Tx <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </motion.div>
            ))}

            {statusLog.length === 0 && (
              <p className="text-on-surface-variant text-sm font-body text-center py-4">
                No activity yet.
              </p>
            )}
          </div>
        </GlassCard>
      </div>
    </section>
  );
};
