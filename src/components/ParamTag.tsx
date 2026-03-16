interface ParamTagProps {
  label: string;
  active: boolean;
}

export function ParamTag({ label, active }: ParamTagProps) {
  return (
    <span
      className={`
        inline-block px-2.5 py-1 rounded-full text-[10px] tracking-widest font-mono
        border transition-all duration-300
        ${
          active
            ? 'bg-acid/10 border-acid/33 text-orange-400'
            : 'bg-[#1a1a1a] border-border text-[#4a4a45]'
        }
      `}
    >
      {label}
    </span>
  );
}
