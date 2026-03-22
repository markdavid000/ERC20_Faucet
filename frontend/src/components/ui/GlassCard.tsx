import React from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "primary" | "secondary" | "none";
  padding?: "sm" | "md" | "lg" | "xl" | "none";
  animate?: boolean;
  delay?: number;
  onClick?: () => void;
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
  xl: "p-8 md:p-12",
};

const glowMap = {
  none: "",
  primary: "hover:border-primary/30 hover:shadow-[0_0_30px_rgba(143,245,255,0.08)]",
  secondary: "hover:border-secondary/30 hover:shadow-[0_0_30px_rgba(210,119,255,0.08)]",
};

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  hover = false,
  glow = "none",
  padding = "lg",
  animate = false,
  delay = 0,
  onClick,
}) => {
  const base = [
    "glass-card rounded-2xl",
    paddingMap[padding],
    hover ? "transition-all duration-300" : "",
    glow !== "none" ? glowMap[glow] : "",
    onClick ? "cursor-pointer" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
        className={base}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={base} onClick={onClick}>
      {children}
    </div>
  );
};
