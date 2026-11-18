"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Sparkles } from "lucide-react";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK =
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80";

export function SafeImage({
  src,
  alt,
  className,
  fallbackSrc = DEFAULT_FALLBACK,
  ...rest
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src as string || DEFAULT_FALLBACK);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className || ""}`}>
      {loading && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-slate-400 dark:text-slate-600 animate-spin" />
        </div>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={error ? fallbackSrc : imgSrc}
        alt={alt || "Salon service"}
        className={`w-full h-full object-cover transition-all duration-500 ${
          loading ? "opacity-0 scale-105" : "opacity-100 scale-100"
        }`}
        onLoad={() => setLoading(false)}
        onError={() => {
          if (!error) {
            setError(true);
            setImgSrc(fallbackSrc);
            setLoading(false);
          }
        }}
        loading="lazy"
      />
    </div>
  );
}
