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
  const [showUserMenu, setShowUserMenu] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ? { email: data.user.email || '' } : null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ? { email: session.user.email || '' } : null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleUserMenuEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setShowUserMenu(true)
  }

  const handleUserMenuLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowUserMenu(false)
    }, 150)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    setShowUserMenu(false)
    router.push('/login')
  }

  return (
    <nav className='border-b bg-white sticky top-0 z-50'>
      <div className='max-w-4xl mx-auto px-4 py-3'>
        {/* 桌面端导航 */}
        <div className='hidden md:flex items-center justify-between'>
          <Link href='/' className='font-bold text-xl'>Zane's Site</Link>
          <div className='flex items-center gap-6'>
            <Link href='/' className='text-sm text-muted-foreground hover:text-foreground transition-colors'>首页</Link>
            <Link href='/projects' className='text-sm text-muted-foreground hover:text-foreground transition-colors'>项目</Link>
            <Link href='/notes' className='text-sm text-muted-foreground hover:text-foreground transition-colors'>笔记</Link>
            
            {!loading && (user ? (
              <div 
                className='relative'
                onMouseEnter={handleUserMenuEnter}
                onMouseLeave={handleUserMenuLeave}
              >
                <button className='w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm hover:opacity-90 transition-opacity'>
                  {user.email.charAt(0).toUpperCase()}
                </button>
                
                {showUserMenu && (
                  <div 
                    className='absolute right-0 mt-2 w-52 bg-white border rounded-lg shadow-lg py-2 z-50'
                    onMouseEnter={handleUserMenuEnter}
                    onMouseLeave={handleUserMenuLeave}
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
              <Link href='/login' className='text-sm px-3 py-1 border rounded-md hover:bg-gray-100 transition-colors'>
                登录
              </Link>
            ))}
          </div>
        </div>

        {/* 移动端导航 */}
        <div className='flex md:hidden items-center justify-between'>
          <Link href='/' className='font-bold text-lg'>Zane's Site</Link>
          <button 
            onClick={() => setShowMenu(!showMenu)} 
            className='p-2 hover:bg-gray-100 rounded-md transition-colors'
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              {showMenu ? (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              ) : (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              )}
            </svg>
          </button>
        </div>

        {/* 移动端菜单 */}
        {showMenu && (
          <div className='md:hidden py-4 space-y-2 border-t mt-3'>
            <Link href='/' className='block px-2 py-2 text-sm hover:bg-gray-50 rounded-md' onClick={() => setShowMenu(false)}>
              首页
            </Link>
            <Link href='/projects' className='block px-2 py-2 text-sm hover:bg-gray-50 rounded-md' onClick={() => setShowMenu(false)}>
              项目
            </Link>
            <Link href='/notes' className='block px-2 py-2 text-sm hover:bg-gray-50 rounded-md' onClick={() => setShowMenu(false)}>
              笔记
            </Link>
            {!loading && (
              user ? (
                <>
                  <div className='border-t my-2 pt-2'>
                    <p className='px-2 py-2 text-xs text-muted-foreground truncate'>{user.email}</p>
                    <Link href='/admin' className='block px-2 py-2 text-sm hover:bg-gray-50 rounded-md' onClick={() => setShowMenu(false)}>
                      管理后台
                    </Link>
                    <button onClick={handleLogout} className='w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-gray-50 rounded-md'>
                      退出登录
                    </button>
                  </div>
                </>
              ) : (
                <Link href='/login' className='block px-2 py-2 text-sm border rounded-md text-center hover:bg-gray-50' onClick={() => setShowMenu(false)}>
                  登录
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
