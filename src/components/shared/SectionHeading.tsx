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
        <Badge
          variant="terracotta"
          className="uppercase tracking-widest text-[11px] font-semibold py-1 px-3"
        >
          {badge}
        </Badge>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif tracking-tight text-foreground font-medium">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
