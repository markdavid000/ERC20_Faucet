import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  gradient?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-br from-primary to-primary-container text-on-primary font-black shadow-xl hover:shadow-[0_0_30px_rgba(143,245,255,0.25)]",
  secondary:
    "bg-secondary text-on-secondary font-bold hover:opacity-90",
  outline:
    "border border-outline-variant text-on-surface font-bold hover:bg-surface-container hover:border-primary/40",
  ghost:
    "text-on-surface-variant font-medium hover:text-on-surface hover:bg-surface-container/50",
  danger:
    "bg-error-container text-on-error-container font-bold hover:opacity-90",
};

const gradientVariantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-primary to-secondary text-[#003f43] font-black shadow-[0_0_30px_rgba(143,245,255,0.15)] hover:shadow-[0_0_40px_rgba(210,119,255,0.25)]",
  secondary: variantClasses.secondary,
  outline: variantClasses.outline,
  ghost: variantClasses.ghost,
  danger: variantClasses.danger,
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "py-1.5 px-4 text-xs rounded-lg",
  md: "py-2.5 px-6 text-sm rounded-xl",
  lg: "py-4 px-10 text-base rounded-xl",
  xl: "py-5 px-12 text-lg rounded-xl",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  loadingText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  gradient = false,
  children,
  disabled,
  className = "",
  ...props
}) => {
  const variantClass = gradient
    ? gradientVariantClasses[variant]
    : variantClasses[variant];

  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileHover={isDisabled ? {} : { scale: 1.02 }}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={[
        "inline-flex items-center justify-center gap-2",
        "font-headline uppercase tracking-tighter",
        "transition-all duration-300",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100",
        variantClass,
        sizeClasses[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={isDisabled}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{loadingText ?? "Processing…"}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
};
