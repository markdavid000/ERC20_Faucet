import React from "react";
import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  badge?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  centered = false,
  badge,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-12 ${centered ? "text-center" : "text-left"}`}
    >
      {badge && <div className={`mb-3 ${centered ? "flex justify-center" : ""}`}>{badge}</div>}
      <h2 className="font-headline text-3xl font-bold uppercase tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-on-surface-variant font-body mt-2 max-w-xl">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};
