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

interface ColorCombo {
  name: string;
  colors: { hex: string; name: string }[];
  description: string;
  occasion: string;
}

interface PatternEntry {
  pattern: string;
  why: string;
}

interface CapsulePiece {
  piece: string;
  colorHex: string;
  colorName: string;
  why: string;
}

interface OccasionPalette {
  colors: { hex: string; name: string }[];
  tip: string;
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
  colorCombinations?: ColorCombo[];
  patternGuide?: {
    recommended: PatternEntry[];
    avoid: PatternEntry[];
    tip: string;
  };
  wardrobeCapsule?: CapsulePiece[];
  occasionPalettes?: {
    work: OccasionPalette;
    casual: OccasionPalette;
    evening: OccasionPalette;
  };
  colorRatioTip?: string;
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

const OCCASION_ICON: Record<string, string> = {
  work: "💼",
  casual: "👟",
  evening: "🌙",
};

const OCCASION_LABEL: Record<string, string> = {
  work: "Work & Professional",
  casual: "Casual & Weekend",
  evening: "Evening & Special",
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
            <HoverSwatch key={i} hex={c.hex} name={c.name} tooltip={c.why} />
          ))}
        </div>
      </Section>

      {/* Color Combinations */}
      {analysis.colorCombinations && analysis.colorCombinations.length > 0 && (
        <Section title="Color Combinations" subtitle="Ready-to-wear palettes curated for your season" icon="🎨">
          <div className="space-y-3">
            {analysis.colorCombinations.map((combo, i) => (
              <div key={i} className="rounded-xl border border-stone-100 bg-stone-50 p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-semibold text-stone-800 text-sm">{combo.name}</p>
                    <p className="text-stone-500 text-xs mt-0.5">{combo.description}</p>
                  </div>
                  <OccasionBadge occasion={combo.occasion} />
                </div>
                <div className="flex items-center gap-2">
                  {combo.colors.map((c, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className="w-10 h-10 rounded-lg shadow-sm ring-1 ring-white/80 ring-offset-1 flex-shrink-0"
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                        <span className="text-[10px] text-stone-500 max-w-[44px] text-center leading-tight">{c.name}</span>
                      </div>
                      {j < combo.colors.length - 1 && (
                        <span className="text-stone-300 text-xs mb-4">+</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Occasion Palettes */}
      {analysis.occasionPalettes && (
        <Section title="Occasion Palettes" subtitle="The right colors for every setting" icon="🗓️">
          <div className="space-y-3">
            {(["work", "casual", "evening"] as const).map((occ) => {
              const palette = analysis.occasionPalettes![occ];
              if (!palette) return null;
              return (
                <div key={occ} className="rounded-xl border border-stone-100 bg-stone-50 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base">{OCCASION_ICON[occ]}</span>
                    <p className="font-semibold text-stone-800 text-sm">{OCCASION_LABEL[occ]}</p>
                  </div>
                  <div className="flex gap-2 mb-2">
                    {palette.colors.map((c, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div
                          className="w-10 h-10 rounded-lg shadow-sm ring-1 ring-white/80"
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                        <span className="text-[10px] text-stone-400 max-w-[44px] text-center leading-tight">{c.name}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-stone-500 text-xs mt-1 italic">{palette.tip}</p>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Wardrobe Capsule */}
      {analysis.wardrobeCapsule && analysis.wardrobeCapsule.length > 0 && (
        <Section title="Capsule Wardrobe" subtitle="8 essential pieces built around your palette" icon="👗">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {analysis.wardrobeCapsule.map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-stone-50 rounded-xl p-3 border border-stone-100">
                <div
                  className="w-10 h-10 rounded-lg shadow-sm ring-2 ring-white flex-shrink-0"
                  style={{ backgroundColor: item.colorHex }}
                  title={item.colorName}
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stone-800 leading-tight">{item.piece}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{item.colorName}</p>
                  <p className="text-xs text-stone-500 mt-0.5 leading-tight">{item.why}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Pattern Guide */}
      {analysis.patternGuide && (
        <Section title="Pattern Guide" subtitle="Prints and textures that suit your season" icon="🔷">
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Wear These</p>
              <div className="flex flex-wrap gap-2">
                {analysis.patternGuide.recommended.map((p, i) => (
                  <div key={i} className="group relative">
                    <span className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-200 cursor-default flex items-center gap-1">
                      <span className="text-green-400">✓</span> {p.pattern}
                    </span>
                    {p.why && (
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-[11px] rounded-lg px-3 py-2 w-44 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none text-center leading-snug">
                        {p.why}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Avoid These</p>
              <div className="flex flex-wrap gap-2">
                {analysis.patternGuide.avoid.map((p, i) => (
                  <div key={i} className="group relative">
                    <span className="px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-medium border border-red-200 cursor-default flex items-center gap-1">
                      <span>✕</span> {p.pattern}
                    </span>
                    {p.why && (
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-[11px] rounded-lg px-3 py-2 w-44 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none text-center leading-snug">
                        {p.why}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-stone-500 text-xs italic bg-stone-50 rounded-lg px-3 py-2 border border-stone-100">
              💡 {analysis.patternGuide.tip}
            </p>
          </div>
        </Section>
      )}

      {/* Color Ratio Tip */}
      {analysis.colorRatioTip && (
        <div className="rounded-2xl bg-gradient-to-r from-stone-50 to-stone-100 border border-stone-100 p-5">
          <h3 className="font-semibold text-stone-800 mb-2">📐 60 / 30 / 10 Rule</h3>
          <p className="text-stone-600 text-sm leading-relaxed">{analysis.colorRatioTip}</p>
        </div>
      )}

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
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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
      <Section title="Styling Tips" subtitle="Make the most of your palette" icon="✏️">
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

function HoverSwatch({ hex, name, tooltip }: { hex: string; name: string; tooltip?: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 group relative">
      <div
        className="w-14 h-14 rounded-full shadow-md ring-2 ring-white ring-offset-1 transition-transform group-hover:scale-110 cursor-pointer"
        style={{ backgroundColor: hex }}
      />
      <p className="text-xs font-medium text-stone-700 text-center max-w-[70px] leading-tight">{name}</p>
      <p className="text-[10px] text-stone-400 font-mono">{hex}</p>
      {tooltip && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-[11px] rounded-lg px-3 py-2 w-40 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none text-center leading-snug">
          {tooltip}
        </div>
      )}
    </div>
  );
}

function OccasionBadge({ occasion }: { occasion: string }) {
  const styles: Record<string, string> = {
    work: "bg-blue-50 text-blue-600 border-blue-200",
    casual: "bg-green-50 text-green-600 border-green-200",
    evening: "bg-purple-50 text-purple-600 border-purple-200",
    weekend: "bg-amber-50 text-amber-600 border-amber-200",
  };
  const style = styles[occasion.toLowerCase()] || "bg-stone-100 text-stone-600 border-stone-200";
  return (
    <span className={`flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${style}`}>
      {occasion}
    </span>
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
