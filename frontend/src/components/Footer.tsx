import React from "react";
import { motion } from "framer-motion";

const FOOTER_LINKS = ["Contract"];

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-12 px-8 border-t border-[#44484f]/15 bg-[#0f141a]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-lg font-bold text-slate-200 font-headline"
        >
          MarkToken <span className="text-primary">Faucet</span>
        </motion.div>

        <div className="flex gap-8">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link}
              href="https://sepolia-blockscout.lisk.com/address/0x9A1132a0184f63F86B75Ef392Ad732A7959688b1#code"
              target="_blank"
              className="font-body text-xs tracking-widest uppercase text-slate-500 hover:text-primary-fixed transition-colors"
            >
              {link}
            </a>
          ))}
        </div>

        <div className="font-body text-xs tracking-widest uppercase text-slate-500">
          © {new Date().getFullYear()} MarkToken Faucet. The Synthetic Void.
        </div>
      </div>
    </footer>
  );
};
