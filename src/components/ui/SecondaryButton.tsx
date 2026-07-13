import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "outline-navy" | "outline-coral" | "ghost" | "glass";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const SecondaryButton: React.FC<ButtonProps> = ({
  children,
  isLoading = false,
  leftIcon,
  rightIcon,
  variant = "outline-navy",
  size = "md",
  fullWidth = false,
  className = "",
  disabled,
  ...props
}) => {
  const variantClasses = {
    "outline-navy": "border-primary text-primary hover:bg-primary/5 hover:text-primary-dark focus:ring-primary-light",
    "outline-coral": "border-accent text-accent hover:bg-accent/5 hover:text-accent-dark focus:ring-accent-light",
    ghost: "border-transparent text-primary hover:bg-primary/5 hover:text-primary-dark focus:ring-primary-light",
    glass: "border-white/30 text-white bg-white/10 backdrop-blur-md hover:bg-white/20 hover:border-white/50 focus:ring-white",
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
      className={`relative inline-flex items-center justify-center gap-2 border font-sans tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
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

      {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span className="relative z-10">{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};

export default SecondaryButton;
