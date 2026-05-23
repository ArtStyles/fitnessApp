import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api/v1'

// ── Token helpers ─────────────────────────────────────────────────────────────

const TOKEN_KEY = 'fitforge_token'

export const tokenStore = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

// ── Axios instance ────────────────────────────────────────────────────────────

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,       // send httpOnly refresh-token cookie
  headers: { 'Content-Type': 'application/json' },
})

// Attach access token to every request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.get()
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// On 401 → try refresh once, then retry original request
let refreshing: Promise<string> | null = null

api.interceptors.response.use(
  res => res,
  async (err: AxiosError) => {
    const original = err.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true

      try {
        if (!refreshing) {
          refreshing = axios
            .post<{ data: { accessToken: string } }>(
              `${BASE_URL}/auth/refresh`,
              {},
              { withCredentials: true }
            )
            .then(r => {
              const token = r.data.data.accessToken
              tokenStore.set(token)
              return token
            })
            .finally(() => { refreshing = null })
        }

        const newToken = await refreshing
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch {
        tokenStore.clear()
        window.dispatchEvent(new Event('auth:logout'))
        return Promise.reject(err)
      }
    }

    return Promise.reject(err)
  }
)

// ── Typed helper wrappers ─────────────────────────────────────────────────────

export async function get<T>(url: string, params?: object): Promise<T> {
  const res = await api.get<{ success: boolean; data: T }>(url, { params })
  return res.data.data
}

/** For list endpoints that return { data: T[], meta: { total, page, limit, totalPages } } */
export async function getList<T>(url: string, params?: object): Promise<{
  items: T[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}> {
  const res = await api.get<{
    success: boolean
    data: T[]
    meta?: { total: number; page: number; limit: number; totalPages: number }
  }>(url, { params })
  return {
    items: res.data.data ?? [],
    meta: res.data.meta ?? { total: res.data.data?.length ?? 0, page: 1, limit: 20, totalPages: 1 },
  }
}

export async function post<T>(url: string, body?: unknown): Promise<T> {
  const res = await api.post<{ success: boolean; data: T }>(url, body)
  return res.data.data
}

export async function put<T>(url: string, body?: unknown): Promise<T> {
  const res = await api.put<{ success: boolean; data: T }>(url, body)
  return res.data.data
}

export async function patch<T>(url: string, body?: unknown): Promise<T> {
  const res = await api.patch<{ success: boolean; data: T }>(url, body)
  return res.data.data
}

export async function del<T>(url: string): Promise<T> {
  const res = await api.delete<{ success: boolean; data: T }>(url)
  return res.data.data
}
