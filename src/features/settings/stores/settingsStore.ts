/**
 * Única store deste marco que sobrevive a um reload: tema e idioma são
 * gravados em `localStorage` pelo `pinia-plugin-persistedstate` (`pick`
 * restringe a persistência a esses dois campos — nada de sessão/token
 * aqui, isso é responsabilidade da futura `authStore`, Task 5).
 *
 * Note que esta store guarda a *preferência*, não o *efeito*: aplicar o
 * tema no DOM é papel de `applyTheme` (chamado no bootstrap e nas telas
 * que oferecem o toggle), para manter a store livre de acesso a `window`.
 */
import { defineStore } from 'pinia'

export type Theme = 'light' | 'dark'
export type Locale = 'pt-BR' | 'en'

type SettingsState = {
  theme: Theme
  locale: Locale
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    theme: 'light',
    locale: 'pt-BR',
  }),
  actions: {
    setTheme(theme: Theme): void {
      this.theme = theme
    },
    setLocale(locale: Locale): void {
      this.locale = locale
    },
  },
  persist: {
    pick: ['theme', 'locale'],
  },
})
