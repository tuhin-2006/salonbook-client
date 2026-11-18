"use client";

import React, { useState } from "react";
import { ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK =
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80";

export function SafeImage({
  src,
  alt,
  className,
  fallbackSrc = DEFAULT_FALLBACK,
  ...rest
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>((src as string) || DEFAULT_FALLBACK);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[#EAE3D6] ${className || ""}`}>
      {loading && (
        <div className="absolute inset-0 bg-[#EAE3D6] animate-pulse flex items-center justify-center">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#343D2E]/40 font-mono">
            atelier
          </span>
        </div>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={error ? fallbackSrc : imgSrc}
        alt={alt || "Atelier Imagery"}
        className={`w-full h-full object-cover transition-opacity duration-700 ${
          loading ? "opacity-0" : "opacity-100"
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
