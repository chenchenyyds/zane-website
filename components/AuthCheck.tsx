'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface User {
  email: string
  avatar?: string
}

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) {
      router.push('/login')
    } else {
      setUser({ email: currentUser.email || '' })
      setLoading(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">验证登录状态...</p>
      </div>
    )
  }

  return (
    <div>
      {/* 用户信息头部 */}
      <div className="flex justify-between items-center mb-8 p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{user?.email}</p>
            <p className="text-xs text-muted-foreground">管理员</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 border rounded-md hover:bg-white transition-colors"
        >
          退出登录
        </button>
      </div>
      
      {children}
    </div>
  )
}
