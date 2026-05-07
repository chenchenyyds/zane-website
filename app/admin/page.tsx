'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Admin() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ projects: 0, notes: 0 })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace('/login')
      } else {
        setUser(data.user)
        setReady(true)
        fetchStats()
      }
    })
  }, [router])

  async function fetchStats() {
    const [p, n] = await Promise.all([
      supabase.from('projects').select('id', { count: 'exact' }),
      supabase.from('notes').select('id', { count: 'exact' })
    ])
    setStats({ projects: p.count || 0, notes: n.count || 0 })
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  if (!ready) return <div className='text-center py-20'>加载中...</div>

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zane-website.vercel.app'

  return (
    <div className='space-y-8'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold'>管理后台</h1>
          <p className='text-muted-foreground mt-1'>欢迎，{user?.email}</p>
        </div>
        <button onClick={handleLogout} className='px-4 py-2 border rounded-md hover:bg-gray-100'>退出登录</button>
      </div>

      <div className='grid md:grid-cols-2 gap-4'>
        <Link href='/admin/projects' className='border rounded-lg p-6 hover:shadow-md'>
          <h2 className='text-xl font-semibold'>📂 项目管理</h2>
          <p className='text-muted-foreground mt-1'>共 {stats.projects} 个项目</p>
        </Link>
        <Link href='/admin/notes' className='border rounded-lg p-6 hover:shadow-md'>
          <h2 className='text-xl font-semibold'>📝 笔记管理</h2>
          <p className='text-muted-foreground mt-1'>共 {stats.notes} 篇笔记</p>
        </Link>
      </div>

      <div className='border rounded-lg p-6'>
        <h2 className='text-lg font-semibold mb-3'>🔗 分享链接</h2>
        <div className='space-y-2 text-sm'>
          <div className='flex gap-2'>
            <code className='bg-gray-100 px-3 py-1 rounded flex-1'>{siteUrl}/projects</code>
            <button onClick={() => navigator.clipboard.writeText(`${siteUrl}/projects`)} className='px-3 py-1 border rounded'>复制</button>
          </div>
          <div className='flex gap-2'>
            <code className='bg-gray-100 px-3 py-1 rounded flex-1'>{siteUrl}/notes</code>
            <button onClick={() => navigator.clipboard.writeText(`${siteUrl}/notes`)} className='px-3 py-1 border rounded'>复制</button>
          </div>
        </div>
      </div>
    </div>
  )
}
