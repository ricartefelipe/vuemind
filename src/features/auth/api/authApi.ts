import { http } from '@/shared/http/client'
import type { LoginResponse } from '@/features/auth/types'

export const authApi = {
  login: (email: string, password: string): Promise<LoginResponse> =>
    http.post<LoginResponse>('/auth/login', { email, password }),
}
