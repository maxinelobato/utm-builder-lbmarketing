import type { UTMForm, UTMErrors } from '../types/utm';

export const SOURCES = [
  'google', 'facebook', 'instagram', 'linkedin',
  'twitter', 'tiktok', 'email', 'youtube', 'bing', 'outro',
] as const;

export const MEDIUMS = [
  'cpc', 'email', 'social', 'organic',
  'referral', 'display', 'video', 'sms', 'outro',
] as const;

export const UTM_PARAMS = ['source', 'medium', 'campaign', 'content', 'term'] as const;

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_\-]/g, '');
}

export function getSourceValue(form: UTMForm): string {
  return form.source === 'outro' ? form.sourceCustom : form.source;
}

export function getMediumValue(form: UTMForm): string {
  return form.medium === 'outro' ? form.mediumCustom : form.medium;
}

export function buildUTMUrl(form: UTMForm): string {
  const base = form.url.trim();
  if (!base) return '';

  const params = new URLSearchParams();
  const source = getSourceValue(form);
  const medium = getMediumValue(form);
  const campaign = slugify(form.campaign);
  const content = slugify(form.content);
  const term = slugify(form.term);

  if (source) params.set('utm_source', source);
  if (medium) params.set('utm_medium', medium);
  if (campaign) params.set('utm_campaign', campaign);
  if (content) params.set('utm_content', content);
  if (term) params.set('utm_term', term);

  const sep = base.includes('?') ? '&' : '?';
  return params.toString() ? `${base}${sep}${params.toString()}` : base;
}

export function validateForm(form: UTMForm): UTMErrors {
  const errors: UTMErrors = {};
  if (!form.url.trim()) {
    errors.url = 'URL obrigatória';
  } else if (!/^https?:\/\/.+/.test(form.url.trim())) {
    errors.url = 'URL inválida (use http:// ou https://)';
  }
  if (!getSourceValue(form)) errors.source = 'Obrigatório';
  if (!getMediumValue(form)) errors.medium = 'Obrigatório';
  if (!form.campaign.trim()) errors.campaign = 'Obrigatório';
  return errors;
}

export function getUTMParams(form: UTMForm): Record<string, string> {
  const result: Record<string, string> = {};
  const source = getSourceValue(form);
  const medium = getMediumValue(form);
  const campaign = slugify(form.campaign);
  const content = slugify(form.content);
  const term = slugify(form.term);
  if (source) result['utm_source'] = source;
  if (medium) result['utm_medium'] = medium;
  if (campaign) result['utm_campaign'] = campaign;
  if (content) result['utm_content'] = content;
  if (term) result['utm_term'] = term;
  return result;
}

export const INITIAL_FORM: UTMForm = {
  url: '',
  source: '',
  sourceCustom: '',
  medium: '',
  mediumCustom: '',
  campaign: '',
  content: '',
  term: '',
};
