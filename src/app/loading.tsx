import React from "react";

export default function RootLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-[#F5F1E8] dark:bg-[#151916]">
      <div className="w-10 h-10 border-2 border-[#26372D] border-t-transparent animate-spin" />
      <p className="font-serif text-sm tracking-[0.25em] uppercase text-[#302821]/70 animate-pulse">
        SALONBOOK ATELIER
      </p>
    </div>
  );
}
