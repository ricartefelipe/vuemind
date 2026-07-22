/**
 * Porta HTTP dos favorecidos. A store só fala com esta API — trocar MSW
 * por Spring é só mudar o destino do `http` client, sem reescrever a UI.
 */
import { http } from '@/shared/http/client'
import type {
  BeneficiariesResponse,
  Beneficiary,
  CreateBeneficiaryInput,
} from '@/features/beneficiaries/types'

export const beneficiariesApi = {
  list: (): Promise<BeneficiariesResponse> =>
    http.get<BeneficiariesResponse>('/beneficiaries'),
  create: (input: CreateBeneficiaryInput): Promise<Beneficiary> =>
    http.post<Beneficiary>('/beneficiaries', input),
  remove: (id: string): Promise<void> => http.delete<void>(`/beneficiaries/${id}`),
}
