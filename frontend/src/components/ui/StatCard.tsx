import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  subValue?: string;
  progress?: number; // 0-100
  badge?: React.ReactNode;
  footer?: React.ReactNode;
  accentColor?: "primary" | "secondary" | "tertiary";
  delay?: number;
}

const accentMap = {
  primary: { text: "text-primary-dim", bar: "bg-primary", glow: "neon-glow-primary" },
  secondary: { text: "text-secondary", bar: "bg-secondary", glow: "neon-glow-secondary" },
  tertiary: { text: "text-tertiary-dim", bar: "bg-tertiary-dim", glow: "" },
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  subValue,
  progress,
  badge,
  footer,
  accentColor = "primary",
  delay = 0,
}) => {
  const accent = accentMap[accentColor];

  return (
    <GlassCard
      hover
      glow={accentColor === "secondary" ? "secondary" : "primary"}
      animate
      delay={delay}
      className="flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <p className="font-label text-xs uppercase tracking-widest text-outline">{label}</p>
          {badge && badge}
        </div>

        <h4 className="font-headline text-3xl md:text-4xl font-bold">
          {value}{" "}
          {unit && <span className={`${accent.text} text-xl md:text-2xl`}>{unit}</span>}
          {subValue && <span className="text-on-surface-variant text-xl"> {subValue}</span>}
        </h4>
      </div>

      {progress !== undefined && (
        <div className="mt-6 space-y-2">
          <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${accent.bar} ${accent.glow}`}
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: delay + 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      )}

      {footer && (
        <div className="mt-4 text-xs font-body text-on-surface-variant">{footer}</div>
      )}
    </GlassCard>
  );
};
