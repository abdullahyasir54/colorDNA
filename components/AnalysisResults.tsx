"use client";

import ColorSwatch from "./ColorSwatch";

interface Feature {
  skinTone: string;
  skinUndertone: string;
  skinDepth: string;
  hairColor: string;
  eyeColor: string;
}

interface ColorEntry {
  hex: string;
  name: string;
  why?: string;
}

interface MakeupTips {
  foundation: string;
  lipColors: string;
  eyeshadow: string;
  blush: string;
}

interface Analysis {
  features: Feature;
  season: string;
  subSeason: string;
  seasonDescription: string;
  bestColors: ColorEntry[];
  avoidColors: ColorEntry[];
  neutrals: ColorEntry[];
  metals: { best: string; reason: string };
  makeupTips: MakeupTips;
  stylingTips: string[];
  celebrities: string[];
}

const SEASON_GRADIENTS: Record<string, string> = {
  Spring: "from-amber-100 via-rose-100 to-yellow-100",
  Summer: "from-blue-100 via-pink-100 to-purple-100",
  Autumn: "from-orange-100 via-amber-100 to-red-100",
  Winter: "from-slate-100 via-blue-100 to-indigo-100",
};

const SEASON_ACCENT: Record<string, string> = {
  Spring: "text-amber-600",
  Summer: "text-blue-500",
  Autumn: "text-orange-600",
  Winter: "text-indigo-600",
};

const SEASON_BADGE: Record<string, string> = {
  Spring: "bg-amber-100 text-amber-700 border-amber-200",
  Summer: "bg-blue-100 text-blue-700 border-blue-200",
  Autumn: "bg-orange-100 text-orange-700 border-orange-200",
  Winter: "bg-indigo-100 text-indigo-700 border-indigo-200",
};

const SEASON_EMOJI: Record<string, string> = {
  Spring: "🌸",
  Summer: "☀️",
  Autumn: "🍂",
  Winter: "❄️",
};

interface Props {
  analysis: Analysis;
  photoPreview: string;
}

