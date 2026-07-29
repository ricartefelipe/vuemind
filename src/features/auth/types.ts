export type AuthUser = {
  id: string
  name: string
  email: string
}

export type LoginResponse = {
  accessToken: string
  user: AuthUser
}
