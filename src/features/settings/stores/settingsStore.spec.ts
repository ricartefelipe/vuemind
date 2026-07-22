import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSettingsStore } from './settingsStore'

describe('useSettingsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('inicia com tema claro e locale pt-BR', () => {
    const settings = useSettingsStore()

    expect(settings.theme).toBe('light')
    expect(settings.locale).toBe('pt-BR')
  })

  it('troca o tema via setTheme', () => {
    const settings = useSettingsStore()

    settings.setTheme('dark')

    expect(settings.theme).toBe('dark')
  })

  it('troca o idioma via setLocale', () => {
    const settings = useSettingsStore()

    settings.setLocale('en')

    expect(settings.locale).toBe('en')
  })
})
