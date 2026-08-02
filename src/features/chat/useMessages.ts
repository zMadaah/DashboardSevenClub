
import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { ApiError } from '../../lib/api'
import { getMessages, sendStaffMessage, ChatMessage } from './api'

export function useMessages(ticketId: string | null) {
  const { token } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!ticketId) {
      setMessages([])
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)

    getMessages(ticketId, token)
      .then((data) => {
        if (cancelled) return
        setMessages(data)
        setError(null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof ApiError ? err.message : 'Erro ao carregar mensagens')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [ticketId, token])

  async function send(message: string) {
    if (!ticketId || !message.trim()) return
    setSending(true)
    try {
      const created = await sendStaffMessage(ticketId, message.trim(), token)
      setMessages((prev) => [...prev, created])
    } finally {
      setSending(false)
    }
  }

  return { messages, isLoading, error, sending, send }
}