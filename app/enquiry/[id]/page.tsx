'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function EnquiryDetailPage() {
  const [replyText, setReplyText] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [rating, setRating] = useState(0)

  const messages = [
    {
      type: 'student',
      name: 'Nguyễn Văn A',
      avatar: '👨‍🎓',
      time: '20/05/2024, 14:00',
      text: 'Thầy cô cho em hỏi khi nào thì có kết quả xét duyệt đăng ký muộn ạ? Em sợ trễ lịch học buổi đầu tiên của tuần tới.'
    },
    {
      type: 'staff',
      name: 'Academic Staff',
      avatar: '👨‍💼',
      time: '20/05/2024, 15:30',
      text: 'Chào em, yêu cầu của em đã được tiếp nhận và chuyển đến Khoa chuyên môn để xem xét dung lượng lớp. Dự kiến sẽ có kết quả trong vòng 24h làm việc tới. Em vui lòng theo dõi email sinh viên nhé.'
    },
    {
      type: 'student',
      name: 'Nguyễn Văn A',
      avatar: '👨‍🎓',
      time: '20/05/2024, 15:45',
      text: 'Vâng em cảm ơn ạ. Em có gửi kèm bảng điểm và đơn xin học bù ở phần đính kèm, thầy cô kiểm tra giúp em đã đủ giấy tờ chưa nhé.'
    }
  ]

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 bg-gradient-to-r from-[#020035] to-[#151546] backdrop-blur-xl flex justify-between items-center px-4 md:px-8 h-16 shadow-lg">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/student" className="text-white hover:bg-white/10 p-2 rounded-lg transition-all active:scale-95">
            ←
          </Link>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#FEB21A] tracking-widest uppercase">Academic Curator</span>
            <h1 className="text-white font-black text-base md:text-lg tracking-tight">Detail Enquiry View</h1>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            <Link href="/dashboard/student" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Dashboard</Link>
            <Link href="/enquiry/new" className="text-[#FEB21A] border-b-2 border-[#FEB21A] pb-1 text-sm font-medium">New Enquiry</Link>
            <Link href="/appointments" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Appointments</Link>
            <Link href="/search" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Search</Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-300 hover:text-white transition-colors text-lg">🔔</button>
            <button className="text-slate-300 hover:text-white transition-colors text-lg">❓</button>
            <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-white overflow-hidden flex items-center justify-center">
              👨‍💼
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
              <span className="text-slate-600 font-medium text-sm">#ENQ-8821</span>
              <span className="px-3 py-0.5 rounded-full border border-[#FEB21A] text-[#7f5600] text-[11px] font-bold uppercase tracking-wider bg-[#FEB21A]/10">Academic - Học thuật</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-primary tracking-tight">Đăng ký môn học muộn - HK2</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#FEB21A] animate-pulse"></span>
              <span className="text-sm font-semibold tracking-wide">Status: Assigned</span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          {/* Left Panel: Enquiry Info */}
          <section className="lg:col-span-4 flex flex-col gap-6">
            {/* Student Info Card */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-slate-200 rounded-xl flex items-center justify-center text-2xl overflow-hidden">
                  👨‍🎓
                </div>
                <div>
                  <h3 className="text-xl font-black text-primary">Nguyễn Văn A</h3>
                  <p className="text-slate-600 text-sm font-medium">Student ID: 23070983</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Submission Date</span>
                  <p className="text-slate-900 font-medium">20/05/2024, 14:00</p>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Enquiry Description</span>
                  <div className="bg-slate-50 p-5 rounded-xl text-slate-700 text-sm leading-relaxed border-l-4 border-[#FEB21A]">
                    Em chào thầy cô ạ, do lỗi hệ thống nên em chưa kịp đăng ký môn "Cơ sở dữ liệu" trong đợt đăng ký vừa qua. Em mong thầy cô xem xét cho em được bổ sung danh sách lớp học này trong học kỳ 2. Em xin cảm ơn.
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Attached Documents</span>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-red-500">📄</span>
                        <span className="text-sm font-medium text-slate-900">transcript.pdf</span>
                      </div>
                      <span className="text-slate-400 hover:text-primary transition-colors">⬇️</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-blue-600">📋</span>
                        <span className="text-sm font-medium text-slate-900">request_form.docx</span>
                      </div>
                      <span className="text-slate-400 hover:text-primary transition-colors">⬇️</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SLA Timer */}
            <div className="bg-primary p-6 rounded-xl text-white flex items-center justify-between overflow-hidden relative shadow-lg">
              <div className="z-10">
                <p className="text-[10px] font-bold text-[#FEB21A] uppercase tracking-widest mb-1">Response Progress</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#FEB21A]">4h 22m</span>
                  <span className="text-white/60 text-sm font-medium">/ 24h SLA</span>
                </div>
                <div className="mt-4 w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="bg-[#FEB21A] h-full" style={{width: '18.2%'}}></div>
                </div>
              </div>
              <div className="text-[#FEB21A] text-6xl opacity-20">⏱️</div>
            </div>
          </section>

          {/* Right Panel: Communication Thread */}
          <section className="lg:col-span-6 flex flex-col h-[750px] bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
            {/* Thread Header */}
            <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden flex items-center justify-center text-sm">
                    👨‍🎓
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-primary overflow-hidden flex items-center justify-center text-sm">
                    👨‍💼
                  </div>
                </div>
                <span className="text-sm font-bold text-primary">Conversation History</span>
              </div>
              <span className="text-[11px] font-medium text-slate-600">Last message 15 mins ago</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-4 ${msg.type === 'staff' ? 'flex-row-reverse' : ''} max-w-[90%] ${msg.type === 'staff' ? 'ml-auto' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full mt-6 flex items-center justify-center text-lg ${msg.type === 'staff' ? 'bg-primary' : 'bg-slate-200'}`}>
                    {msg.avatar}
                  </div>
                  <div className={`flex flex-col ${msg.type === 'staff' ? 'items-end' : 'items-start'} gap-1`}>
                    <div className={`flex items-center gap-2 px-1 ${msg.type === 'staff' ? 'flex-row-reverse' : ''}`}>
                      <span className="text-[11px] font-bold text-primary uppercase">{msg.name}</span>
                      <span className="text-[10px] text-slate-600">{msg.time}</span>
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.type === 'staff' ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Area */}
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
                  📎 Attach File
                </button>
                <button className="bg-[#FEB21A] text-primary font-black px-8 py-2.5 rounded-lg flex items-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all">
                  Send Response
                  <span>📤</span>
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Feedback Section (Hidden by default) */}
        {showFeedback && (
          <div className="mt-12 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="w-16 h-16 bg-[#FEB21A]/20 text-[#FEB21A] rounded-full flex items-center justify-center mx-auto text-3xl">
                ✓
              </div>
              <div>
                <h3 className="text-2xl font-black text-primary">This enquiry has been marked as Resolved.</h3>
                <p className="text-slate-600 mt-2 text-sm">Please take a moment to rate the assistance you received.</p>
              </div>
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-4xl transition-all active:scale-90 ${star <= rating ? 'text-[#FEB21A]' : 'text-slate-300'}`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              <textarea 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#FEB21A] focus:border-[#FEB21A] placeholder:text-slate-400 h-28 outline-none transition-all"
                placeholder="Feedback của bạn về việc xử lý enquiry này / Your feedback on this enquiry resolution"
              />
              <button className="bg-[#FEB21A] text-primary font-black px-10 py-3 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all">
                Submit Feedback / Gửi Feedback
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

      {/* Floating Actions Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-slate-200 px-4 md:px-6 py-4 rounded-2xl shadow-lg flex items-center gap-2 md:gap-3 z-50 w-[90%] md:w-auto overflow-x-auto whitespace-nowrap">
        <button className="px-4 md:px-6 py-2.5 rounded-xl text-primary font-bold text-sm border-2 border-primary hover:bg-primary hover:text-white transition-all active:scale-95 flex items-center gap-2">
          👤 Assign
        </button>
        <button className="px-4 md:px-6 py-2.5 rounded-xl text-[#7f5600] font-bold text-sm border-2 border-[#FEB21A] hover:bg-[#FEB21A] hover:text-primary transition-all active:scale-95 flex items-center gap-2">
          📈 Escalate
        </button>
        <div className="h-8 w-px bg-slate-300 mx-1 md:mx-2 hidden sm:block"></div>
        <button 
          onClick={() => setShowFeedback(!showFeedback)}
          className="px-6 md:px-8 py-2.5 rounded-xl bg-primary text-white font-black text-sm shadow-lg hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2"
        >
          ✓ Mark Resolved
        </button>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-4 md:right-8 z-50">
        <button className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform text-2xl">
          💬
        </button>
        <span className="absolute top-0 right-0 w-4 h-4 bg-[#FEB21A] border-4 border-white rounded-full"></span>
      </div>
    </div>
  )
}
