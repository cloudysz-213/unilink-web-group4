'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  return (
    <main className="min-h-screen bg-background text-on-surface">
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/85 border-b border-gray-100">
        <nav className="flex justify-between items-center w-full px-6 lg:px-12 py-4 max-w-screen-2xl mx-auto">
          <div className="text-2xl font-extrabold tracking-tighter text-[#020035]">UniLink</div>
          <div className="hidden md:flex items-center space-x-8 font-headline font-medium tracking-tight">
            <a className="text-[#020035] font-bold hover:text-[#FEB21A] transition-colors" href="#home">Home</a>
            <a className="text-[#47464f] hover:text-[#020035] transition-colors" href="#features">Features</a>
            <a className="text-[#47464f] hover:text-[#020035] transition-colors" href="#how-it-works">How it Works</a>
            <a className="text-[#47464f] hover:text-[#020035] transition-colors" href="#contact">Contact/Support</a>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="px-6 py-2 text-[#020035] font-bold hover:text-[#FEB21A] transition-all">Sign In</Link>
            <Link href="/login" className="hidden sm:block px-6 py-2 bg-[#FEB21A] text-[#020035] font-bold rounded-lg hover:brightness-105 transition-all shadow-sm">Get Help</Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative bg-[#020035] overflow-hidden min-h-screen flex items-center pt-20">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#FEB21A] blur-[120px]"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-400 blur-[150px]"></div>
        </div>
        <div className="relative z-10 max-w-screen-2xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 py-20">
            <h1 className="font-headline font-extrabold text-white leading-tight tracking-tight mb-6 lg:text-5xl text-4xl">
              UniLink – Hệ thống Hỗ trợ Thắc mắc <br className="hidden lg:block"/> &amp; Đặt lịch hẹn Sinh viên <span className="text-[#FEB21A]">ABC University</span>
            </h1>
            <p className="text-xl text-blue-100/80 mb-10 max-w-2xl leading-relaxed">
              Nộp thắc mắc nhanh chóng, chat AI trả lời FAQ, phân loại tự động, đặt lịch gặp cán bộ hỗ trợ – Giảm thời gian chờ đợi, phản hồi nhất quán hơn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login" className="px-8 py-4 bg-[#FEB21A] text-[#020035] font-bold text-lg rounded-lg shadow-xl hover:scale-105 transition-transform text-center">
                Đăng nhập
              </Link>
              <Link href="/enquiry/new" className="px-8 py-4 bg-transparent text-white font-bold text-lg rounded-lg border-2 border-white/30 hover:bg-white/10 transition-all text-center backdrop-blur-sm">
                Nộp Enquiry Nhanh
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-4 bg-[#FEB21A]/10 rounded-2xl blur-2xl"></div>
              <img alt="Student support interface" className="relative rounded-2xl shadow-2xl object-cover aspect-[4/5] max-h-[550px] w-full border border-white/10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnBGq0Rw5IvrX7lNXQKFii2eJ-WPLzXWC2_ZiPhtzX-OvX9XYKDd07LeVQ87Wah_3KNG8w-3CxkC18fpU3AyqkrDFD3WEugdNiemAxMpCheitYAqxR7RQXr4vTOMzE7Lgy86uzUeyDzvwlQauoxmPgXYfmQ-aU9yK7KXwURSQ-IEVqmov2lGnLRDYYB_EFbjWsl_yK8Lj8aIXzj31ihWAEKrsjo_tbkgCGQ6Jjdp9naFDUenZ9nPfTUj6tAKU-kcmYvbwnc6upFrc"/>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="mb-16 text-center lg:text-left">
          <h2 className="text-3xl font-headline font-extrabold text-[#020035] mb-4">Hệ thống hỗ trợ hiện đại</h2>
          <div className="w-20 h-1.5 bg-[#FEB21A] mx-auto lg:mx-0"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature Card 1 */}
          <div 
            className="group bg-[#f9f9f9] p-8 rounded-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden border border-gray-100"
            onMouseEnter={() => setHoveredFeature(0)}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="mb-6 inline-flex items-center justify-center w-14 h-14 bg-white rounded-lg text-[#020035] group-hover:bg-[#020035] group-hover:text-white transition-all shadow-sm">
              🏢
            </div>
            <h3 className="text-xl font-headline font-bold text-[#020035] mb-4">Centralized Enquiries</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Tất cả thắc mắc từ email/phone/walk-in được tập trung một nơi duy nhất để quản lý hiệu quả.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div 
            className="group bg-[#f9f9f9] p-8 rounded-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden border border-gray-100"
            onMouseEnter={() => setHoveredFeature(1)}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="mb-6 inline-flex items-center justify-center w-14 h-14 bg-white rounded-lg text-[#020035] group-hover:bg-[#020035] group-hover:text-white transition-all shadow-sm">
              🤖
            </div>
            <h3 className="text-xl font-headline font-bold text-[#020035] mb-4">AI Classification</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              AI tự động phân loại (Academic/Visa/Financial...) và chuyển đến cán bộ chuyên trách phù hợp nhất.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div 
            className="group bg-[#f9f9f9] p-8 rounded-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden border border-gray-100"
            onMouseEnter={() => setHoveredFeature(2)}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="mb-6 inline-flex items-center justify-center w-14 h-14 bg-white rounded-lg text-[#020035] group-hover:bg-[#020035] group-hover:text-white transition-all shadow-sm">
              📅
            </div>
            <h3 className="text-xl font-headline font-bold text-[#020035] mb-4">Appointment Booking</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Đặt lịch gặp trực tiếp với cán bộ hỗ trợ, xem lịch trống thời gian thực và đồng bộ calendar cá nhân.
            </p>
          </div>

          {/* Feature Card 4 */}
          <div 
            className="group bg-[#f9f9f9] p-8 rounded-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden border border-gray-100"
            onMouseEnter={() => setHoveredFeature(3)}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="mb-6 inline-flex items-center justify-center w-14 h-14 bg-white rounded-lg text-[#020035] group-hover:bg-[#020035] group-hover:text-white transition-all shadow-sm">
              📊
            </div>
            <h3 className="text-xl font-headline font-bold text-[#020035] mb-4">Analytics Dashboard</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Theo dõi xu hướng thắc mắc, thời gian xử lý trung bình và xuất báo cáo chi tiết cho ban quản lý.
            </p>
          </div>
        </div>

        {/* Strong Value Proposition Section */}
        <div className="mt-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* KPI Card 1: White */}
            <div className="bg-white border border-gray-100 p-10 rounded-2xl shadow-sm text-center transform transition-transform hover:scale-[1.02]">
              <div className="text-5xl font-extrabold text-[#020035] font-headline mb-3">98%</div>
              <div className="text-lg font-bold text-[#020035] mb-1">Hài lòng</div>
              <div className="text-sm text-gray-500 font-medium">(Satisfaction)</div>
            </div>

            {/* KPI Card 2: Dark Blue */}
            <div className="bg-[#020035] p-10 rounded-2xl shadow-xl text-center transform transition-transform hover:scale-[1.02]">
              <div className="text-5xl font-extrabold text-[#FEB21A] font-headline mb-3">5s</div>
              <div className="text-lg font-bold text-white mb-1">Phản hồi AI</div>
              <div className="text-sm text-blue-200/60 font-medium">(AI Response)</div>
            </div>

            {/* KPI Card 3: Gold */}
            <div className="bg-[#FEB21A] p-10 rounded-2xl shadow-lg text-center transform transition-transform hover:scale-[1.02]">
              <div className="text-5xl font-extrabold text-[#020035] font-headline mb-3">12,000+</div>
              <div className="text-lg font-bold text-[#020035] mb-1">Enquiries đã xử lý</div>
              <div className="text-sm text-[#020035]/60 font-medium">(Processed)</div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-headline mb-6 text-[#020035]">
              <strong>Sứ mệnh của UniLink | Our Mission</strong>
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Sứ mệnh của UniLink là tối ưu hóa trải nghiệm học đường. Chúng tôi hiểu rằng sinh viên thường gặp khó khăn về thắc mắc hành chính, học tập, visa, tài chính... UniLink giúp xử lý nhanh chóng, nhất quán, giảm tải cho cán bộ, với AI hỗ trợ phân loại tự động và chatbot trả lời FAQ 24/7.
            </p>
            <Link href="#" className="inline-flex items-center text-[#FEB21A] font-bold hover:underline transition-all">
              Khám phá các tính năng chi tiết (Explore features)
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full mt-24 bg-[#020035] text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 px-6 lg:px-12 py-16 w-full max-w-screen-2xl mx-auto">
          <div className="space-y-6">
            <div className="text-xl font-bold font-headline">UniLink</div>
            <p className="text-blue-100/60 font-body text-sm leading-relaxed">
              Hệ thống hỗ trợ sinh viên chính thức của ABC University. Giải pháp quản lý thắc mắc và tư vấn học thuật hiện đại.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold text-[#FEB21A] uppercase text-xs tracking-widest">Support</h4>
            <ul className="space-y-3">
              <li><a className="text-blue-100/80 hover:text-[#FEB21A] transition-colors text-sm" href="#">Privacy Policy</a></li>
              <li><a className="text-blue-100/80 hover:text-[#FEB21A] transition-colors text-sm" href="#">Data Protection</a></li>
              <li><a className="text-blue-100/80 hover:text-[#FEB21A] transition-colors text-sm" href="#">Contact IT Support</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold text-[#FEB21A] uppercase text-xs tracking-widest">Quick Access</h4>
            <ul className="space-y-3">
              <li><a className="text-blue-100/80 hover:text-[#FEB21A] transition-colors text-sm" href="#">Enquiry Portal</a></li>
              <li><a className="text-blue-100/80 hover:text-[#FEB21A] transition-colors text-sm" href="#">Staff Directory</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold text-[#FEB21A] uppercase text-xs tracking-widest">Newsletter</h4>
            <div className="flex">
              <input className="w-full bg-white/10 border-none text-sm p-3 focus:ring-1 focus:ring-[#FEB21A] rounded-l-lg text-white placeholder-white/40" placeholder="Email của bạn" type="email"/>
              <button className="bg-[#FEB21A] px-4 py-3 rounded-r-lg text-[#020035] hover:brightness-110 transition-all">
                ➤
              </button>
            </div>
          </div>
        </div>
        <div className="px-6 lg:px-12 py-8 border-t border-white/10 text-center text-xs text-blue-100/40 max-w-screen-2xl mx-auto">
          Copyright © ABC University Student Services. All Rights Reserved.
        </div>
      </footer>

      {/* Floating Chatbot */}
      <div className="fixed bottom-8 right-8 z-[100] group flex flex-col items-end">
        <div className="mb-4 mr-2 bg-white px-5 py-3 rounded-2xl shadow-2xl border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-bold text-[#020035]">Chat hỏi nhanh FAQ</span>
          </div>
          <p className="text-[10px] text-gray-500 mt-1">Không cần login để hỏi cơ bản</p>
        </div>
        <button className="w-16 h-16 bg-[#020035] rounded-full flex items-center justify-center text-3xl shadow-2xl hover:scale-110 transition-transform relative border-2 border-white/20">
          🤖
          <div className="absolute top-0 right-0 w-4 h-4 bg-[#FEB21A] border-2 border-[#020035] rounded-full"></div>
        </button>
      </div>
    </main>
  )
}

