const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

/**
 * Wrapper fino sobre fetch: monta a URL completa, injeta o token de staff
 * (quando existir) e padroniza erros — tanto de rede (backend fora do ar)
 * quanto de resposta HTTP não-2xx (usa a mensagem que a API já devolve).
 */
export async function apiFetch<T>(
  path: string,
  token: string | null,
  options: RequestInit = {},
): Promise<T> {
  let res: Response

  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })
  } catch {
    throw new ApiError('Não foi possível conectar à API. Confirma se o backend está rodando.', 0)
  }

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new ApiError(data?.error ?? `Erro ${res.status}`, res.status)
  }

  return data as T
}