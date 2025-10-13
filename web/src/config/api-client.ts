import axios, {
  AxiosHeaders,
  AxiosRequestConfig,
  AxiosRequestHeaders
} from 'axios'

import { ApiError } from '@/utils'

import env from './environment'

const apiBasePath = env.API_BASE_URL + `/${env.API_VERSION}/`

const apiClient = axios.create({
  baseURL: apiBasePath,
  timeout: 10000
})

interface RetryableAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean
  headers?: AxiosRequestHeaders
}

apiClient.defaults.headers.common['Content-Type'] = 'application/json'

// Function to get auth token from authStore
const getAuthToken = (): string | null => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { useAuthStore } = require('@/stores/authStore')
    return useAuthStore.getState().getAuthToken()
  } catch {
    return null
  }
}

// Function to handle token refresh from authStore
const handleTokenRefresh = async (): Promise<string | null> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { useAuthStore } = require('@/stores/authStore')
    return await useAuthStore.getState().handleTokenRefresh()
  } catch {
    return null
  }
}

// Function to logout from authStore
const logout = (): void => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { useAuthStore } = require('@/stores/authStore')
    useAuthStore.getState().logout()
  } catch {
    // Ignore if store is not available
  }
}

apiClient.interceptors.request.use(
  config => {
    const authToken = getAuthToken()
    const publicEndpoints = ['/token/', '/token/refresh/']
    if (
      authToken &&
      config.headers &&
      !publicEndpoints.includes(config.url || '')
    ) {
      config.headers.Authorization = `Bearer ${authToken}`
    }
    return config
  },
  error => {
    if (error instanceof Error) {
      return Promise.reject(error)
    }
    return Promise.reject(new Error(String(error ?? 'Request error')))
  }
)

apiClient.interceptors.response.use(
  response => response,
  async (error: unknown) => {
    if (axios.isAxiosError(error) && error.response && error.config) {
      const originalRequest = error.config as RetryableAxiosRequestConfig

      if (
        !originalRequest._retry &&
        error.response.status === 401 &&
        (error.response.data as { code?: string })?.code === 'token_not_valid'
      ) {
        originalRequest._retry = true
        console.log('Token expired, attempting refresh via authStore...')

        try {
          const newAccessToken = await handleTokenRefresh()

          if (newAccessToken) {
            console.log(
              'Token refreshed successfully, retrying original request.'
            )

            const newHeaders = AxiosHeaders.from(originalRequest.headers)
            newHeaders['Authorization'] = `Bearer ${newAccessToken}`
            originalRequest.headers = newHeaders
            return apiClient(originalRequest as AxiosRequestConfig)
          }
          console.error('Failed to refresh token (authStore returned null).')
          return Promise.reject(
            new ApiError(
              'Session expired. Please login again.',
              401,
              error.response?.data
            )
          )
        } catch (refreshCatchError) {
          console.error(
            'Error during token refresh attempt:',
            refreshCatchError
          )
          logout()
          return Promise.reject(
            new ApiError(
              'Session refresh failed. Please login again.',
              401,
              refreshCatchError
            )
          )
        }
      }
    }

    if (axios.isAxiosError(error)) {
      const message = (error.response?.data?.detail as string) || error.message
      const status = error.response?.status
      const data = error.response?.data as object
      return Promise.reject(new ApiError(message, status, data))
    } else if (error instanceof Error) {
      return Promise.reject(new Error(error.message))
    }
    return Promise.reject(new Error('An unexpected error occurred'))
  }
)

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (axios.isAxiosError(error)) {
      const message = (error.response?.data?.detail as string) || error.message
      const status = error.response?.status
      const data = error.response?.data as object
      return Promise.reject(new ApiError(message, status, data))
    } else if (error instanceof Error) {
      return Promise.reject(new Error(error.message))
    }
    return Promise.reject(new Error('An unexpected error occurred'))
  }
)

export default apiClient
