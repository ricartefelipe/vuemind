import { describe, expect, it } from 'vitest'
import { formatCents, parseReaisToCents } from './money'

describe('money', () => {
  it('formata centavos em pt-BR', () => {
    expect(formatCents(150051, 'pt-BR')).toMatch(/1\.500,51/)
  })

  it('converte reais digitados em centavos', () => {
    expect(parseReaisToCents('10,50')).toBe(1050)
    expect(parseReaisToCents('10.50')).toBe(1050)
  })

  it('rejeita entrada inválida', () => {
    expect(() => parseReaisToCents('abc')).toThrow()
  })
})
