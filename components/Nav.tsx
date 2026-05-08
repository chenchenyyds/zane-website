'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'

export default function Nav() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mounted, setMounted] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setMounted(true)
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

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <nav style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }} className='border-b sticky top-0 z-50 transition-colors'>
      <div className='max-w-4xl mx-auto px-4 py-3'>
        {/* 桌面端导航 */}
        <div className='hidden md:flex items-center justify-between'>
          <Link href='/' style={{ color: 'var(--foreground)' }} className='font-bold text-xl'>Zane's Site</Link>
          <div className='flex items-center gap-6'>
            <Link href='/' className='text-sm transition-colors hover:opacity-80' style={{ color: 'var(--foreground)' }}>首页</Link>
            <Link href='/projects' className='text-sm transition-colors hover:opacity-80' style={{ color: 'var(--foreground)' }}>项目</Link>
            <Link href='/notes' className='text-sm transition-colors hover:opacity-80' style={{ color: 'var(--foreground)' }}>笔记</Link>
            
            {/* 深色模式切换 */}
            {mounted && (
              <button onClick={toggleTheme} className='p-1.5 rounded-md transition-colors hover:opacity-80' style={{ color: 'var(--foreground)' }} title='切换主题'>
                {theme === 'dark' ? (
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' />
                  </svg>
                ) : (
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' />
                  </svg>
                )}
              </button>
            )}
            
            {!loading && (user ? (
              <div 
                className='relative'
                onMouseEnter={handleUserMenuEnter}
                onMouseLeave={handleUserMenuLeave}
              >
                <button className='w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm hover:opacity-90 transition-opacity' style={{ backgroundColor: theme === 'dark' ? '#374151' : '#000', color: '#fff' }}>
                  {user.email.charAt(0).toUpperCase()}
                </button>
                
                {showUserMenu && (
                  <div 
                    className='absolute right-0 mt-2 w-52 rounded-lg shadow-lg py-2 z-50'
                    style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderWidth: 1 }}
                    onMouseEnter={handleUserMenuEnter}
                    onMouseLeave={handleUserMenuLeave}
                  >
                    <div className='px-4 py-2 text-sm' style={{ borderColor: 'var(--border)', borderBottomWidth: 1 }}>
                      <p className='font-medium truncate' style={{ color: 'var(--foreground)' }}>{user.email}</p>
                    </div>
                    <Link href='/admin' className='block px-4 py-2 text-sm transition-colors hover:opacity-80' style={{ color: 'var(--foreground)' }}>
                      管理后台
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className='w-full text-left px-4 py-2 text-sm transition-colors'
                      style={{ color: '#dc2626' }}
                    >
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href='/login' className='text-sm px-3 py-1 border rounded-md transition-colors' style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                登录
              </Link>
            ))}
          </div>
        </div>

        {/* 移动端导航 */}
        <div className='flex md:hidden items-center justify-between'>
          <Link href='/' className='font-bold text-lg' style={{ color: 'var(--foreground)' }}>Zane's Site</Link>
          <div className='flex items-center gap-2'>
            {mounted && (
              <button onClick={toggleTheme} className='p-2 rounded-md transition-colors' style={{ color: 'var(--foreground)' }}>
                {theme === 'dark' ? (
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' />
                  </svg>
                ) : (
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' />
                  </svg>
                )}
              </button>
            )}
            <button 
              onClick={() => setShowMenu(!showMenu)} 
              className='p-2 rounded-md transition-colors'
              style={{ color: 'var(--foreground)' }}
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
        </div>

        {/* 移动端菜单 */}
        {showMenu && (
          <div className='md:hidden py-4 space-y-2 border-t mt-3' style={{ borderColor: 'var(--border)' }}>
            <Link href='/' className='block px-2 py-2 text-sm rounded-md transition-colors' style={{ color: 'var(--foreground)' }} onClick={() => setShowMenu(false)}>
              首页
            </Link>
            <Link href='/projects' className='block px-2 py-2 text-sm rounded-md transition-colors' style={{ color: 'var(--foreground)' }} onClick={() => setShowMenu(false)}>
              项目
            </Link>
            <Link href='/notes' className='block px-2 py-2 text-sm rounded-md transition-colors' style={{ color: 'var(--foreground)' }} onClick={() => setShowMenu(false)}>
              笔记
            </Link>
            {!loading && (
              user ? (
                <div className='border-t my-2 pt-2' style={{ borderColor: 'var(--border)' }}>
                  <p className='px-2 py-2 text-xs truncate' style={{ color: 'var(--muted-foreground)' }}>{user.email}</p>
                  <Link href='/admin' className='block px-2 py-2 text-sm rounded-md transition-colors' style={{ color: 'var(--foreground)' }} onClick={() => setShowMenu(false)}>
                    管理后台
                  </Link>
                  <button onClick={handleLogout} className='w-full text-left px-2 py-2 text-sm rounded-md' style={{ color: '#dc2626' }}>
                    退出登录
                  </button>
                </div>
              ) : (
                <Link href='/login' className='block px-2 py-2 text-sm border rounded-md text-center transition-colors' style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }} onClick={() => setShowMenu(false)}>
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
