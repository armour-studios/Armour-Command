'use client'

import { useState } from 'react'
import { sendAIMessage } from '@/app/actions/ai'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface AIAssistantProps {
  organizationId: string
  teamId?: string
}

export function AIAssistant({ organizationId, teamId }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [usage, setUsage] = useState({ used: 0, limit: 50 })

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const result = await sendAIMessage({
        organization_id: organizationId,
        team_id: teamId,
        message: input,
        context: teamId ? 'team' : 'org',
      })

      if (result.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.message,
        }
        setMessages(prev => [...prev, assistantMessage])
        setUsage({
          used: result.usage.messagesUsed,
          limit: result.usage.messagesLimit || 50,
        })
      } else {
        alert('Error: ' + result.error)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="flex flex-col h-96 bg-slate-800 border-slate-700">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-center">
            <p>Ask me about your organization, teams, schedules, and more!</p>
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-100'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-slate-700 p-4 space-y-3">
        <div className="text-xs text-slate-400">
          Messages: {usage.used}/{usage.limit}
        </div>
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={loading}
            className="bg-slate-700 border-slate-600"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Send
          </Button>
        </form>
      </div>
    </Card>
  )
}
