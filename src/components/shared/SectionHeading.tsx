import React from "react";
import { Badge } from "@/components/ui/badge";

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
      className={`space-y-3 mb-12 ${
        center ? "text-center mx-auto max-w-2xl" : "max-w-2xl"
      }`}
    >
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-[0.2em] bg-gold-500/10 border border-gold-500/30 text-gold-700 dark:text-gold-300">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif tracking-tight text-foreground font-semibold leading-[1.2]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed font-sans">
          {subtitle}
        </p>
      )}
    </div>
  );
};
