"use client";

import { useCallback, useState } from "react";

interface ImageUploadProps {
  onImageSelect: (base64: string, mediaType: string, preview: string) => void;
  isLoading: boolean;
}

export default function ImageUpload({ onImageSelect, isLoading }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const base64 = result.split(",")[1];
        const mediaType = file.type as "image/jpeg" | "image/png" | "image/webp" | "image/gif";
        setPreview(result);
        onImageSelect(base64, mediaType, result);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="w-full">
      <label
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden
          ${isDragging
            ? "border-rose-400 bg-rose-50 scale-[1.01]"
            : "border-stone-300 bg-stone-50 hover:border-rose-300 hover:bg-rose-50/50"
          }
          ${preview ? "min-h-[320px]" : "min-h-[260px]"}
        `}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileInput}
          disabled={isLoading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {preview ? (
          <div className="relative w-full flex items-center justify-center p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Uploaded photo"
              className="max-h-[400px] max-w-full object-contain rounded-xl shadow-md"
            />
            {!isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-2xl">
                <p className="text-white font-medium text-sm">Click to change photo</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 p-10">
            <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-stone-700 font-semibold text-base">Drop your photo here</p>
              <p className="text-stone-400 text-sm mt-1">or click to browse</p>
              <p className="text-stone-300 text-xs mt-3">JPG, PNG, or WebP · Best results with a clear face photo</p>
            </div>
          </div>
        )}
      </label>
    </div>
  );
}
