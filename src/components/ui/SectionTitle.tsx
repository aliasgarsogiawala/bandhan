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

  return (
    <div
      className={`flex flex-col max-w-3xl ${alignmentClasses[align]} ${className}`}
    >
      {badge && (
        <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20 mb-3 animate-fade-in">
          {badge}
        </span>
      )}
      
      {subtitle && !badge && (
        <span className="text-accent font-heading font-semibold tracking-widest uppercase text-sm mb-2 block">
          {subtitle}
        </span>
      )}

      <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-primary leading-tight tracking-tight">
        {title}
      </h2>

      {description && (
        <p className={`mt-4 text-base sm:text-lg text-foreground-muted leading-relaxed font-sans max-w-2xl ${textAlignmentClasses[align]}`}>
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
