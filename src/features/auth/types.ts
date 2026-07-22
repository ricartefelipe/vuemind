/**
 * Contrato de autenticação: mock (`authHandlers`) e um futuro backend Spring
 * devolvem exatamente este formato em `POST /auth/login` — a senha nunca
 * volta na resposta, então nem aparece em `AuthUser`.
 */
export type AuthUser = {
  id: string
  name: string
  email: string
}

export type LoginResponse = {
  accessToken: string
  user: AuthUser
}
