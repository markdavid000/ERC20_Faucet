import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Wallet,
  ChevronDown,
  LogOut,
  Copy,
  ExternalLink,
} from "lucide-react";
import { Button } from "./ui/Button";
import { useWallet } from "../hooks/useWallet";
import { shortenAddress } from "../lib/utils";
import { BLOCK_EXPLORER } from "../config/contract";

const NAV_LINKS = [
  { label: "Stats", href: "#stats" },
  { label: "Faucet", href: "#faucet" },
  { label: "Transfer", href: "#transfer" },
  { label: "Admin", href: "#admin" },
];

export const Navbar: React.FC = () => {
  const { address, isConnected, isConnecting, connect, disconnect } =
    useWallet();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Stats");
  const [copied, setCopied] = useState(false);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = e.target.id;
            const link = NAV_LINKS.find(
              (l) => l.href === `#${id}` || (id === "" && l.label === "Hero")
            );
            if (link) setActiveSection(link.label);
          }
        });
      },
      { threshold: 0.3 }
    );
    document
      .querySelectorAll("section[id]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={[
          "fixed top-0 w-full z-50 transition-all duration-300",
          scrolled
            ? "bg-[#0b0e14]/80 backdrop-blur-xl border-b border-[#44484f]/20 shadow-[0_0_40px_rgba(143,245,255,0.04)]"
            : "bg-[#0b0e14]/40 backdrop-blur-xl border-b border-[#44484f]/15",
        ].join(" ")}
      >
        <div className="flex justify-between items-center px-6 md:px-8 h-20 max-w-7xl mx-auto">
          {/* Logo */}
          <motion.a
            href="#"
            className="text-2xl font-black tracking-tighter text-primary font-headline"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            MarkToken
          </motion.a>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 items-center">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={[
                  "font-label tracking-tight text-sm uppercase transition-colors relative group",
                  activeSection === link.label
                    ? "text-primary"
                    : "text-slate-400 hover:text-primary",
                ].join(" ")}
              >
                {link.label}
                <span
                  className={[
                    "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                    activeSection === link.label
                      ? "w-full"
                      : "w-0 group-hover:w-full",
                  ].join(" ")}
                />
              </a>
            ))}
          </div>

          {/* Wallet Button */}
          <div className="hidden md:block relative">
            {isConnected && address ? (
              <div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setWalletMenuOpen((p) => !p)}
                  className="flex items-center gap-2 bg-surface-container border border-outline-variant/30 hover:border-primary/40 text-on-surface font-label text-sm py-2 px-4 rounded-xl transition-all"
                >
                  <span className="h-2 w-2 rounded-full bg-tertiary-dim animate-pulse" />
                  {shortenAddress(address)}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      walletMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </motion.button>

                <AnimatePresence>
                  {walletMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-12 w-52 glass-card rounded-xl overflow-hidden z-50"
                    >
                      <button
                        onClick={copyAddress}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body"
                      >
                        <Copy className="w-4 h-4" />
                        {copied ? "Copied!" : "Copy Address"}
                      </button>
                      <a
                        href={`${BLOCK_EXPLORER}/address/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View on Explorer
                      </a>
                      <div className="border-t border-outline-variant/20" />
                      <button
                        onClick={() => {
                          disconnect();
                          setWalletMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-error hover:bg-error-container/10 transition-colors font-body"
                      >
                        <LogOut className="w-4 h-4" />
                        Disconnect
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Button
                variant="primary"
                size="md"
                loading={isConnecting}
                loadingText="Connecting…"
                leftIcon={<Wallet className="w-4 h-4" />}
                onClick={connect}
                className="bg-gradient-to-r from-primary to-primary-container"
              >
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-on-surface p-2"
            onClick={() => setMobileOpen((p) => !p)}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-0 right-0 z-40 bg-[#0b0e14]/95 backdrop-blur-xl border-b border-[#44484f]/20 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => setMobileOpen(false)}
                  className={[
                    "font-label text-sm uppercase tracking-widest py-2 border-b border-outline-variant/10",
                    activeSection === link.label
                      ? "text-primary"
                      : "text-slate-400",
                  ].join(" ")}
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="pt-2">
                {isConnected && address ? (
                  <div className="space-y-2">
                    <p className="text-xs text-on-surface-variant font-body">
                      {shortenAddress(address, 8)}
                    </p>
                    <Button
                      variant="danger"
                      size="sm"
                      leftIcon={<LogOut className="w-3.5 h-3.5" />}
                      onClick={disconnect}
                    >
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    loading={isConnecting}
                    leftIcon={<Wallet className="w-4 h-4" />}
                    onClick={connect}
                  >
                    Connect Wallet
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for wallet menu */}
      {walletMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setWalletMenuOpen(false)}
        />
      )}
    </>
  );
};
