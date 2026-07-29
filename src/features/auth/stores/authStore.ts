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
