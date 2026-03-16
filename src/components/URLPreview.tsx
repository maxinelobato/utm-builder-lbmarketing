interface URLPreviewProps {
  url: string;
}

export function URLPreview({ url }: URLPreviewProps) {
  if (!url) {
    return (
      <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg p-4 min-h-[54px] text-[11px] font-mono">
        <span className="text-border">
          preencha os campos acima para ver a prévia...
        </span>
      </div>
    );
  }

  const [base, query] = url.split('?');

  if (!query) {
    return (
      <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded p-4 min-h-[54px] text-[11px] font-mono break-all leading-relaxed">
        <span className="text-muted">{base}</span>
      </div>
    );
  }

  const pairs = query.split('&');

  return (
    <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded p-4 min-h-[54px] text-[11px] font-mono break-all leading-relaxed">
      <span className="text-muted">{base}</span>
      <span className="text-[#3a3a3a]">?</span>
      {pairs.map((pair, i) => {
        const eqIdx = pair.indexOf('=');
        const key = pair.slice(0, eqIdx);
        const val = pair.slice(eqIdx + 1);
        return (
          <span key={i}>
            {i > 0 && <span className="text-[#3a3a3a]">&amp;</span>}
            <span className="text-[#a09080]">{key}</span>
            <span className="text-[#3a3a3a]">=</span>
            <span className="text-orange-400">{val}</span>
          </span>
        );
      })}
    </div>
  );
}
