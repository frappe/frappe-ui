import type { Component, Plugin } from 'vue'

type UseCallOptions = {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  immediate?: boolean
}

type UseCallResult<TResponse> = {
  data: TResponse | null
  error: Error | null
  loading: boolean
  submit: () => Promise<TResponse | null>
}

export const Button: Component
export const ErrorMessage: Component
export const FrappeUI: Plugin

export function useCall<TResponse = unknown>(
  options: UseCallOptions,
): UseCallResult<TResponse>
