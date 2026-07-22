import { beforeEach, describe, expect, it } from 'vitest'
import { getDb, resetDb } from '@/mocks/data/db'
import { executePix } from './transfersHandlers'

describe('executePix', () => {
  beforeEach(() => {
    resetDb()
  })

  it('recusa quando saldo < valor', () => {
    const db = getDb()
    db.availableCents = 100

    expect(() =>
      executePix(db, { beneficiaryId: 'b1', amountCents: 200, idempotencyKey: 'k1' }),
    ).toThrowError(/INSUFFICIENT_FUNDS/)
  })

  it('debita saldo e cria extrato no caminho feliz', () => {
    resetDb()

    const result = executePix(getDb(), {
      beneficiaryId: 'b1',
      amountCents: 1000,
      idempotencyKey: 'k2',
    })

    expect(result.amountCents).toBe(1000)
    expect(getDb().availableCents).toBe(249_000)
  })

  it('recusa favorecido inexistente', () => {
    expect(() =>
      executePix(getDb(), {
        beneficiaryId: 'inexistente',
        amountCents: 100,
        idempotencyKey: 'k3',
      }),
    ).toThrowError(/BENEFICIARY_NOT_FOUND/)
  })

  it('é idempotente: mesma chave devolve o mesmo comprovante sem debitar de novo', () => {
    const first = executePix(getDb(), {
      beneficiaryId: 'b1',
      amountCents: 1000,
      idempotencyKey: 'same-key',
    })
    const balanceAfterFirst = getDb().availableCents

    const second = executePix(getDb(), {
      beneficiaryId: 'b1',
      amountCents: 1000,
      idempotencyKey: 'same-key',
    })

    expect(second).toEqual(first)
    expect(getDb().availableCents).toBe(balanceAfterFirst)
  })

  it('cria uma transação PIX_OUT no extrato após o débito', () => {
    executePix(getDb(), { beneficiaryId: 'b1', amountCents: 500, idempotencyKey: 'k4' })

    const last = getDb().transactions[0]
    expect(last.type).toBe('PIX_OUT')
    expect(last.amountCents).toBe(500)
  })
})
