'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { theme } from '@/lib/theme'
import { toast } from 'sonner'
import ChatbotWidget from '@/components/ChatbotWidget'

export default function EnquiryDetailPage() {
  const router = useRouter()
  const params = useParams()
  const enquiryId = params.id as string
  const supabase = createClient()
  
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [enquiry, setEnquiry] = useState<any>(null)
  const [replyText, setReplyText] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [rating, setRating] = useState(0)
  const [feedbackComment, setFeedbackComment] = useState('')
  const [sending, setSending] = useState(false)
  const [submittingFeedback, setSubmittingFeedback] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [isAiThinking, setIsAiThinking] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) {
        router.push('/login')
        return
      }
      setUser(currentUser)

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single()
      setUserProfile(profile)

      const { data: enquiryData } = await supabase
        .from('enquiries')
        .select('*')
        .eq('id', enquiryId)
        .single()

      if (enquiryData) {
        setEnquiry(enquiryData)
        if (enquiryData.status === 'resolved' || enquiryData.status === 'closed') {
          setShowFeedback(true)
          setRating(enquiryData.feedback_rating || 0)
          setFeedbackComment(enquiryData.feedback_comment || '')
        }
      } else {
        toast.error('Không tìm thấy enquiry')
        router.push('/dashboard/student')
        return
      }

      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .eq('enquiry_id', enquiryId)
        .order('created_at', { ascending: true })

      if (messagesData) {
        setMessages(messagesData)
      }

      setLoading(false)
    }

    fetchData()
  }, [supabase, router, enquiryId])

  const getAiReply = async (userMessage: string, conversationHistory: any[]) => {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: conversationHistory.map(m => ({
            role: m.sender_id === user?.id ? 'user' : 'assistant',
            content: m.content
          }))
        })
      })
      const data = await response.json()
      return data.reply
    } catch (error) {
      console.error('AI reply error:', error)
      return null
    }
  }

  const handleSendReply = async () => {
    if (!replyText.trim()) return
    setSending(true)

    try {
      const { data: userMessage, error: userError } = await supabase
        .from('messages')
        .insert({
          enquiry_id: enquiryId,
          sender_id: user.id,
          content: replyText,
          is_internal: false
        })
        .select()
        .single()

      if (userError) {
        toast.error('Không thể gửi phản hồi: ' + userError.message)
        setSending(false)
        return
      }

      const updatedMessages = [...messages, userMessage]
      setMessages(updatedMessages)
      setReplyText('')
      toast.success('Đã gửi phản hồi')
      
      setIsAiThinking(true)
      const aiReply = await getAiReply(replyText, updatedMessages)
      
      if (aiReply) {
        const { data: aiMessage, error: aiError } = await supabase
          .from('messages')
          .insert({
            enquiry_id: enquiryId,
            sender_id: user.id,
            content: `🤖 **UniLink AI:** ${aiReply}`,
            is_internal: false
          })
          .select()
          .single()
        
        if (!aiError) {
          setMessages(prev => [...prev, aiMessage])
          toast.info('AI đã trả lời')
        }
      } else {
        toast.info('AI không thể trả lời lúc này. Staff sẽ phản hồi sau.')
      }
      
      setIsAiThinking(false)
      
    } catch (err) {
      console.error('Error:', err)
      toast.error('Có lỗi xảy ra')
    } finally {
      setSending(false)
    }
  }

  const handleMarkResolved = async () => {
    const { error } = await supabase
      .from('enquiries')
      .update({ status: 'resolved', updated_at: new Date().toISOString() })
      .eq('id', enquiryId)

    if (error) {
      toast.error('Không thể đánh dấu đã xử lý')
    } else {
      toast.success('Enquiry đã được đánh dấu là đã xử lý')
      setShowFeedback(true)
      setEnquiry({ ...enquiry, status: 'resolved' })
    }
  }

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      toast.error('Vui lòng chọn số sao đánh giá')
      return
    }

    setSubmittingFeedback(true)
    const { error } = await supabase
      .from('enquiries')
      .update({
        feedback_rating: rating,
        feedback_comment: feedbackComment,
        status: 'closed',
        updated_at: new Date().toISOString()
      })
      .eq('id', enquiryId)

    if (error) {
      toast.error('Không thể gửi feedback')
    } else {
      toast.success('Cảm ơn bạn đã đánh giá!')
      setTimeout(() => {
        window.location.href = '/dashboard/student?feedback=' + Date.now()
      }, 1000)
    }
    setSubmittingFeedback(false)
  }

  const formatMessage = (msg: any) => {
    const isAI = msg.content?.startsWith('🤖')
    const isStaff = !isAI && msg.sender_id !== user?.id
    
    let senderName = ''
    let type = 'student' // student = trái, ai/staff = phải
    
    if (isAI) {
      senderName = 'UniLink AI'
      type = 'ai'
    } else if (isStaff) {
      senderName = 'Academic Staff'
      type = 'staff'
    } else {
      senderName = userProfile?.full_name || 'Student'
      type = 'student'
    }
    
    const time = new Date(msg.created_at).toLocaleString('vi-VN')
    let content = msg.content
    if (isAI) {
      content = msg.content.replace('🤖 **UniLink AI:** ', '')
    }
    
    return {
      type: type,
      name: senderName,
      time: time,
      text: content,
      isAI: isAI
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: theme.colors.primary }}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const displayName = userProfile?.full_name || user?.email?.split('@')[0] || 'Student'
  const studentId = userProfile?.student_id || 'N/A'

  const getCategoryText = (cat: string) => {
    const map: { [key: string]: string } = {
      'academic': 'Academic - Học thuật',
      'visa_international': 'Visa & International',
      'graduation_career': 'Graduation & Career',
      'welfare': 'Welfare',
      'financial': 'Financial',
      'other': 'Other'
    }
    return map[cat] || 'Academic - Học thuật'
  }

  const getStatusText = (status: string) => {
    return status === 'assigned' ? 'Assigned' : status === 'open' ? 'Open' : status || 'Assigned'
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 bg-gradient-to-r from-[#020035] to-[#151546] backdrop-blur-xl flex justify-between items-center px-4 md:px-8 h-16 shadow-lg">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/student" className="text-white hover:bg-white/10 p-2 rounded-lg transition-all active:scale-95">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#FEB21A] tracking-widest uppercase">Academic Curator</span>
            <h1 className="text-white font-black text-base md:text-lg tracking-tight">Detail Enquiry View</h1>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            <Link href="/dashboard/student" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Dashboard</Link>
            <Link href="/enquiry/new" className="text-[#FEB21A] border-b-2 border-[#FEB21A] pb-1 text-sm font-medium">Enquiries</Link>
            <Link href="/appointments" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Resources</Link>
            <Link href="/search" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Archives</Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-slate-300 cursor-pointer hover:text-white transition-colors">notifications</span>
            <span className="material-symbols-outlined text-slate-300 cursor-pointer hover:text-white transition-colors">help_outline</span>
            <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-white overflow-hidden flex items-center justify-center">
              👤
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-32 px-4 md:px-8 max-w-[1600px] mx-auto">
        {/* Sub-Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-slate-600 font-medium text-sm">#{enquiry?.id?.slice(-6) || 'ENQ-8821'}</span>
              <span className="px-3 py-0.5 rounded-full border border-[#FEB21A] text-[#7f5600] text-[11px] font-bold uppercase tracking-wider bg-[#FEB21A]/10">
                {getCategoryText(enquiry?.category)}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-primary tracking-tight">{enquiry?.title}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#FEB21A] animate-pulse"></span>
              <span className="text-sm font-semibold tracking-wide">Status: {getStatusText(enquiry?.status)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          {/* Left Panel: Enquiry Info */}
          <section className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-slate-200 rounded-xl flex items-center justify-center text-2xl overflow-hidden">👤</div>
                <div>
                  <h3 className="text-xl font-black text-primary">{displayName}</h3>
                  <p className="text-slate-600 text-sm font-medium">Student ID: {studentId}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Submission Date</span>
                  <p className="text-slate-900 font-medium">{enquiry?.created_at ? new Date(enquiry.created_at).toLocaleString('vi-VN') : '20/05/2024, 14:00'}</p>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Enquiry Description</span>
                  <div className="bg-slate-50 p-5 rounded-xl text-slate-700 text-sm leading-relaxed border-l-4 border-[#FEB21A]">
                    {enquiry?.description}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Attached Documents</span>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3"><span className="text-red-500">📄</span><span className="text-sm font-medium text-slate-900">transcript.pdf</span></div>
                      <span className="text-slate-400">⬇️</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3"><span className="text-blue-600">📋</span><span className="text-sm font-medium text-slate-900">request_form.docx</span></div>
                      <span className="text-slate-400">⬇️</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SLA Timer */}
            <div className="bg-primary p-6 rounded-xl text-white flex items-center justify-between overflow-hidden relative shadow-lg">
              <div className="z-10">
                <p className="text-[10px] font-bold text-[#FEB21A] uppercase tracking-widest mb-1">Response Progress</p>
                <div className="flex items-baseline gap-2"><span className="text-3xl font-black text-[#FEB21A]">4h 22m</span><span className="text-white/60 text-sm font-medium">/ 24h SLA</span></div>
                <div className="mt-4 w-48 h-2 bg-white/10 rounded-full overflow-hidden"><div className="bg-[#FEB21A] h-full" style={{width: '18.2%'}}></div></div>
              </div>
              <div className="relative z-10 w-16 h-16">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#FEB21A" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="205" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center"><span className="material-symbols-outlined text-[#FEB21A] text-xl">timer</span></div>
              </div>
            </div>
          </section>

          {/* Right Panel: Communication Thread */}
          <section className="lg:col-span-6 flex flex-col h-[750px] bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
            <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden flex items-center justify-center text-sm">👤</div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-primary overflow-hidden flex items-center justify-center text-sm">👨‍💼</div>
                </div>
                <span className="text-sm font-bold text-primary">Conversation History</span>
              </div>
              <span className="text-[11px] font-medium text-slate-600">{messages.length === 0 ? 'No messages yet' : `${messages.length} messages`}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4"><span className="text-3xl">💬</span></div>
                  <p className="text-sm font-medium">No messages yet</p>
                  <p className="text-xs mt-1">Be the first to respond to this enquiry</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const formatted = formatMessage(msg)
                  // student: bên trái, ai/staff: bên phải
                  const isRight = formatted.type === 'ai' || formatted.type === 'staff'
                  return (
                    <div key={idx} className={`flex gap-4 ${isRight ? 'flex-row-reverse' : ''} max-w-[90%] ${isRight ? 'ml-auto' : ''}`}>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full mt-6 flex items-center justify-center text-lg ${
                        isRight ? 'bg-[#020035]' : 'bg-slate-200'
                      }`}>
                        {formatted.type === 'ai' ? '🤖' : (isRight ? '👨‍💼' : '👤')}
                      </div>
                      <div className={`flex flex-col ${isRight ? 'items-end' : 'items-start'} gap-1`}>
                        <div className={`flex items-center gap-2 px-1 ${isRight ? 'flex-row-reverse' : ''}`}>
                          <span className={`text-[11px] font-bold ${formatted.isAI ? 'text-[#FEB21A]' : 'text-primary'} uppercase`}>
                            {formatted.name}
                          </span>
                          <span className="text-[10px] text-slate-600">{formatted.time}</span>
                        </div>
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                          isRight 
                            ? 'bg-[#020035] text-white rounded-tr-none' 
                            : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none'
                        }`}>
                          {formatted.text}
                          {formatted.isAI && (
                            <div className="mt-2 pt-2 border-t border-white/20 text-[10px] text-white/60 flex items-center gap-1">
                              <span>🤖</span> Generated by AI
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
              {isAiThinking && (
                <div className="flex justify-end">
                  <div className="bg-[#020035] text-white p-3 rounded-xl rounded-tr-none">
                    <div className="flex gap-1 items-center">
                      <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      <span className="text-xs ml-1">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reply Area */}
            {enquiry?.status !== 'resolved' && enquiry?.status !== 'closed' && (
              <div className="bg-white p-6 border-t border-slate-200">
                <div className="mb-4">
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#FEB21A] focus:border-[#FEB21A] placeholder:text-slate-400 transition-all resize-none h-24 outline-none"
                    placeholder="Type your response to the student... / Nhập phản hồi cho sinh viên..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button className="flex items-center gap-2 text-primary font-bold text-sm hover:bg-slate-100 px-4 py-2 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-lg">attach_file</span>
                    Attach File
                  </button>
                  <button 
                    onClick={handleSendReply}
                    disabled={sending || !replyText.trim()}
                    className="bg-[#FEB21A] text-primary font-black px-8 py-2.5 rounded-lg flex items-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {sending ? 'Sending...' : 'Send Response'}
                    <span className="material-symbols-outlined text-lg">send</span>
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-400 text-center">
                  <span className="inline-flex items-center gap-1">🤖 <span>AI sẽ tự động trả lời sau khi bạn gửi</span></span>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Feedback Section */}
        {showFeedback && (
          <div className="mt-12 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="w-16 h-16 bg-[#FEB21A]/20 text-[#FEB21A] rounded-full flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-3xl">verified</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary">This enquiry has been marked as Resolved.</h3>
                <p className="text-slate-600 mt-2 text-sm">Please take a moment to rate the assistance you received.</p>
              </div>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-4xl transition-all ${star <= rating ? 'text-[#FEB21A]' : 'text-slate-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#FEB21A] h-28 outline-none"
                placeholder="Feedback của bạn về việc xử lý enquiry này / Your feedback on this enquiry resolution"
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
              />
              <button 
                onClick={handleSubmitFeedback}
                disabled={submittingFeedback || rating === 0}
                className="bg-[#FEB21A] text-primary font-black px-10 py-3 rounded-xl shadow-lg hover:brightness-110 transition-all disabled:opacity-50"
              >
                {submittingFeedback ? 'Đang gửi...' : 'Submit Feedback / Gửi Feedback'}
              </button>
            </div>
          </div>
        )}

        {/* Privacy Footer */}
        <footer className="mt-16 py-8 border-t border-slate-200">
          <p className="text-center text-xs text-slate-500 leading-relaxed max-w-2xl mx-auto italic">
            Thông tin enquiry và trao đổi được bảo mật theo quy định bảo vệ dữ liệu của ABC University và chỉ sử dụng cho mục đích hỗ trợ.
          </p>
        </footer>
      </main>

      {/* Staff Floating Actions Bar */}
      {enquiry?.status !== 'resolved' && enquiry?.status !== 'closed' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-slate-200 px-4 md:px-6 py-4 rounded-2xl shadow-lg flex items-center gap-2 md:gap-3 z-50 w-[90%] md:w-auto overflow-x-auto whitespace-nowrap">
          <button className="px-4 md:px-6 py-2.5 rounded-xl text-primary font-bold text-sm border-2 border-primary hover:bg-primary hover:text-white transition-all active:scale-95 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">person_add</span>
            Assign
          </button>
          <button className="px-4 md:px-6 py-2.5 rounded-xl text-[#7f5600] font-bold text-sm border-2 border-[#FEB21A] hover:bg-[#FEB21A] hover:text-primary transition-all active:scale-95 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">trending_up</span>
            Escalate
          </button>
          <div className="h-8 w-px bg-slate-300 mx-1 md:mx-2 hidden sm:block"></div>
          <button 
            onClick={handleMarkResolved}
            className="px-6 md:px-8 py-2.5 rounded-xl bg-primary text-white font-black text-sm shadow-lg hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">check_circle</span>
            Mark Resolved
          </button>
        </div>
      )}

      <ChatbotWidget />
    </div>
  )
}