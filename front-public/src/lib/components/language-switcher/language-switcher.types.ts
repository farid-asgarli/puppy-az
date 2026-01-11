export type Locale = 'az' | 'en' | 'ru';

export interface Language {
  code: Locale;
  label: string;
  name: string;
}
