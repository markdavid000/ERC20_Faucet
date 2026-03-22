import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  accentColor?: "primary" | "secondary";
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  accentColor = "primary",
  className = "",
  id,
  ...props
}) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  const focusBorder =
    accentColor === "secondary"
      ? "focus:border-secondary"
      : "focus:border-primary";

  return (
    <div className="relative w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block font-label text-xs uppercase tracking-widest text-outline mb-3"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          "w-full bg-transparent border-b py-4 font-body text-lg",
          "focus:outline-none transition-all duration-200",
          "placeholder:text-surface-variant/40 text-on-surface",
          error
            ? "border-error/60 focus:border-error"
            : `border-outline-variant/30 ${focusBorder}`,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
      {error && (
        <p className="mt-2 text-xs text-error font-body">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-2 text-xs text-on-surface-variant font-body">{hint}</p>
      )}
    </div>
  );
};
