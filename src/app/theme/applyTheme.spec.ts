import { describe, expect, it } from 'vitest'
import { applyTheme } from './applyTheme'

describe('applyTheme', () => {
  it('aplica data-theme no documentElement', () => {
    applyTheme('dark')

    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('troca de tema quando chamado novamente', () => {
    applyTheme('dark')
    applyTheme('light')

    expect(document.documentElement.dataset.theme).toBe('light')
  })
})
