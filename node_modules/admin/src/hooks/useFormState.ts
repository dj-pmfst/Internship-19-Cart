import { useState } from 'react'

export function useFormState() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const run = async (fn: () => Promise<void>) => {
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await fn()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { error, success, setSuccess, setError, loading, run }
}