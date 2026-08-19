import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "navy" | "coral" | "gold";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  children,
  isLoading = false,
  leftIcon,
  rightIcon,
  variant = "navy",
  size = "md",
  fullWidth = false,
  className = "",
  disabled,
  ...props
}) => {
  const variantClasses = {
    navy: "bg-primary text-white shadow-[0_8px_22px_-8px_rgba(7,32,60,0.55)] hover:bg-primary-light hover:shadow-[0_16px_34px_-10px_rgba(7,32,60,0.6)] focus:ring-primary-light",
    coral: "bg-accent text-white shadow-[0_8px_22px_-8px_rgba(254,79,79,0.6)] hover:bg-accent-dark hover:shadow-[0_16px_34px_-10px_rgba(254,79,79,0.65)] focus:ring-accent-light",
    gold: "bg-gold text-primary font-semibold shadow-[0_8px_22px_-8px_rgba(220,163,17,0.6)] hover:bg-gold-dark hover:shadow-[0_16px_34px_-10px_rgba(220,163,17,0.65)] focus:ring-gold-dark",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-xs font-semibold rounded-full",
    md: "px-6 py-3 text-sm font-semibold rounded-full",
    lg: "px-8 py-4 text-base font-bold rounded-full",
  };

  const widthClass = fullWidth ? "w-full" : "w-auto";

  return (
    <button
      disabled={disabled || isLoading}
      className={`group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden border border-transparent font-sans tracking-wide transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 motion-reduce:hover:translate-y-0 ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Sheen sweep on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover/btn:translate-x-full motion-reduce:hidden"
      />
      {!isLoading && leftIcon && <span className="relative z-10 flex-shrink-0">{leftIcon}</span>}
      <span className="relative z-10">{children}</span>
      {!isLoading && rightIcon && <span className="relative z-10 flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};

export default PrimaryButton;
