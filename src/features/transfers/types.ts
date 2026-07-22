/** Comprovante PIX retornado por POST /transfers/pix. */
export type PixTransfer = {
  id: string
  beneficiaryId: string
  amountCents: number
  status: 'COMPLETED'
  createdAt: string
}

export type CreatePixInput = {
  beneficiaryId: string
  amountCents: number
}
