import { http } from '@/shared/http/client'
import type { CreatePixInput, PixTransfer, QrPayloadResponse } from '@/features/transfers/types'

export const transfersApi = {
  createPix: (input: CreatePixInput, idempotencyKey: string): Promise<PixTransfer> =>
    http.post<PixTransfer>('/transfers/pix', input, idempotencyKey),
  getById: (id: string): Promise<PixTransfer> => http.get<PixTransfer>(`/transfers/${id}`),
  getQrPayload: (amountCents: number, pixKey: string): Promise<QrPayloadResponse> => {
    const params = new URLSearchParams({
      amountCents: String(amountCents),
      pixKey,
    })
    return http.get<QrPayloadResponse>(`/transfers/pix/qr-payload?${params.toString()}`)
  },
}
