"use client";

import React, { memo } from "react";
import Image from "next/image";
import { Download, X } from "lucide-react";

interface LightboxModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export const LightboxModal = memo(function LightboxModal({
  imageUrl,
  onClose,
}: LightboxModalProps) {
  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
        title="Close full-screen image"
        aria-label="Close full-screen image"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="relative max-w-4xl max-h-[85vh] w-full h-[70vh]">
        <Image
          src={imageUrl}
          alt="Expanded media view"
          fill
          sizes="100vw"
          className="object-contain"
        />
      </div>

      <div className="absolute bottom-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => alert("Downloading photo...")}
          className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-2 cursor-pointer backdrop-blur-xs"
        >
          <Download className="w-4 h-4" />
          <span>Save Photo</span>
        </button>
      </div>
    </div>
  );
});

