import { describe, expect, it } from 'vitest'
import { formatCents, parseReaisToCents, toCents } from './money'

describe('money', () => {
  it('formata centavos em pt-BR', () => {
    expect(formatCents(150051, 'pt-BR')).toMatch(/1\.500,51/)
  })

  it('formata valores ausentes sem NaN', () => {
    expect(formatCents(undefined, 'pt-BR')).toMatch(/0,00/)
    expect(formatCents(null, 'pt-BR')).toMatch(/0,00/)
    expect(formatCents(Number.NaN, 'pt-BR')).toMatch(/0,00/)
    expect(formatCents('250000', 'pt-BR')).toMatch(/2\.500,00/)
  })

  it('toCents aplica fallback seguro', () => {
    expect(toCents(undefined)).toBe(0)
    expect(toCents('12.9')).toBe(12)
    expect(toCents('x', 7)).toBe(7)
  })

  it('converte reais digitados em centavos', () => {
    expect(parseReaisToCents('10,50')).toBe(1050)
    expect(parseReaisToCents('10.50')).toBe(1050)
  })

  it('rejeita entrada inválida', () => {
    expect(() => parseReaisToCents('abc')).toThrow()
  })
})
