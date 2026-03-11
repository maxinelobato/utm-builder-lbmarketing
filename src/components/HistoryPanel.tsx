import type { HistoryEntry } from '../types/utm';

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
}

export function HistoryPanel({ entries, onSelect, onClear }: HistoryPanelProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-10 text-[#3a3a3a] text-xs font-mono tracking-widest">
        nenhuma url gerada ainda
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] tracking-widest uppercase text-[#4a4a40] font-mono">
          {entries.length} {entries.length === 1 ? 'entrada' : 'entradas'}
        </span>
        <button
          onClick={onClear}
          className="text-[10px] tracking-widest uppercase text-[#4a4a40] hover:text-[#9a9a90] transition-colors font-mono border border-border hover:border-[#3a3a38] px-2.5 py-1 rounded"
        >
          limpar histórico
        </button>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {entries.slice().reverse().map((entry) => (
          <button
            key={entry.id}
            onClick={() => onSelect(entry)}
            className="w-full text-left bg-[#0d0d0d] border border-[#1e1e1e] hover:border-acid/20 rounded p-3 transition-all duration-200 group"
          >
            <div className="text-[10px] text-orange-400 font-mono truncate mb-1.5 group-hover:text-[#d8ff5a]">
              {entry.params['utm_source']} · {entry.params['utm_medium']} · {entry.params['utm_campaign']}
            </div>
            <div className="text-[10px] text-[#4a4a40] font-mono truncate">{entry.url}</div>
            <div className="text-[9px] text-[#3a3a3a] font-mono mt-1.5">{entry.generatedAt}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
