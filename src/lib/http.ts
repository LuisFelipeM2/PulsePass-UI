import { z } from 'zod'

const ErrorResponseSchema = z
  .object({
    timestamp: z.string().optional(),
    status: z.number().optional(),
    error: z.string().optional(),
    message: z.string().optional(),
    details: z.record(z.string(), z.string()).optional(),
  })
  .passthrough()
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export class ApiError extends Error {
  readonly status: number
  readonly details: Record<string, string>
  constructor(
    status: number,
    message: string,
    details: Record<string, string> = {},
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

export async function solicitar<T>(
  path: string,
  schema: z.ZodType<T>,
  options: RequestInit = {},
): Promise<T> {
  const token = sessionStorage.getItem('pulsepass-token')
  const headers = new Headers(options.headers)
  if (options.body) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })
  } catch {
    throw new ApiError(
      0,
      'No pudimos conectar con el servidor. Intenta de nuevo.',
    )
  }
  if (!response.ok) {
    let message =
      response.status >= 500
        ? 'El servidor encontró un error al procesar la solicitud. Intenta de nuevo.'
        : 'Ocurrió un error. Intenta de nuevo.'
    let details: Record<string, string> = {}
    try {
      const parsed = ErrorResponseSchema.safeParse(await response.json())
      if (parsed.success) {
        if (response.status < 500) message = parsed.data.message ?? message
        details = parsed.data.details ?? {}
      }
    } catch {
      /* respuesta sin JSON */
    }
    if (response.status === 401) {
      sessionStorage.removeItem('pulsepass-token')
      window.dispatchEvent(new Event('pulsepass:unauthorized'))
    }
    throw new ApiError(response.status, message, details)
  }
  if (response.status === 204) return undefined as T
  const data: unknown = await response.json()
  const parsed = schema.safeParse(data)
  if (!parsed.success)
    throw new ApiError(
      502,
      `La respuesta de ${API_BASE_URL}${path} no coincide con el contrato esperado.`,
    )
  return parsed.data
}

export const VacioSchema = z.undefined()
