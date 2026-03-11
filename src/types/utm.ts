export interface UTMForm {
  url: string;
  source: string;
  sourceCustom: string;
  medium: string;
  mediumCustom: string;
  campaign: string;
  content: string;
  term: string;
}

export interface UTMErrors {
  url?: string;
  source?: string;
  medium?: string;
  campaign?: string;
}

export interface HistoryEntry {
  id: string;
  url: string;
  generatedAt: string;
  params: Record<string, string>;
}
