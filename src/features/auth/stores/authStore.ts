/**
 * Única store que guarda uma credencial sensível: `accessToken` é
 * persistido em `localStorage` via `pinia-plugin-persistedstate` (mesma
 * estratégia da `settingsStore`) para sobreviver a um F5 — não é o ideal
 * para produção (um XSS rouba o token de `localStorage`), mas é o padrão
 * didático deste projeto; a evolução real seria um cookie `HttpOnly`
 * emitido pelo backend.
 *
 * `isAuthenticated` é um *getter* derivado de `accessToken`, nunca um
 * boolean próprio: assim não existe o estado impossível "token nulo mas
 * isAuthenticated true", que seria a fonte clássica de bug no guard de
 * rota (Task 5, `router/index.ts`).
 */
import { defineStore } from 'pinia'
import { authApi } from '@/features/auth/api/authApi'
import type { AuthUser } from '@/features/auth/types'

type AuthState = {
  user: AuthUser | null
  accessToken: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
  }),
  getters: {
    isAuthenticated: (state): boolean => state.accessToken !== null,
  },
  actions: {
    async login(email: string, password: string): Promise<void> {
      const { accessToken, user } = await authApi.login(email, password)
      this.accessToken = accessToken
      this.user = user
    },
    logout(): void {
      this.accessToken = null
      this.user = null
    },
  },
  persist: {
    pick: ['accessToken', 'user'],
  },
})
