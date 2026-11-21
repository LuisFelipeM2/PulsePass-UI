import { QueryClient } from '@tanstack/react-query'
import { ApiError } from './http'

export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: (count, error) => !(error instanceof ApiError && error.status >= 400 && error.status < 500) && count < 1, staleTime: 30_000 }, mutations: { retry: false } },
})
