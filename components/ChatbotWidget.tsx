'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MessageCircle, X, Send } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  escalate?: boolean
}

const theme = {
  colors: {
    primary: '#020035',
    secondary: '#FEB21A',
    error: '#BA1A1A',
    success: '#2E7D32'
  }
}

export default function ChatbotWidget() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showEscalate, setShowEscalate] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)
    setShowEscalate(false)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      })

      const data = await response.json()

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Sorry, I could not process that.', escalate: data.escalate }])
      setShowEscalate(Boolean(data.escalate))
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleEscalate = () => {
    router.push('/enquiry/new')
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className='fixed bottom-8 right-8 z-[50] w-16 h-16 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center'
        style={{ backgroundColor: theme.colors.secondary, color: theme.colors.primary }}
        title='Open chat'
      >
        <MessageCircle size={28} />
      </button>
    )
  }

  return (
    <div className='fixed bottom-8 right-8 z-[50] w-96 h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden' style={{ backgroundColor: '#fff' }}>
      <div className='flex items-center justify-between p-4' style={{ backgroundColor: theme.colors.primary }}>
        <div>
          <h3 className='text-white font-bold'>UniLink Assistant</h3>
          <p className='text-white/60 text-xs'>Hi there! Ask me anything</p>
        </div>
        <button
          onClick={() => {
            setIsOpen(false)
            setMessages([])
            setShowEscalate(false)
            setLoading(false)
          }}
          className='text-white hover:bg-white/10 p-2 rounded-lg transition-all'
        >
          <X size={20} />
        </button>
      </div>

      <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50'>
        {showEscalate && (
          <div className='p-3 rounded-lg border border-yellow-400 bg-yellow-100 text-yellow-900 text-sm'>
            This seems complex — Submit as Enquiry
            <button onClick={handleEscalate} className='ml-2 px-2 py-1 bg-yellow-300 rounded text-xs font-semibold'>
              Open enquiry form
            </button>
          </div>
        )}

        {messages.length === 0 ? (
          <div className='flex items-center justify-center h-full text-center flex-col space-y-3'>
            <MessageCircle size={48} className='text-gray-300' />
            <div>
              <p className='text-gray-600 font-semibold'>Welcome to UniLink Assistant</p>
              <p className='text-gray-400 text-sm mt-1'>Ask me about admissions, fees, visas, academic policies, and more</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-3 rounded-lg ${msg.role === 'user' ? 'text-white bg-blue-800 rounded-br-sm' : 'text-gray-900 bg-gray-200 rounded-bl-sm'}`}>
                <p className='text-sm'>{msg.content}</p>
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className='flex justify-start'>
            <div className='max-w-xs px-4 py-3 rounded-lg bg-gray-200 rounded-bl-sm'>
              <span className='text-sm text-gray-600'>Typing</span>
              <span className='text-sm text-gray-600 animate-pulse'>...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className='p-4 border-t border-gray-200 flex gap-2'>
        <input
          type='text'
          placeholder='Ask me something...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={loading}
          className='flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 disabled:bg-gray-100'
          style={{ '--tw-ring-color': theme.colors.secondary } as any}
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
          className='p-2 rounded-lg hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <Send size={20} style={{ color: theme.colors.primary }} />
        </button>
      </div>
    </div>
  )
}
