import React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Button } from "../ui/Button";
import { useWallet } from "../../hooks/useWallet";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

export const HeroSection: React.FC = () => {
  const { connect, isConnected, isConnecting } = useWallet();

  return (
    <section className="mb-32 flex flex-col md:flex-row items-center gap-12 relative pt-4">
      {/* Background glow */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Text */}
      <motion.div
        className="flex-1 text-center md:text-left z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <span className="inline-block mb-4 font-label text-[10px] uppercase tracking-[0.3em] text-primary/70 border border-primary/20 px-3 py-1.5 rounded-full bg-primary/5">
            Synthetic Void · Testnet
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="font-headline text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-none uppercase"
        >
          Claim{" "}
          <span className="text-primary neon-text-glow relative inline-block">
            MTK
            <motion.span
              className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-primary to-secondary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
            />
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="font-body text-on-surface-variant text-lg md:text-xl max-w-xl mb-10 leading-relaxed"
        >
          Experience the Synthetic Void. Claim your{" "}
          <span className="text-primary font-semibold">100 MTK</span> tokens
          every 24 hours. A gateway to the next generation of decentralized
          liquidity.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-wrap gap-4 justify-center md:justify-start"
        >
          {!isConnected && (
            <Button
              variant="primary"
              size="lg"
              loading={isConnecting}
              loadingText="Connecting…"
              onClick={connect}
              className="neon-glow-primary"
            >
              Connect Wallet
            </Button>
          )}
          {isConnected && (
            <Button
              variant="outline"
              size="lg"
              onClick={() =>
                document
                  .getElementById("faucet")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Go to Faucet
            </Button>
          )}
        </motion.div>
      </motion.div>

      {/* Hero Image */}
      <motion.div
        className="flex-1 w-full max-w-md"
        initial={{ opacity: 0, x: 40, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      >
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
          <div className="relative glass-card rounded-2xl p-1 overflow-hidden">
            <img
              className="w-full h-80 object-cover rounded-xl"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzNTf0NR-a_WGHBEEuYjQ6ECPkFP4KT-C6JI9s-7YdCcHdAA87oGunLRoIELmYf8O26nx-zeej4Tr9hv6CjSD00znIPHyawsaMS1ImF0Rkf01e-P70AG7XQY8_J7WWdeotYiJbiim38IqtZr3C-qyXzLinqWwO-O8CYLVDgxLQjFYnzGNtmpFemeaGwbS6AR8rlWW8hwzlpqG2RGlv1fz2X8FzNy_DvvQ3RIasc_u8O7jNOFCgim_4PHiA9t35YvSDlaYBBm4MZ8M"
              alt="Abstract 3D digital token floating in dark space"
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5 rounded-xl pointer-events-none"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};
