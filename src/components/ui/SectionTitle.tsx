import React from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  description?: string;
  align?: "left" | "center" | "right";
  className?: string;
  badge?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  description,
  align = "center",
  className = "",
  badge,
}) => {
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
        <span className="inline-flex items-center gap-3 text-[0.66rem] font-semibold uppercase tracking-[0.3em] text-accent mb-5">
          <span className="h-px w-8 bg-accent/50" aria-hidden="true" />
          {eyebrow}
        </span>
      )}

      <h2 className="font-display font-normal text-4xl sm:text-5xl md:text-[3.4rem] text-primary leading-[1.06] tracking-[-0.01em]">
        {title}
      </h2>

      {description && (
        <p className={`mt-5 text-base sm:text-lg text-foreground-muted leading-relaxed font-sans max-w-2xl ${textAlignmentClasses[align]}`}>
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
