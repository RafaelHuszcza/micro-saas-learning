export const i18n: {
  defaultLocale: string;
  locales: string[];
} = {
  defaultLocale: 'ptBR',
  locales: ['en', 'pt-br', 'es']
};
export const timeZone = 'America/Sao_Paulo';
export type Locale = (typeof i18n)["locales"][number];
