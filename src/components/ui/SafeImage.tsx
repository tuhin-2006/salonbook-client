"use client";

import React, { useState, useEffect, useRef } from "react";
import { ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

// Built-in luxury SVG fallback that NEVER fails (works 100% offline, 0 network dependencies)
const INLINE_SVG_FALLBACK =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221200%22%20height%3D%22800%22%20viewBox%3D%220%200%201200%20800%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23251B20%22%2F%3E%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%233B1F2B%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23170F13%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20fill%3D%22url(%23g)%22%20width%3D%221200%22%20height%3D%22800%22%2F%3E%3Ccircle%20cx%3D%22600%22%20cy%3D%22360%22%20r%3D%2280%22%20fill%3D%22%23C5A880%22%20opacity%3D%220.15%22%2F%3E%3Cpath%20d%3D%22M580%20330l40%2060m0-60l-40%2060m-20-40a20%2020%200%201%201%2040%200%2020%2020%200%200%201-40%200zm40%2040a20%2020%200%201%201%2040%200%2020%2020%200%200%201-40%200z%22%20stroke%3D%22%23C5A880%22%20stroke-width%3D%224%22%20fill%3D%22none%22%2F%3E%3Ctext%20x%3D%22600%22%20y%3D%22480%22%20text-anchor%3D%22middle%22%20font-family%3D%22serif%22%20font-size%3D%2228%22%20font-weight%3D%22600%22%20letter-spacing%3D%224%22%20fill%3D%22%23FAF7F2%22%3ESALONBOOK%3C%2Ftext%3E%3Ctext%20x%3D%22600%22%20y%3D%22515%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2213%22%20letter-spacing%3D%226%22%20fill%3D%22%23C5A880%22%3EATELIER%20DE%20BEAUT%C3%89%3C%2Ftext%3E%3C%2Fsvg%3E";

const PRIMARY_FALLBACK =
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80";

export function SafeImage({
  src,
  alt,
  className,
  fallbackSrc = PRIMARY_FALLBACK,
  ...rest
}: SafeImageProps) {
  const initialSrc = (src as string) || fallbackSrc;
  const [currentSrc, setCurrentSrc] = useState<string>(initialSrc);
  const [loaded, setLoaded] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  // Sync state whenever the source prop changes
  useEffect(() => {
    if (src) {
      setCurrentSrc(src as string);
      setErrorCount(0);
      setLoaded(false);
    }
  }, [src]);

  // Handle cached images that are already complete on mount
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      if (imgRef.current.naturalWidth > 0) {
        setLoaded(true);
      }
    }
  }, [currentSrc]);

  const handleError = () => {
    if (errorCount === 0 && fallbackSrc && currentSrc !== fallbackSrc) {
      // Step 1: try secondary fallback
      setErrorCount(1);
      setCurrentSrc(fallbackSrc);
    } else if (errorCount < 2) {
      // Step 2: fallback to bulletproof inline SVG
      setErrorCount(2);
      setCurrentSrc(INLINE_SVG_FALLBACK);
      setLoaded(true);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-[#FAF7F2] dark:bg-[#1E1519] ${className || ""}`}>
      {/* Subtle loader shimmer */}
      {!loaded && (
        <div className="absolute inset-0 bg-[#F5EFEB] dark:bg-[#251B20] animate-pulse flex items-center justify-center z-10 pointer-events-none">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#3B1F2B]/40 dark:text-[#C5A880]/40 font-mono">
            SalonBook
          </span>
        </div>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt || "Salon Visual"}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-90"
        }`}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onLoad={() => setLoaded(true)}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
}
