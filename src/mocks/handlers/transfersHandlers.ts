/**
 * `executePix` é a REGRA DE NEGÓCIO da transferência, escrita como função pura
 * (recebe o `db`, devolve o `Transfer` ou lança um `Error`). Ela não sabe nada
 * de HTTP, status code ou MSW — por isso é trivial testar com `expect(...)
 * .toThrowError(...)` sem subir rede nenhuma.
 *
 * O handler MSW abaixo é só a "casca HTTP": lê o body/headers da requisição,
 * chama `executePix`, e traduz o resultado (ou o erro) para o formato do
 * contrato (`Transfer` / `ApiError`). Essa separação é a mesma que existirá
 * no backend Spring: um `PixService` puro por trás de um `@RestController`.
 */
import { http, HttpResponse } from 'msw'
import type { Db, Transfer } from '@/mocks/data/db'
import { getDb } from '@/mocks/data/db'
import { createCorrelationId } from '@/shared/utils/id'
import type { ApiErrorBody } from '@/shared/types/api'

export type ExecutePixInput = {
  beneficiaryId: string
  amountCents: number
  idempotencyKey: string
}

/**
 * Códigos de erro usados como `message` do `Error` (mesmo estilo de
 * `parseReaisToCents` em `shared/utils/money.ts`: o "código de negócio" É a
 * mensagem). O handler HTTP mapeia esse código para status + `ApiErrorBody`.
 */
export function executePix(db: Db, input: ExecutePixInput): Transfer {
  // Idempotência primeiro: se já processamos essa chave, devolve o mesmo
  // comprovante sem tocar no saldo — protege contra retry de rede/duplo clique.
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

  const transfer: Transfer = {
    id: crypto.randomUUID(),
    beneficiaryId: input.beneficiaryId,
    amountCents: input.amountCents,
    status: 'COMPLETED',
    createdAt: new Date().toISOString(),
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

/** Mapa código de negócio → status HTTP, igual a uma tabela de exceptions no Spring. */
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
      const transfer = executePix(db, { ...body, idempotencyKey })
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
