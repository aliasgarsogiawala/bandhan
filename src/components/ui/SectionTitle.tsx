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
        <span className={`mb-4 inline-flex max-w-full items-center gap-2 text-[0.64rem] font-semibold uppercase tracking-[0.22em] sm:mb-5 sm:gap-3 sm:tracking-[0.3em] ${isDark ? "text-gold" : "text-accent"}`}>
          <span className={`h-px w-6 shrink-0 sm:w-8 ${isDark ? "bg-gold/50" : "bg-accent/50"}`} aria-hidden="true" />
          {eyebrow}
        </span>
      )}

      <h2 className={`font-heading text-3xl font-extrabold leading-[1.08] tracking-[-0.01em] min-[380px]:text-4xl sm:text-5xl md:text-[3.4rem] md:leading-[1.06] ${isDark ? "text-white" : "text-primary"}`}>
        {title}
      </h2>

      {description && (
        <p className={`mt-4 max-w-2xl font-sans text-sm leading-relaxed sm:mt-5 sm:text-lg ${isDark ? "text-slate-300/85" : "text-foreground-muted"} ${textAlignmentClasses[align]}`}>
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
