/**
 * CRUD simples de favorecidos: sem banco real, então "criar" é dar `push` no
 * array e "remover" é filtrar por id. É o suficiente para exercitar a UI de
 * favorecidos sem precisar de um backend de verdade.
 */
import { http, HttpResponse } from 'msw'
import { getDb } from '@/mocks/data/db'
import { createCorrelationId } from '@/shared/utils/id'
import type { ApiErrorBody } from '@/shared/types/api'

type CreateBeneficiaryBody = {
  name: string
  pixKey: string
}

export const beneficiariesHandlers = [
  http.get('*/api/v1/beneficiaries', () => {
    const db = getDb()
    return HttpResponse.json({ items: db.beneficiaries })
  }),

  http.post('*/api/v1/beneficiaries', async ({ request }) => {
    const db = getDb()
    const { name, pixKey } = (await request.json()) as CreateBeneficiaryBody

    if (!name?.trim() || !pixKey?.trim()) {
      const error: ApiErrorBody = {
        code: 'INVALID_BENEFICIARY',
        message: 'Nome e chave PIX são obrigatórios.',
        correlationId: request.headers.get('X-Correlation-Id') ?? createCorrelationId(),
      }
      return HttpResponse.json(error, { status: 400 })
    }

    const beneficiary = { id: crypto.randomUUID(), name, pixKey }
    db.beneficiaries.push(beneficiary)
    return HttpResponse.json(beneficiary, { status: 201 })
  }),

  http.delete('*/api/v1/beneficiaries/:id', ({ params }) => {
    const db = getDb()
    const index = db.beneficiaries.findIndex((item) => item.id === params.id)
    if (index === -1) {
      const error: ApiErrorBody = {
        code: 'BENEFICIARY_NOT_FOUND',
        message: 'Favorecido não encontrado.',
        correlationId: createCorrelationId(),
      }
      return HttpResponse.json(error, { status: 404 })
    }
    db.beneficiaries.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
