import type { PixKeyType } from '@/features/beneficiaries/types'

export type TransferStatus = 'COMPLETED' | 'SCHEDULED' | 'FAILED'

export type PixTransfer = {
  id: string
  beneficiaryId?: string
  pixKey?: string
  pixKeyType?: PixKeyType
  amountCents: number
  status: TransferStatus
  createdAt: string
  scheduledFor?: string
  /** Identificador do PIX (simulado). Ausente em transferências feitas antes de a API passar a gerá-lo. */
  endToEndId?: string
  correlationId?: string
}

export type CreatePixInput = {
  amountCents: number
  beneficiaryId?: string
  pixKey?: string
  pixKeyType?: PixKeyType
  scheduledFor?: string
}

export type PixDestination =
  | { mode: 'beneficiary'; beneficiaryId: string }
  | { mode: 'key'; pixKey: string; pixKeyType: PixKeyType }

export type QrPayloadResponse = {
  payload: string
}
