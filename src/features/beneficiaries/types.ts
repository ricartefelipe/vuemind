export type PixKeyType = 'EMAIL' | 'CPF' | 'PHONE' | 'RANDOM'

export type Beneficiary = {
  id: string
  name: string
  pixKey: string
  pixKeyType: PixKeyType
}

export type CreateBeneficiaryInput = {
  name: string
  pixKey: string
  pixKeyType: PixKeyType
}

export type BeneficiariesResponse = {
  items: Beneficiary[]
}
