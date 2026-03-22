import React from "react";

type BadgeVariant = "primary" | "secondary" | "tertiary" | "error" | "outline" | "success";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  pulseDot?: boolean;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: "bg-primary/10 text-primary border border-primary/20",
  secondary: "bg-secondary-container/20 text-secondary border border-secondary-container/30",
  tertiary: "bg-tertiary-container/10 text-on-tertiary-container border border-tertiary-container/20",
  error: "bg-error-container/20 text-error border border-error/20",
  outline: "border border-outline-variant text-on-surface-variant",
  success: "bg-tertiary-container/10 text-tertiary-dim border border-tertiary-container/20",
};

const dotColors: Record<BadgeVariant, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  tertiary: "bg-tertiary-dim",
  error: "bg-error",
  outline: "bg-outline",
  success: "bg-tertiary-dim",
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  dot = false,
  pulseDot = false,
  className = "",
}) => {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full",
        "font-label text-[10px] font-bold uppercase tracking-widest",
        variantClasses[variant],
        className,
      ].join(" ")}
    >
      {(dot || pulseDot) && (
        <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]} ${pulseDot ? "animate-pulse" : ""}`} />
      )}
      {children}
    </span>
  );
};
