/**
 * Instância única de i18n em modo Composition API (`legacy: false`): fora
 * dos componentes (ex.: `main.ts`), o idioma se lê/escreve em
 * `i18n.global.locale.value`; dentro de componentes, `useI18n()` devolve
 * esse mesmo composer global por padrão. O idioma inicial aqui é só o
 * fallback antes da hidratação da settingsStore — quem decide o valor
 * real é o bootstrap em `main.ts`.
 */
import { createI18n } from 'vue-i18n'
import ptBR from './locales/pt-BR'
import en from './locales/en'

export const i18n = createI18n({
  legacy: false,
  locale: 'pt-BR',
  fallbackLocale: 'pt-BR',
  messages: {
    'pt-BR': ptBR,
    en,
  },
})
