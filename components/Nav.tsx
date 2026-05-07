'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Nav() {
  const [user, setUser] = useState<{ email: string } | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ? { email: data.user.email || '' } : null)
    })
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <nav className='border-b'>
      <div className='max-w-4xl mx-auto px-4 py-3 flex items-center justify-between'>
        <Link href='/' className='font-bold text-xl'>Zane's Site</Link>
        <div className='flex items-center gap-6'>
          <Link href='/' className='text-sm text-muted-foreground hover:text-foreground'>首页</Link>
          <Link href='/projects' className='text-sm text-muted-foreground hover:text-foreground'>项目</Link>
          <Link href='/notes' className='text-sm text-muted-foreground hover:text-foreground'>笔记</Link>
          
          {user ? (
            <div className='relative group'>
              <button className='w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm'>
                {user.email.charAt(0).toUpperCase()}
              </button>
              <div className='absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-50 hidden group-hover:block'>
                <div className='px-4 py-2 border-b text-sm'>
                  <p className='font-medium truncate'>{user.email}</p>
                </div>
                <Link href='/admin' className='block px-4 py-2 text-sm hover:bg-gray-100'>管理后台</Link>
                <button onClick={handleLogout} className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100'>退出登录</button>
              </div>
            </div>
          ) : (
            <Link href='/login' className='text-sm px-3 py-1 border rounded-md hover:bg-gray-100'>登录</Link>
          )}
        </div>
      </div>
    </nav>
  )
}
