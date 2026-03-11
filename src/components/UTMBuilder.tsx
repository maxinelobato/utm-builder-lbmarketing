import { useState, useMemo } from 'react';
import { URLPreview } from './URLPreview';
import { ParamTag } from './ParamTag';
import { HistoryPanel } from './HistoryPanel';
import {
  SOURCES, MEDIUMS, UTM_PARAMS,
  slugify, buildUTMUrl, validateForm,
  getSourceValue, getMediumValue, getUTMParams,
  INITIAL_FORM,
} from '../utils/utm';
import type { UTMForm, UTMErrors, HistoryEntry } from '../types/utm';

export function UTMBuilder() {
  const [form, setForm] = useState<UTMForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<UTMErrors>({});
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const set = (key: keyof UTMForm, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const clearError = (key: keyof UTMErrors) =>
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });

  const generated = useMemo(() => buildUTMUrl(form), [form]);

  const isParamActive = (param: string): boolean => {
    switch (param) {
      case 'source': return !!getSourceValue(form);
      case 'medium': return !!getMediumValue(form);
      case 'campaign': return !!slugify(form.campaign);
      case 'content': return !!slugify(form.content);
      case 'term': return !!slugify(form.term);
      default: return false;
    }
  };

  const handleCopy = async () => {
    const errs = validateForm(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

    await navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    const entry: HistoryEntry = {
      id: Date.now().toString(),
      url: generated,
      generatedAt: new Date().toLocaleString('pt-BR'),
      params: getUTMParams(form),
    };
    setHistory((h) => [...h, entry]);
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setCopied(false);
  };

  const handleSelectHistory = (entry: HistoryEntry) => {
    const [base] = entry.url.split('?');
    setForm({
      ...INITIAL_FORM,
      url: base,
      source: entry.params['utm_source'] || '',
      medium: entry.params['utm_medium'] || '',
      campaign: entry.params['utm_campaign'] || '',
      content: entry.params['utm_content'] || '',
      term: entry.params['utm_term'] || '',
    });
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-ink text-paper font-mono">

      {/* Header */}
      <header className="border-b border-[#1a1a1a] px-6 md:px-10 py-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[10px] tracking-[0.2em] text-[#4a4a40] uppercase mb-2 font-mono">— ferramenta</div>
          <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight leading-none">
            UTM{' '}
            <span className="text-orange-400 italic font-light">Builder</span> | lbmarketing
          </h1>
        </div>

        <div className="flex flex-wrap gap-1.5 items-center">
          {UTM_PARAMS.map((p) => (
            <ParamTag key={p} label={`utm_${p}`} active={isParamActive(p)} />
          ))}
          <button
            onClick={() => setShowHistory((v) => !v)}
            className={`
              ml-2 text-[10px] tracking-widest uppercase font-mono px-3 py-1.5 rounded-full
              border transition-all duration-200
              ${showHistory
                ? 'bg-acid/10 border-acid/33 text-orange-400'
                : 'border-border text-[#4a4a40] hover:border-[#3a3a38] hover:text-[#8a8a85]'
              }
            `}
          >
            histórico {history.length > 0 && `(${history.length})`}
          </button>
        </div>
      </header>

      {/* History panel */}
      {showHistory && (
        <div className="border-b border-[#1a1a1a] px-6 md:px-10 py-6 animate-fade-up">
          <HistoryPanel
            entries={history}
            onSelect={handleSelectHistory}
            onClear={() => setHistory([])}
          />
        </div>
      )}

      {/* Main form */}
      <main className="max-w-2xl mx-auto px-5 md:px-6 py-10 space-y-7">

        {/* URL */}
        <div className="space-y-1.5 animate-fade-up" style={{ animationDelay: '0ms' }}>
          <label className="field-label">
            URL de destino <span className="text-orange-400">*</span>
          </label>
          <input
            className={`field-input rounded-lg ${errors.url ? 'field-input-error' : ''}`}
            type="text"
            placeholder="https://seusite.com/pagina"
            value={form.url}
            onChange={(e) => { set('url', e.target.value); clearError('url'); }}
          />
          {errors.url && <p className="text-[10px] text-red-400 font-mono">{errors.url}</p>}
        </div>

        <div className="border-t border-[#1a1a1a]" />

        <div className="animate-fade-up" style={{ animationDelay: '60ms' }}>
          <p className="font-display italic font-light text-[13px] text-[#4a4a40] tracking-wide mb-5">
            Parâmetros obrigatórios
          </p>

          {/* Source + Medium */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Source */}
            <div className="space-y-1.5">
              <label className="field-label">
                utm_source <span className="text-orange-400">*</span>
              </label>
              <select
                className={`field-input rounded-lg ${errors.source ? 'field-input-error' : ''}`}
                value={form.source}
                onChange={(e) => { set('source', e.target.value); clearError('source'); }}
              >
                <option value="" className='rounded-lg'>— selecione</option>
                {SOURCES.map((s) => <option className='rounded-lg' key={s} value={s}>{s}</option>)}
              </select>
              {form.source === 'outro' && (
                <input
                  className="field-input rounded-lg mt-2"
                  placeholder="ex: tiktok"
                  value={form.sourceCustom}
                  onChange={(e) => set('sourceCustom', e.target.value)}
                />
              )}
              {errors.source && <p className="text-[10px] text-red-400 font-mono">{errors.source}</p>}
            </div>

            {/* Medium */}
            <div className="space-y-1.5">
              <label className="field-label">
                utm_medium <span className="text-orange-400">*</span>
              </label>
              <select
                className={`field-input rounded-lg ${errors.medium ? 'field-input-error' : ''}`}
                value={form.medium}
                onChange={(e) => { set('medium', e.target.value); clearError('medium'); }}
              >
                <option value="" className='rounded-lg'>— selecione</option>
                {MEDIUMS.map((m) => <option className='rounded-lg' key={m} value={m}>{m}</option>)}
              </select>
              {form.medium === 'outro' && (
                <input
                  className="field-input rounded-lg mt-2"
                  placeholder="ex: podcast"
                  value={form.mediumCustom}
                  onChange={(e) => set('mediumCustom', e.target.value)}
                />
              )}
              {errors.medium && <p className="text-[10px] text-red-400 font-mono">{errors.medium}</p>}
            </div>
          </div>

          {/* Campaign */}
          <div className="space-y-1.5">
            <label className="field-label">
              utm_campaign <span className="text-orange-400">*</span>
            </label>
            <input
              className={`field-input rounded-lg ${errors.campaign ? 'field-input-error' : ''}`}
              placeholder="ex: black friday 2026"
              value={form.campaign}
              onChange={(e) => { set('campaign', e.target.value); clearError('campaign'); }}
            />
            {form.campaign && (
              <p className="text-[10px] text-[#3a3a3a] font-mono text-right">
                slug: <span className="text-muted">{slugify(form.campaign)}</span>
              </p>
            )}
            {errors.campaign && <p className="text-[10px] text-red-400 font-mono">{errors.campaign}</p>}
          </div>
        </div>

        <div className="border-t border-[#1a1a1a]" />

        {/* Optional params */}
        <div className="animate-fade-up" style={{ animationDelay: '120ms' }}>
          <p className="font-display italic font-light text-[13px] text-[#4a4a40] tracking-wide mb-5">
            Parâmetros opcionais
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="field-label">utm_content</label>
              <input
                className="field-input rounded-lg"
                placeholder="ex: banner topo"
                value={form.content}
                onChange={(e) => set('content', e.target.value)}
              />
              {form.content && (
                <p className="text-[10px] text-[#3a3a3a] font-mono text-right">
                  slug: <span className="text-muted">{slugify(form.content)}</span>
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="field-label">utm_term</label>
              <input
                className="field-input rounded-lg"
                placeholder="ex: tenis masculino"
                value={form.term}
                onChange={(e) => set('term', e.target.value)}
              />
              {form.term && (
                <p className="text-[10px] text-[#3a3a3a] font-mono text-right">
                  slug: <span className="text-muted">{slugify(form.term)}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-[#1a1a1a]" />

        {/* Preview */}
        <div className="space-y-2 animate-fade-up" style={{ animationDelay: '180ms' }}>
          <label className="field-label">Prévia da URL gerada</label>
          <URLPreview url={generated} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: '220ms' }}>
          <button
            onClick={handleCopy}
            className={`
              px-7 py-3.5 text-[12px] rounded-lg tracking-widest uppercase font-mono font-medium rounded
              transition-all duration-150 active:scale-[0.98]
              ${copied
                ? 'bg-[#4adf8a] text-ink'
                : 'bg-orange-600 text-paper hover:bg-orange-500 duration-200 transition-colors ease-in-out delay-80'
              }
            `}
          >
            {copied ? '✓ copiado!' : 'copiar URL'}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-3.5 text-[11px] rounded-lg tracking-widest uppercase font-mono border border-orange-500/50 text-orange-500/50 hover:border-orange-500 hover:text-orange-500 rounded duration-200 transition-colors ease-in-out delay-80"
          >
            limpar
          </button>
        </div>

        {Object.keys(errors).length > 0 && (
          <p className="text-[11px] text-red-400 font-mono tracking-wide animate-slide-in">
            ↑ preencha os campos obrigatórios antes de copiar
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] px-6 md:px-10 py-5 flex flex-wrap items-center justify-between gap-3">
        <span className="text-[10px] text-[#3a3a3a] font-mono tracking-widest uppercase">
          utm builder | lbmarketing — {new Date().getFullYear()}
        </span>
        <span className="text-[10px] text-[#3a3a3a] font-mono">
          source · medium · campaign · content · term
        </span>
      </footer>
    </div>
  );
}
