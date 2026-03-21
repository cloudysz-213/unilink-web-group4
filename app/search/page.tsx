'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { theme } from '@/lib/theme'

export default function SearchPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])

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
    if (!searchQuery.trim()) return
    
    // Mock search results - replace with actual search logic
    setSearchResults([
      { id: 1, title: 'How to register for late courses', category: 'Academic', views: 1200 },
      { id: 2, title: 'Student visa extension process', category: 'Visa', views: 842 },
      { id: 3, title: 'Tuition fee refund policy', category: 'Financial', views: 2100 },
    ])
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
    <div className="min-h-screen bg-gray-50">
      <Sidebar user={user} userProfile={userProfile} role={role} />
      
      <main className="ml-64 min-h-screen relative">
        <Header title="Knowledge Base" subtitle="Search for answers" user={user} userProfile={userProfile} />
        
        <div className="pt-28 pb-12 px-8 max-w-5xl mx-auto">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search for policies, procedures, and support documents..."
                className="flex-1 border border-gray-200 rounded-xl px-6 py-4 text-lg focus:ring-2 focus:outline-none"
                style={{ focusRingColor: theme.colors.secondary }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="px-8 py-4 rounded-xl font-bold transition-all hover:brightness-95"
                style={{ backgroundColor: theme.colors.secondary, color: theme.colors.primary }}
              >
                Search
              </button>
            </div>
            
            {/* Trending Tags */}
            <div className="flex items-center gap-4 mt-4 text-sm">
              <span className="text-gray-400 font-bold">Trending:</span>
              <div className="flex gap-2">
                {['#visa-renewal', '#exam-schedule', '#housing-grant'].map(tag => (
                  <button
                    key={tag}
                    className="px-3 py-1 bg-gray-100 rounded-full text-xs hover:bg-gray-200 transition-colors"
                    onClick={() => setSearchQuery(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Showing {searchResults.length} results</p>
              {searchResults.map(result => (
                <div key={result.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <h3 className="text-lg font-bold mb-1" style={{ color: theme.colors.primary }}>
                    {result.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                    <span className="px-2 py-0.5 rounded-full bg-gray-100">{result.category}</span>
                    <span>{result.views} views</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchQuery && searchResults.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">No results found for "{searchQuery}"</p>
              <p className="text-sm mt-2">Try different keywords or contact support</p>
            </div>
          )}

          {/* Categories */}
          <div className="mt-12">
            <h3 className="font-bold mb-4" style={{ color: theme.colors.primary }}>Browse by Category</h3>
            <div className="flex flex-wrap gap-3">
              {['Academic', 'Visa', 'Financial', 'Graduation', 'Welfare', 'IT Support'].map(cat => (
                <button
                  key={cat}
                  className="px-4 py-2 rounded-full border border-gray-200 hover:border-[#FEB21A] transition-all text-sm"
                  onClick={() => setSearchQuery(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}