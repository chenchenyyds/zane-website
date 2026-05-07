'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Nav() {
  const router = useRouter()
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // 检查登录状态
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ? { email: data.user.email || '' } : null)
      setLoading(false)
    })

    // 监听登录状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ? { email: session.user.email || '' } : null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setShowMenu(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowMenu(false)
    }, 150)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    setShowMenu(false)
    router.push('/login')
  }

  return (
    <nav className='border-b'>
      <div className='max-w-4xl mx-auto px-4 py-3 flex items-center justify-between'>
        <Link href='/' className='font-bold text-xl'>Zane's Site</Link>
        <div className='flex items-center gap-6'>
          <Link href='/' className='text-sm text-muted-foreground hover:text-foreground'>首页</Link>
          <Link href='/projects' className='text-sm text-muted-foreground hover:text-foreground'>项目</Link>
          <Link href='/notes' className='text-sm text-muted-foreground hover:text-foreground'>笔记</Link>
          
          {!loading && (user ? (
            <div 
              className='relative'
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              ref={menuRef}
            >
              <button className='w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm hover:opacity-90 transition-opacity'>
                {user.email.charAt(0).toUpperCase()}
              </button>
              
              {showMenu && (
                <div 
                  className='absolute right-0 mt-2 w-52 bg-white border rounded-lg shadow-lg py-2 z-50'
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className='px-4 py-2 border-b text-sm'>
                    <p className='font-medium truncate text-gray-900'>{user.email}</p>
                  </div>
                  <Link href='/admin' className='block px-4 py-2 text-sm hover:bg-gray-100 text-gray-700'>
                    管理后台
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
                  >
                    退出登录
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href='/login' className='text-sm px-3 py-1 border rounded-md hover:bg-gray-100'>
              登录
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
