"use client";

import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import AnalysisResults from "@/components/AnalysisResults";

type Step = "upload" | "analyzing" | "results";

interface Analysis {
  features: {
    skinTone: string;
    skinUndertone: string;
    skinDepth: string;
    hairColor: string;
    eyeColor: string;
  };
  season: string;
  subSeason: string;
  seasonDescription: string;
  bestColors: { hex: string; name: string; why?: string }[];
  avoidColors: { hex: string; name: string; why?: string }[];
  neutrals: { hex: string; name: string }[];
  metals: { best: string; reason: string };
  makeupTips: {
    foundation: string;
    lipColors: string;
    eyeshadow: string;
    blush: string;
  };
  stylingTips: string[];
  colorCombinations?: { name: string; colors: { hex: string; name: string }[]; description: string; occasion: string }[];
  patternGuide?: {
    recommended: { pattern: string; why: string }[];
    avoid: { pattern: string; why: string }[];
    tip: string;
  };
  wardrobeCapsule?: { piece: string; colorHex: string; colorName: string; why: string }[];
  occasionPalettes?: {
    work: { colors: { hex: string; name: string }[]; tip: string };
    casual: { colors: { hex: string; name: string }[]; tip: string };
    evening: { colors: { hex: string; name: string }[]; tip: string };
  };
  colorRatioTip?: string;
  celebrities: string[];
}

export default function Home() {
  const [step, setStep] = useState<Step>("upload");
  const [imageBase64, setImageBase64] = useState<string>("");
  const [mediaType, setMediaType] = useState<string>("");
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string>("");

  const handleImageSelect = (base64: string, type: string, preview: string) => {
    setImageBase64(base64);
    setMediaType(type);
    setPhotoPreview(preview);
    setError("");
    setAnalysis(null);
  };

  const handleAnalyze = async () => {
    if (!imageBase64) return;

    setStep("analyzing");
    setError("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, mediaType }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setAnalysis(data.analysis);
      setStep("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("upload");
    }
  };

  const handleReset = () => {
    setStep("upload");
    setImageBase64("");
    setMediaType("");
    setPhotoPreview("");
    setAnalysis(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-stone-50 to-amber-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-stone-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-stone-800 tracking-tight">
              ColorDNA
            </h1>
            <p className="text-xs text-stone-400">Personal color analysis</p>
          </div>
          {step === "results" && (
            <button
              onClick={handleReset}
              className="text-sm text-rose-500 font-medium hover:text-rose-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              New Analysis
            </button>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 pb-16">

        {/* Upload Step */}
        {(step === "upload" || step === "analyzing") && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-stone-800">
                Discover Your Color Palette
              </h2>
              <p className="text-stone-500 text-sm max-w-md mx-auto">
                Upload a clear photo of your face and our AI will analyze your unique coloring to reveal your personal color season and perfect palette.
              </p>
            </div>

            <ImageUpload
              onImageSelect={handleImageSelect}
              isLoading={step === "analyzing"}
            />

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-red-600 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {step === "analyzing" ? (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="relative w-14 h-14">
                  <div className="absolute inset-0 rounded-full border-4 border-rose-100" />
                  <div className="absolute inset-0 rounded-full border-4 border-rose-400 border-t-transparent animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-stone-700 font-medium">Analyzing your colors...</p>
                  <p className="text-stone-400 text-sm mt-1">Reading your skin tone, hair, and eyes</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {["Skin analysis", "Hair detection", "Eye color", "Season mapping"].map((label, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-500 font-medium animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              imageBase64 && (
                <button
                  onClick={handleAnalyze}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-400 text-white font-semibold text-base shadow-lg shadow-rose-200 hover:shadow-rose-300 hover:from-rose-600 hover:to-rose-500 transition-all duration-200 active:scale-[0.98]"
                >
                  Analyze My Colors ✨
                </button>
              )
            )}

            {/* Tips */}
            {step === "upload" && !imageBase64 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { icon: "☀️", tip: "Good natural lighting" },
                  { icon: "😊", tip: "Face clearly visible" },
                  { icon: "💆", tip: "Minimal heavy makeup" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border border-stone-100 text-center shadow-sm">
                    <span className="text-xl">{item.icon}</span>
                    <p className="text-xs text-stone-500">{item.tip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Results Step */}
        {step === "results" && analysis && (
          <AnalysisResults analysis={analysis} photoPreview={photoPreview} />
        )}
      </main>
    </div>
  );
}
