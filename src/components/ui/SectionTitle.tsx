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
        <span className="inline-flex items-center gap-2.5 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-accent mb-4">
          <span className="h-px w-7 bg-accent/60" aria-hidden="true" />
          {eyebrow}
        </span>
      )}

      <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-[2.9rem] text-primary leading-[1.08] tracking-tight">
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
