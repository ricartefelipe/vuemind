export class ApiError extends Error {
  readonly code: string
  readonly correlationId: string
  readonly status: number

  constructor(
    status: number,
    code: string,
    message: string,
    correlationId: string,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.correlationId = correlationId
  }
}
