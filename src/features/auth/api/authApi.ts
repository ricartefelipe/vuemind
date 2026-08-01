import { http } from '@/shared/http/client'
import type { LoginResponse } from '@/features/auth/types'

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    return http.post<LoginResponse>('/auth/login', { email, password })
  },
}
