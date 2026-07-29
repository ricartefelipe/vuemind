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
