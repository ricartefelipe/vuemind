import { describe, expect, it } from 'vitest'
import { createEndToEndId, DEMO_ISPB, END_TO_END_ID_PATTERN } from './endToEndId'

describe('createEndToEndId', () => {
  it('segue o formato do arranjo PIX, com ISPB fictício e data e hora UTC', () => {
    const id = createEndToEndId(new Date('2026-11-03T23:59:41Z'))

    expect(id).toHaveLength(32)
    expect(id).toMatch(END_TO_END_ID_PATTERN)
    expect(id.startsWith(`E${DEMO_ISPB}202611032359`)).toBe(true)
  })

  it('usa UTC na virada do ano', () => {
    expect(createEndToEndId(new Date('2027-01-01T00:00:00Z')).startsWith('E99999999202701010000')).toBe(true)
  })

  it('não repete em milhares de chamadas no mesmo minuto', () => {
    const date = new Date('2026-11-03T12:00:00Z')
    const ids = new Set(Array.from({ length: 5000 }, () => createEndToEndId(date)))

    expect(ids.size).toBe(5000)
  })

  it('o padrão recusa identificadores fora do formato', () => {
    expect(END_TO_END_ID_PATTERN.test(`E${'0'.repeat(32)}`)).toBe(false)
    expect(END_TO_END_ID_PATTERN.test('E99999999202613032359abcdefghijk')).toBe(false)
    expect(END_TO_END_ID_PATTERN.test('E99999999202611032359abcdefghij-')).toBe(false)
  })
})
