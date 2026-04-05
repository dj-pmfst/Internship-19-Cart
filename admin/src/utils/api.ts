export const API = 'http://localhost:3000'

export const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
  'Content-Type': 'application/json',
})

const request = async (path: string, options: RequestInit = {}) => {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers || {}),
    },
  })
  const json = await res.json()
  if (!res.ok) {
    const message = Array.isArray(json.message) ? json.message[0] : json.message
    throw new Error(message || 'Request failed')
  }
  return json.data
}

export const api = {
  get: (path: string) => request(path),
  post: (path: string, body: unknown) =>
    request(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: (path: string, body: unknown) =>
    request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path: string) => request(path, { method: 'DELETE' }),
}