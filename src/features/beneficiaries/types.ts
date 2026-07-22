/**
 * Favorecido PIX: só o mínimo que a UI e o contrato `/api/v1/beneficiaries`
 * precisam. A chave PIX fica opaca (e-mail, CPF, CNPJ ou EVP) — validar
 * formato real de chave fica para o backend Spring, não para o front de estudo.
 */
export type Beneficiary = {
  id: string
  name: string
  pixKey: string
}

export type CreateBeneficiaryInput = {
  name: string
  pixKey: string
}

export type BeneficiariesResponse = {
  items: Beneficiary[]
}
