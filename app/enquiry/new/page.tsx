'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { theme } from '@/lib/theme'
import { toast } from 'sonner'

export default function NewEnquiryPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Form states
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Academic (Học thuật)')
  const [priority, setPriority] = useState('Thấp')
  const [description, setDescription] = useState('')
  const [relatedEnquiry, setRelatedEnquiry] = useState('')

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description) {
      toast.error('Vui lòng điền đầy đủ tiêu đề và mô tả')
      return
    }

    setSubmitting(true)
    setErrorMsg('')

    const priorityMap: { [key: string]: string } = {
      'Thấp': 'Low',
      'Trung bình': 'Medium',
      'Cao': 'High'
    }

    const categoryMap: { [key: string]: string } = {
      'Academic (Học thuật)': 'academic',
      'Visa & International Students': 'visa_international',
      'Graduation & Career': 'graduation_career',
      'Welfare': 'welfare',
      'Financial': 'financial',
      'Other': 'other'
    }

    try {
      const { data, error } = await supabase
        .from('enquiries')
        .insert({
          title: title,
          description: description,
          category: categoryMap[category] || 'other',
          priority: priorityMap[priority] || 'Medium',
          status: 'open',
          student_id: user.id,
        })
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        setErrorMsg('Lỗi: ' + error.message)
        toast.error('Gửi enquiry thất bại: ' + error.message)
        setSubmitting(false)
        return
      }

      setSubmitted(true)
      toast.success('Enquiry đã được gửi thành công!')
      
      setTitle('')
      setDescription('')
      setRelatedEnquiry('')
      
      setTimeout(() => {
        router.push('/dashboard/student')
      }, 2000)
      
    } catch (err: any) {
      console.error('Error:', err)
      setErrorMsg('Lỗi: ' + err.message)
      toast.error('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setSubmitting(false)
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

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Sidebar user={user} userProfile={userProfile} role={role} />

      <main className="ml-64 min-h-screen flex flex-col">
        <Header title="New Enquiry" subtitle="" user={user} userProfile={userProfile} />

        <div className="pt-24 px-12 pb-12 flex flex-col gap-12 max-w-7xl mx-auto w-full">
          {/* Header Section */}
          <section className="max-w-4xl">
            <h2 className="text-5xl font-extrabold font-headline tracking-tight text-[#020035]">Nộp Enquiry Mới</h2>
            <p className="mt-4 text-[#47464F] text-lg max-w-2xl leading-relaxed">
              Vui lòng điền thông tin chi tiết dưới đây. Đội ngũ hỗ trợ viên sẽ phản hồi nhanh nhất có thể (trong 24-48 giờ).
            </p>
          </section>

          <div className="grid grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN - FORM */}
            <div className="col-span-8 space-y-8">
              {!submitted ? (
                <div className="bg-white p-10 rounded-xl shadow-sm border border-outline-variant/10">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Title */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#47464F]">Tiêu đề Enquiry</label>
                      <input
                        className="w-full bg-white border-0 border-b-2 border-outline-variant/30 focus:ring-0 focus:border-[#FEB21A] py-3 text-lg px-0 outline-none"
                        placeholder="Nhập tiêu đề gọn thắc mắc của bạn"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#47464F]">Lĩnh vực thắc mắc</label>
                        <select
                          className="w-full bg-white border-0 border-b-2 border-outline-variant/30 focus:ring-0 focus:border-[#FEB21A] py-3 px-0 appearance-none outline-none"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          <option>Academic (Học thuật)</option>
                          <option>Visa & International Students</option>
                          <option>Graduation & Career</option>
                          <option>Welfare</option>
                          <option>Financial</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#47464F]">Độ ưu tiên</label>
                        <div className="flex bg-[#f3f3f4] p-1 rounded-lg gap-1">
                          {['Thấp', 'Trung bình', 'Cao'].map(p => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setPriority(p)}
                              className={`flex-1 py-2 text-sm font-medium rounded transition-all ${
                                priority === p
                                  ? 'bg-white shadow-sm text-[#020035]'
                                  : 'text-[#47464F] hover:bg-white/50'
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#47464F]">Liên quan đến enquiry cũ (nếu có)</label>
                      <div className="flex items-center gap-3">
                        <span className="text-[#777680] text-lg">#</span>
                        <input
                          className="w-full bg-white border-0 border-b-2 border-outline-variant/30 focus:ring-0 focus:border-[#FEB21A] py-3 px-0 outline-none"
                          placeholder="VD: ENQ-9988"
                          value={relatedEnquiry}
                          onChange={(e) => setRelatedEnquiry(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#47464F]">Mô tả chi tiết</label>
                        <button
                          type="button"
                          className="text-[#6b4800] border border-[#FEB21A] px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-[#FEB21A]/10"
                        >
                          <span className="material-symbols-outlined text-sm">auto_fix</span>
                          Gợi ý bằng AI
                        </button>
                      </div>
                      <textarea
                        className="w-full p-6 bg-[#f3f3f4] border-0 focus:ring-2 focus:ring-[#FEB21A] rounded-xl resize-none outline-none"
                        rows={6}
                        placeholder="Mô tả cụ thể vấn đề của bạn..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#47464F]">Tài liệu đính kèm</label>
                      <div className="border-2 border-dashed border-outline-variant rounded-xl p-10 flex flex-col items-center justify-center text-center hover:border-[#FEB21A] bg-[#f3f3f4]/50 cursor-pointer">
                        <span className="material-symbols-outlined text-4xl text-outline mb-3">cloud_upload</span>
                        <p className="text-[#1a1c1c] font-semibold">Kéo và thả file hoặc click để tải lên</p>
                        <p className="text-xs text-[#47464F] mt-1">PDF, JPG, PNG (Tối đa 10MB)</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 pt-6">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-12 py-4 bg-[#FEB21A] text-[#020035] font-extrabold rounded-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#FEB21A]/20 uppercase tracking-widest text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {submitting ? (
                          <span className="flex items-center gap-2">
                            <span className="animate-spin">⏳</span>
                            Đang gửi...
                          </span>
                        ) : (
                          'Gửi Enquiry'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => router.back()}
                        className="text-[#47464F] font-semibold hover:text-[#BA1A1A] transition-colors border-b border-transparent hover:border-[#BA1A1A] pb-1"
                      >
                        Hủy bỏ
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-white p-16 rounded-2xl shadow-sm text-center">
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-6xl">check_circle</span>
                  </div>
                  <h3 className="text-3xl font-bold text-[#020035] mb-2">Enquiry đã được gửi thành công!</h3>
                  <p className="text-[#47464F] mb-8">Bạn có thể theo dõi tiến độ trong Dashboard.</p>
                  <p className="text-sm text-[#47464F] mb-6">Đang chuyển về Dashboard...</p>
                  <div className="w-8 h-8 mx-auto border-2 border-[#FEB21A] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              {errorMsg && <p className="text-red-600 text-center font-medium">{errorMsg}</p>}
            </div>

            {/* RIGHT COLUMN */}
            <aside className="col-span-4 space-y-8 sticky top-28">
              <div className="bg-[#020035] rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl shadow-[#020035]/30">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#151546] rounded-full opacity-50 blur-3xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#FEB21A] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[#020035] text-2xl">smart_toy</span>
                    </div>
                    <h3 className="font-headline font-bold text-xl">UniLink AI Assistant</h3>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-5">
                    Chat để hỏi FAQ nhanh hoặc được hướng dẫn chọn lĩnh vực enquiry. Không cần login cho câu hỏi cơ bản.
                  </p>
                  <button className="w-full py-3 bg-[#FEB21A] text-[#020035] font-bold rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">chat</span>
                    Chat ngay
                  </button>
                </div>
              </div>

              <div className="bg-[#f3f3f4] rounded-2xl p-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#47464F] mb-5">Mẹo nộp Enquiry</h3>
                <ul className="space-y-5">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white text-[11px] font-bold flex items-center justify-center shadow-sm">1</span>
                    <p className="text-sm text-[#47464F] leading-relaxed">Cung cấp Mã số sinh viên của bạn nếu thắc mắc liên quan đến học phí.</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white text-[11px] font-bold flex items-center justify-center shadow-sm">2</span>
                    <p className="text-sm text-[#47464F] leading-relaxed">Đính kèm ảnh chụp màn hình thông báo lỗi (nếu có) để xử lý nhanh hơn.</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white text-[11px] font-bold flex items-center justify-center shadow-sm">3</span>
                    <p className="text-sm text-[#47464F] leading-relaxed">Kiểm tra mục FAQ trước khi nộp để tiết kiệm thời gian chờ đợi.</p>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-5 border border-[#eeeeee]">
                <h4 className="text-xs font-bold text-[#47464F] uppercase tracking-wider mb-2">Hotline Hỗ trợ</h4>
                <p className="text-xl font-bold text-[#020035]">1800-UNILINK</p>
                <p className="text-[10px] text-[#47464F] mt-1">Thứ 2 - Thứ 6, 8:00 - 17:00</p>
              </div>
            </aside>
          </div>

          <footer className="mt-12 border-t border-outline-variant/20 pt-8 pb-12">
            <p className="text-xs text-[#47464F]/60 max-w-2xl leading-relaxed">
              © 2024 ABC University Student Services. All data provided is protected under the University Data Protection Policy.
              UniLink uses high-level encryption to ensure student confidentiality.
            </p>
          </footer>
        </div>
      </main>

      {/* Floating Chatbot Bubble */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-14 h-14 bg-[#020035] text-[#FEB21A] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-2xl">support_agent</span>
        </button>
      </div>
    </div>
  )
}