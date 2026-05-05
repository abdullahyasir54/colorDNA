interface ColorSwatchProps {
  hex: string;
  name: string;
  why?: string;
  size?: "sm" | "md" | "lg";
}

export default function ColorSwatch({ hex, name, why, size = "md" }: ColorSwatchProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex flex-col items-center gap-2 group">
      <div
        className={`${sizeClasses[size]} rounded-full shadow-md ring-2 ring-white ring-offset-1 transition-transform group-hover:scale-110 flex-shrink-0`}
        style={{ backgroundColor: hex }}
        title={name}
      />
      <div className="text-center max-w-[80px]">
        <p className="text-xs font-medium text-stone-700 leading-tight">{name}</p>
        <p className="text-[10px] text-stone-400 font-mono">{hex}</p>
        {why && (
          <p className="text-[10px] text-stone-400 mt-0.5 leading-tight hidden group-hover:block absolute z-10 bg-white border border-stone-100 shadow-lg rounded-lg p-2 max-w-[160px] text-left">
            {why}
          </p>
        )}
      </div>
    </div>
  );
}
