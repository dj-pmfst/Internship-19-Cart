import { useState, useEffect, useCallback } from 'react'
import { api } from '../utils/api'

export function useFetch<T>(path: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    api.get(path)
      .then(d => setData(d))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [path])

  useEffect(() => { load() }, [load])

  return { data, loading, error, reload: load }
}