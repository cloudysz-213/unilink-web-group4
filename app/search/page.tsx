'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import ChatbotWidget from '@/components/ChatbotWidget'
import Sidebar from '@/components/layout/Sidebar'
import { theme } from '@/lib/theme'
import { 
  Search, 
  FileText, 
  Globe, 
  CreditCard, 
  ChevronRight, 
  ChevronDown,
  MessageSquare,
  BookOpen,
  Bell,
  HelpCircle,
  Plus,
  LogOut
} from 'lucide-react'

export default function SearchPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('Tất cả danh mục')
  const [timeframe, setTimeframe] = useState('Tất cả thời gian')
  const [onlyDocuments, setOnlyDocuments] = useState(false)
  const [aiAnswer, setAiAnswer] = useState<{ answer: string; sources: any[] } | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

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
      setLoading(false)
    }
    
    fetchData()
  }, [supabase, router])

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setAiAnswer(null)
      return
    }
    
    console.log('Searching:', searchQuery, category, timeframe, onlyDocuments)
    
    // Call AI search endpoint
    setAiLoading(true)
    try {
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      })
      
      if (response.ok) {
        const data = await response.json()
        setAiAnswer(data)
      }
    } catch (error) {
      console.error('AI search error:', error)
    } finally {
      setAiLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: theme.colors.primary }}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const role = userProfile?.role || 'student'

  const articles = [
    { id: 'KB-0921', icon: <FileText size={32} className="text-orange-500" />, tag: 'ACADEMIC', tagColor: 'bg-orange-100 text-orange-600', 
      title: 'Quy trình đăng ký môn học bù cho sinh viên năm cuối',
      desc: 'Hướng dẫn chi tiết về các bước đăng ký học bù, các mốc thời gian quan trọng và hồ sơ cần thiết để được xét duyệt học vượt định mức...',
      author: 'ADMIN', views: '1.2K', date: 'APR 12, 2024' },
    { id: 'DOC-1102', icon: <Globe size={32} className="text-blue-500" />, tag: 'VISA', tagColor: 'bg-blue-100 text-blue-600',
      title: 'Hướng dẫn gia hạn Visa 500 (Student Visa)',
      desc: 'Cung cấp bộ hồ sơ mẫu, các giấy tờ chứng minh tài chính và quy trình nộp hồ sơ trực tuyến qua hệ thống ImmiAccount...',
      author: 'ADMIN', views: '842', date: 'MAR 28, 2024' },
    { id: 'KB-2234', icon: <CreditCard size={32} className="text-indigo-500" />, tag: 'FINANCE', tagColor: 'bg-indigo-100 text-indigo-600',
      title: 'Chính sách hoàn phí học tập (Refund Policy)',
      desc: 'Thông tin về điều kiện được hoàn phí, các mức khấu trừ và thời gian xử lý yêu cầu hoàn trả học phí của nhà trường...',
      author: 'FINANCE', views: '2.1K', date: 'FEB 15, 2024' },
  ]

  const faqs = [
    { title: 'Lịch nộp học phí học kỳ 2', date: 'HẠN CHÓT: 15/05/2024' },
    { title: 'Mẫu đơn phúc khảo kết quả', date: 'CẬP NHẬT: 05/04/2024' },
    { title: 'Quy trình mượn sách thư viện', date: 'CẬP NHẬT: 01/01/2024' },
  ]

  const categories = ['Academic', 'Visa', 'Finance', 'Graduate', 'IT Support']
  const trendingTags = ['#visa-renewal', '#exam-schedule', '#housing-grant']

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar user={user} userProfile={userProfile} role={role} />
      
      <main className="ml-64 min-h-screen flex flex-col">
        {/* Header - Fixed */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 fixed top-0 right-0 left-64 z-40">
          <div className="flex flex-col">
            <nav className="flex items-center text-[10px] uppercase tracking-wider text-slate-400 gap-2 mb-1">
              <span>Home</span>
              <span className="text-lg">›</span>
              <span className="text-[#FEB21A] font-bold">Knowledge Base</span>
            </nav>
            <h2 className="text-2xl font-extrabold text-[#0A0521]">
              Xin chào, {userProfile?.full_name || user?.email?.split('@')[0] || 'Student'}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="relative cursor-pointer">
                <Bell size={22} className="text-slate-400" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </div>
              <HelpCircle size={22} className="text-slate-400 cursor-pointer" />
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <Link
              href="/enquiry/new"
              className="bg-[#FEB21A] text-[#0A0521] px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-orange-500 transition-all"
            >
              <Plus size={18} />
              New Enquiry
            </Link>
            <button
              className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors"
              onClick={async () => {
                await supabase.auth.signOut()
                router.push('/login')
              }}
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </header>

        {/* Content - with padding top for fixed header */}
        <div className="flex-1 overflow-y-auto mt-20 p-10">
          <div className="max-w-5xl mx-auto space-y-12">
            
            {/* Search Box Section */}
            <div className="text-center space-y-6">
              <h2 className="text-4xl font-extrabold text-[#0A0521]">How can we help you today?</h2>
              <p className="text-slate-500">Search for policies, procedures, and support documents</p>
              
              <div className="relative max-w-3xl mx-auto flex gap-0 shadow-2xl rounded-2xl overflow-hidden">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search size={24} />
                </div>
                <input 
                  type="text" 
                  placeholder="Tìm kiếm enquiries cũ, documents, FAQ..." 
                  className="w-full pl-14 pr-4 py-6 outline-none text-lg border-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button 
                  className="bg-[#FEB21A] px-10 text-[#0A0521] font-bold text-lg hover:bg-orange-500 transition-colors uppercase tracking-wider"
                  onClick={handleSearch}
                >
                  TÌM KIẾM
                </button>
              </div>
              
              <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-400">
                <span>TRENDING:</span>
                {trendingTags.map(tag => (
                  <button 
                    key={tag} 
                    className="bg-slate-200/50 px-3 py-1 rounded text-slate-600 cursor-pointer hover:bg-slate-200"
                    onClick={() => setSearchQuery(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              
              {/* Filters */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category:</span>
                  <select 
                    className="bg-transparent border-b border-slate-200 focus:border-[#FEB21A] border-x-0 border-t-0 py-1 px-0 text-xs font-bold text-[#0A0521] focus:ring-0 outline-none"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option>Tất cả danh mục</option>
                    <option>Academic Support</option>
                    <option>Visa & Immigration</option>
                    <option>Financial Services</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Timeframe:</span>
                  <select 
                    className="bg-transparent border-b border-slate-200 focus:border-[#FEB21A] border-x-0 border-t-0 py-1 px-0 text-xs font-bold text-[#0A0521] focus:ring-0 outline-none"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                  >
                    <option>Tất cả thời gian</option>
                    <option>30 ngày qua</option>
                    <option>Học kỳ này</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-3.5 h-3.5 text-[#FEB21A] border-slate-300 rounded focus:ring-[#FEB21A]"
                    checked={onlyDocuments}
                    onChange={(e) => setOnlyDocuments(e.target.checked)}
                  />
                  <span className="text-xs font-bold text-slate-500 group-hover:text-[#0A0521] transition-colors">Only Documents</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left: Article List */}
              <div className="lg:col-span-8 space-y-6">
                {/* AI Answer Box */}
                {aiAnswer && (
                  <div className="bg-[#FEB21A]/10 border-2 border-[#FEB21A] p-6 rounded-2xl">
                    <div className="flex gap-4 mb-4">
                      <div className="text-2xl">🤖</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-[#020035] mb-2">AI-Generated Answer</h3>
                        <p className="text-sm text-[#47464F] leading-relaxed mb-4">{aiAnswer.answer}</p>
                        
                        {/* Sources */}
                        {aiAnswer.sources && aiAnswer.sources.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-[#FEB21A]/30">
                            <p className="text-xs font-bold text-[#47464F] uppercase tracking-wider mb-2">Sources</p>
                            <div className="space-y-2">
                              {aiAnswer.sources.map((source: any, idx: number) => (
                                <Link
                                  key={idx}
                                  href={`/enquiry/${source.id}`}
                                  className="text-xs font-semibold text-[#020035] hover:text-[#FEB21A] transition-colors flex items-center gap-2"
                                >
                                  <span>📄</span>
                                  <span>{source.title}</span>
                                  <span className="text-[#FEB21A]">→</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {aiLoading && (
                  <div className="bg-gray-50 border-2 border-gray-200 p-6 rounded-2xl flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-[#FEB21A] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-semibold text-gray-600">Searching knowledge base...</p>
                  </div>
                )}
                
                <div className="flex justify-between items-center pb-2">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[2px]">Showing 24 Results</h3>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 cursor-pointer">
                    SORT BY: <span className="text-[#0A0521]">RELEVANCE</span> <ChevronDown size={14} />
                  </div>
                </div>

                {articles.map((article, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-50 shadow-sm hover:shadow-md transition-all group flex gap-6 cursor-pointer">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-orange-50 transition-colors">
                      {article.icon}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${article.tagColor}`}>
                          {article.tag}
                        </span>
                        <div className="text-orange-400 font-bold text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          Detail <ChevronRight size={14} />
                        </div>
                      </div>
                      <h4 className="text-lg font-bold text-[#0A0521] group-hover:text-blue-600 transition-colors">{article.title}</h4>
                      <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">{article.desc}</p>
                      <div className="flex items-center gap-6 pt-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        <span>{article.author}</span> • <span>{article.views} VIEWS</span> • <span>{article.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right: Sidebar Widgets */}
              <div className="lg:col-span-4 space-y-6">
                {/* Popular FAQs */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-1 h-6 bg-[#FEB21A] rounded-full"></div>
                    <h4 className="font-bold text-slate-800">POPULAR FAQS</h4>
                  </div>
                  <div className="space-y-6">
                    {faqs.map((faq, idx) => (
                      <div key={idx} className="group cursor-pointer">
                        <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{faq.title}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{faq.date}</p>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-8 text-[#FEB21A] font-bold text-xs hover:underline">VIEW ALL FAQS</button>
                </div>

                {/* Categories */}
                <div className="bg-[#0A0521] p-6 rounded-2xl shadow-xl text-white">
                  <div className="flex items-center gap-2 mb-6">
                    <BookOpen size={20} className="text-[#FEB21A]" />
                    <h4 className="font-bold">Categories</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button 
                        key={cat}
                        className="px-4 py-2 bg-white/10 rounded-lg text-xs hover:bg-white/20 cursor-pointer border border-white/5 transition-colors"
                        onClick={() => setSearchQuery(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ChatbotWidget />
      </main>
    </div>
  )
}