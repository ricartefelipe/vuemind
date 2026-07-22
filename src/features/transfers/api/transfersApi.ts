/**
 * API de transferências. Sempre envie `Idempotency-Key` no createPix —
 * protege contra duplo clique / retry (mesmo padrão do Spring futuro).
 */
import { http } from '@/shared/http/client'
import type { CreatePixInput, PixTransfer } from '@/features/transfers/types'

export const transfersApi = {
  createPix: (input: CreatePixInput, idempotencyKey: string): Promise<PixTransfer> =>
    http.post<PixTransfer>('/transfers/pix', input, idempotencyKey),
  getById: (id: string): Promise<PixTransfer> => http.get<PixTransfer>(`/transfers/${id}`),
}
