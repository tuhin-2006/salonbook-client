import React from "react";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  subtitle,
  center = false,
}) => {
  return (
    <div
      className={`space-y-2 mb-10 ${
        center ? "text-center mx-auto max-w-2xl" : "max-w-2xl"
      }`}
    >
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs uppercase font-extrabold tracking-wider bg-primary/10 border border-primary/20 text-primary">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          {badge}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
