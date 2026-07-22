/**
 * Única porta de entrada para autenticação: a `authStore` não conhece o
 * path `/auth/login` nem o formato do body — só chama `authApi.login` e
 * recebe token + usuário já tipados via `LoginResponse`.
 */
import { http } from '@/shared/http/client'
import type { LoginResponse } from '@/features/auth/types'

export const authApi = {
  login: (email: string, password: string): Promise<LoginResponse> =>
    http.post<LoginResponse>('/auth/login', { email, password }),
}
