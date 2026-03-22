import React from "react";
import { motion } from "framer-motion";
import { useApp } from "../../context/AppContext";
import { StatCard } from "../ui/StatCard";
import { Badge } from "../ui/Badge";
import { SectionHeader } from "../ui/SectionHeader";
import { formatPercentage } from "../../lib/utils";
import { Wallet, Coins, Clock, TrendingUp } from "lucide-react";

export const StatsSection: React.FC = () => {
  const { contractStats, statsLoading, userStats, isConnected, address } = useApp();

  const totalMinted = parseFloat(contractStats?.totalSupply ?? "0");
  const maxSupply = parseFloat(contractStats?.maxSupply ?? "10000000");
  const progress = formatPercentage(totalMinted, maxSupply);

  const displayTotal = contractStats
    ? totalMinted >= 1_000_000
      ? `${(totalMinted / 1_000_000).toFixed(1)}M`
      : `${(totalMinted / 1_000).toFixed(1)}K`
    : "—";

  return (
    <section className="mb-32" id="stats">
      <SectionHeader
        title="Network Pulse"
        subtitle="Live contract statistics from the Synthetic Void."
      />

      {/* Global Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Max Supply */}
        <StatCard
          label="Max Supply"
          value={statsLoading ? "…" : "10M"}
          unit="MTK"
          footer="Fixed Protocol Limit"
          accentColor="primary"
          delay={0}
        />

        {/* Total Minted */}
        <StatCard
          label="Total Minted"
          value={statsLoading ? "…" : displayTotal}
          subValue="/ 10M"
          progress={statsLoading ? 0 : progress}
          footer={`${progress.toFixed(1)}% of ecosystem circulating`}
          accentColor="primary"
          delay={0.1}
        />

        {/* MTK Price / Status */}
        <StatCard
          label="MTK Price"
          value="Ethereal"
          badge={<Badge variant="secondary" pulseDot>Testnet</Badge>}
          footer={
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              Market Value Pending
            </span>
          }
          accentColor="secondary"
          delay={0.2}
        />
      </div>

      {/* Additional read stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Claim Amount */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:border-primary/20 transition-all"
        >
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Coins className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-label text-xs uppercase tracking-widest text-outline mb-1">Claim Amount</p>
            <p className="font-headline text-2xl font-bold">
              {statsLoading ? "…" : contractStats?.claimAmount ?? "100"}{" "}
              <span className="text-primary-dim text-lg">MTK</span>
            </p>
          </div>
        </motion.div>

        {/* Cooldown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:border-primary/20 transition-all"
        >
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-label text-xs uppercase tracking-widest text-outline mb-1">Cooldown Period</p>
            <p className="font-headline text-2xl font-bold">
              24 <span className="text-primary-dim text-lg">Hours</span>
            </p>
          </div>
        </motion.div>

        {/* User Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:border-secondary/20 transition-all"
        >
          <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
            <Wallet className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <p className="font-label text-xs uppercase tracking-widest text-outline mb-1">Your Balance</p>
            {isConnected && address ? (
              <p className="font-headline text-2xl font-bold">
                {userStats?.balance ?? "—"}{" "}
                <span className="text-secondary text-lg">MTK</span>
              </p>
            ) : (
              <p className="text-on-surface-variant font-body text-sm">Connect wallet to view</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Claimable amount for connected user */}
      {isConnected && userStats && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-tertiary-container/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-tertiary-dim" />
            </div>
            <div>
              <p className="font-label text-xs uppercase tracking-widest text-outline mb-1">Claimable Amount</p>
              <p className="font-headline text-2xl font-bold">
                {userStats.canClaim ? (
                  <span className="text-tertiary-dim">100 MTK — Ready!</span>
                ) : (
                  <span className="text-on-surface-variant">0 MTK — On Cooldown</span>
                )}
              </p>
            </div>
          </div>
          <Badge variant={userStats.canClaim ? "success" : "outline"} dot={!userStats.canClaim} pulseDot={userStats.canClaim}>
            {userStats.canClaim ? "Available Now" : "Cooling Down"}
          </Badge>
        </motion.div>
      )}
    </section>
  );
};
