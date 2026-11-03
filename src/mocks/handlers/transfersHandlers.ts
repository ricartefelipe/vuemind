import { http, HttpResponse } from 'msw'
import type { Db, Transfer } from '@/mocks/data/db'
import { getDb } from '@/mocks/data/db'
import { createEndToEndId } from '@/mocks/data/endToEndId'
import { createCorrelationId } from '@/shared/utils/id'
import type { ApiErrorBody } from '@/shared/types/api'

export type ExecutePixInput = {
  beneficiaryId: string
  amountCents: number
  idempotencyKey: string
  correlationId?: string
}

/** O código é gerado na confirmação; um novo sorteio cobre a colisão, improvável, com um já emitido. */
function uniqueEndToEndId(db: Db, date: Date): string {
  let id = createEndToEndId(date)
  while (db.transfers.some((item) => item.endToEndId === id)) {
    id = createEndToEndId(date)
  }
  return id
}

export function executePix(db: Db, input: ExecutePixInput): Transfer {
  const cached = db.idempotency.get(input.idempotencyKey)
  if (cached) return cached

  const beneficiary = db.beneficiaries.find((item) => item.id === input.beneficiaryId)
  if (!beneficiary) {
    throw new Error('BENEFICIARY_NOT_FOUND')
  }
  if (!Number.isInteger(input.amountCents) || input.amountCents <= 0) {
    throw new Error('INVALID_AMOUNT')
  }
  if (db.availableCents < input.amountCents) {
    throw new Error('INSUFFICIENT_FUNDS')
  }

  db.availableCents -= input.amountCents

  const now = new Date()
  const transfer: Transfer = {
    id: crypto.randomUUID(),
    beneficiaryId: input.beneficiaryId,
    amountCents: input.amountCents,
    status: 'COMPLETED',
    createdAt: now.toISOString(),
    endToEndId: uniqueEndToEndId(db, now),
    correlationId: input.correlationId ?? createCorrelationId(),
  }
  db.transfers.push(transfer)
  db.transactions.unshift({
    id: crypto.randomUUID(),
    type: 'PIX_OUT',
    amountCents: input.amountCents,
    description: `PIX para ${beneficiary.name}`,
    createdAt: transfer.createdAt,
    counterparty: beneficiary.name,
  })
  db.idempotency.set(input.idempotencyKey, transfer)

  return transfer
}

const ERROR_STATUS: Record<string, number> = {
  BENEFICIARY_NOT_FOUND: 400,
  INVALID_AMOUNT: 400,
  INSUFFICIENT_FUNDS: 409,
}

const ERROR_MESSAGE: Record<string, string> = {
  BENEFICIARY_NOT_FOUND: 'Favorecido não encontrado.',
  INVALID_AMOUNT: 'O valor da transferência deve ser positivo.',
  INSUFFICIENT_FUNDS: 'Saldo insuficiente para completar essa transferência.',
}

function toApiError(code: string, correlationId: string): ApiErrorBody {
  return {
    code,
    message: ERROR_MESSAGE[code] ?? 'Erro ao processar a transferência.',
    correlationId,
  }
}

export const transfersHandlers = [
  http.post('*/api/v1/transfers/pix', async ({ request }) => {
    const db = getDb()
    const correlationId = request.headers.get('X-Correlation-Id') ?? createCorrelationId()
    const idempotencyKey = request.headers.get('Idempotency-Key') ?? crypto.randomUUID()
    const body = (await request.json()) as { beneficiaryId: string; amountCents: number }

    try {
      const transfer = executePix(db, { ...body, idempotencyKey, correlationId })
      return HttpResponse.json(transfer, { status: 201 })
    } catch (error) {
      const code = error instanceof Error ? error.message : 'UNKNOWN_ERROR'
      const status = ERROR_STATUS[code] ?? 400
      return HttpResponse.json(toApiError(code, correlationId), { status })
    }
  }),

  http.get('*/api/v1/transfers/:id', ({ params }) => {
    const db = getDb()
    const transfer = db.transfers.find((item) => item.id === params.id)
    if (!transfer) {
      return HttpResponse.json(
        toApiError('TRANSFER_NOT_FOUND', createCorrelationId()),
        { status: 404 },
      )
    }
    return HttpResponse.json(transfer)
  }),
]
