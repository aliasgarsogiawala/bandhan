import React from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  description?: string;
  align?: "left" | "center" | "right";
  className?: string;
  badge?: string;
  /** "dark" inverts the type for sections painted on an ink surface. */
  tone?: "light" | "dark";
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  description,
  align = "center",
  className = "",
  badge,
  tone = "light",
}) => {
  const isDark = tone === "dark";
  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end",
  };

  const textAlignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const eyebrow = badge || subtitle;

  return (
    <div
      className={`flex flex-col max-w-3xl ${alignmentClasses[align]} ${className}`}
    >
      {eyebrow && (
        <span className={`mb-3 inline-flex max-w-full text-xs font-bold uppercase tracking-[0.16em] sm:mb-4 ${isDark ? "text-gold" : "text-accent"}`}>
          {eyebrow}
        </span>
      )}

      <h2 className={`max-w-2xl font-heading text-3xl font-bold leading-[1.12] tracking-[-0.025em] sm:text-4xl lg:text-[2.75rem] ${isDark ? "text-white" : "text-primary"}`}>
        {title}
      </h2>

      {description && (
        <p className={`mt-4 max-w-2xl font-sans text-sm leading-7 sm:text-base ${isDark ? "text-slate-300/85" : "text-foreground-muted"} ${textAlignmentClasses[align]}`}>
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