export default function AnalysisResults({ analysis, photoPreview }: Props) {
  const season = analysis.season;
  const gradient = SEASON_GRADIENTS[season] || "from-rose-100 to-stone-100";
  const accent = SEASON_ACCENT[season] || "text-rose-600";
  const badge = SEASON_BADGE[season] || "bg-rose-100 text-rose-700 border-rose-200";
  const emoji = SEASON_EMOJI[season] || "✨";

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">

      {/* Hero: Season Card */}
      <div className={`relative rounded-3xl bg-gradient-to-br ${gradient} p-6 overflow-hidden`}>
        <div className="flex gap-5 items-start">
          <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg ring-2 ring-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoPreview} alt="Your photo" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${badge} mb-3`}>
              {emoji} {analysis.subSeason || season}
            </div>
            <h2 className={`text-3xl font-bold ${accent} leading-tight`}>
              {season} {emoji}
            </h2>
            <p className="text-stone-600 text-sm mt-2 leading-relaxed">{analysis.seasonDescription}</p>
          </div>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          <FeaturePill label="Skin" value={analysis.features.skinTone} />
          <FeaturePill label="Undertone" value={analysis.features.skinUndertone} />
          <FeaturePill label="Hair" value={analysis.features.hairColor} />
          <FeaturePill label="Eyes" value={analysis.features.eyeColor} />
        </div>
      </div>

      {/* Best Colors */}
      <Section title="Your Best Colors" subtitle="These shades will make you glow" icon="✨">
        <div className="flex flex-wrap gap-5 justify-center">
          {analysis.bestColors.map((c, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 group relative">
              <div
                className="w-14 h-14 rounded-full shadow-md ring-2 ring-white ring-offset-1 transition-transform group-hover:scale-110 cursor-pointer"
                style={{ backgroundColor: c.hex }}
              />
              <p className="text-xs font-medium text-stone-700 text-center max-w-[70px] leading-tight">{c.name}</p>
              <p className="text-[10px] text-stone-400 font-mono">{c.hex}</p>
              {c.why && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-[11px] rounded-lg px-3 py-2 w-40 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none text-center leading-snug">
                  {c.why}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Avoid Colors */}
      <Section title="Colors to Avoid" subtitle="These can wash you out or clash with your palette" icon="🚫">
        <div className="flex flex-wrap gap-5 justify-center">
          {analysis.avoidColors.map((c, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 group relative opacity-70">
              <div className="relative">
                <div
                  className="w-14 h-14 rounded-full shadow-md ring-2 ring-white ring-offset-1 transition-transform group-hover:scale-110 cursor-pointer"
                  style={{ backgroundColor: c.hex }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-0.5 bg-red-500/80 rotate-45 rounded-full" />
                  <div className="absolute w-10 h-0.5 bg-red-500/80 -rotate-45 rounded-full" />
                </div>
              </div>
              <p className="text-xs font-medium text-stone-600 text-center max-w-[70px] leading-tight">{c.name}</p>
              <p className="text-[10px] text-stone-400 font-mono">{c.hex}</p>
              {c.why && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-[11px] rounded-lg px-3 py-2 w-40 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none text-center leading-snug">
                  {c.why}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Neutrals */}
      <Section title="Your Perfect Neutrals" subtitle="Build your wardrobe base with these" icon="🤍">
        <div className="flex flex-wrap gap-5 justify-center">
          {analysis.neutrals.map((c, i) => (
            <ColorSwatch key={i} hex={c.hex} name={c.name} size="md" />
          ))}
        </div>
      </Section>

      {/* Metals */}
      <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5">
        <h3 className="font-semibold text-stone-800 mb-1">💍 Best Metal for You</h3>
        <p className="text-rose-500 font-bold capitalize text-lg">{analysis.metals.best}</p>
        <p className="text-stone-500 text-sm mt-1">{analysis.metals.reason}</p>
      </div>

      {/* Makeup Tips */}
      <Section title="Makeup Palette" subtitle="Colors that complement your natural features" icon="💄">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <MakeupCard label="Foundation" value={analysis.makeupTips.foundation} />
          <MakeupCard label="Lip Colors" value={analysis.makeupTips.lipColors} />
          <MakeupCard label="Eyeshadow" value={analysis.makeupTips.eyeshadow} />
          <MakeupCard label="Blush" value={analysis.makeupTips.blush} />
        </div>
      </Section>

      {/* Styling Tips */}
      <Section title="Styling Tips" subtitle="Make the most of your palette" icon="👗">
        <ul className="space-y-3">
          {analysis.stylingTips.map((tip, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-100 text-rose-500 text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <p className="text-stone-600 text-sm leading-relaxed">{tip}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Celebrities */}
      {analysis.celebrities?.length > 0 && (
        <Section title="Your Color Twins" subtitle="Celebrities who share your palette" icon="⭐">
          <div className="flex flex-wrap gap-2">
            {analysis.celebrities.map((celeb, i) => (
              <span key={i} className="px-3 py-1.5 rounded-full bg-stone-100 text-stone-700 text-sm font-medium border border-stone-200">
                {celeb}
              </span>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, subtitle, icon, children }: {
  title: string;
  subtitle: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white border border-stone-100 p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="font-semibold text-stone-800 text-base">{icon} {title}</h3>
        <p className="text-stone-400 text-xs mt-0.5">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function FeaturePill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1 text-xs border border-white/50 shadow-sm">
      <span className="text-stone-400 font-medium">{label}:</span>
      <span className="text-stone-700 font-semibold capitalize">{value}</span>
    </div>
  );
}

function MakeupCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-stone-50 rounded-xl p-3 border border-stone-100">
      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-stone-700 text-sm leading-relaxed">{value}</p>
    </div>
  );
}
