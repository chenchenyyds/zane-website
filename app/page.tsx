'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [recentProjects, setRecentProjects] = useState<any[]>([])
  const [recentNotes, setRecentNotes] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
    
    // 获取最近的项目和笔记
    Promise.all([
      supabase.from('projects').select('*').eq('is_public', true).order('created_at', { ascending: false }).limit(3),
      supabase.from('notes').select('*').eq('is_public', true).order('created_at', { ascending: false }).limit(3),
    ]).then(([projects, notes]) => {
      setRecentProjects(projects.data || [])
      setRecentNotes(notes.data || [])
    })
  }, [])

  return (
    <div className='space-y-16'>
      {/* Hero Section */}
      <section className='text-center py-12'>
        <div className='w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-white text-3xl font-bold'>
          Z
        </div>
        <h1 className='text-4xl font-bold mb-4'>你好，我是 Zane</h1>
        <p className='text-muted-foreground text-lg max-w-xl mx-auto mb-6'>
          全栈开发者 | 技术爱好者<br />
          专注 Java / Spring Boot / Angular 开发
        </p>
        <div className='flex justify-center gap-4'>
          <a href='https://github.com/chenchenyyds' target='_blank' rel='noopener noreferrer' 
             className='px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors'>
            GitHub
          </a>
          <a href='mailto:847965641@qq.com' 
             className='px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors'>
            联系我
          </a>
        </div>
      </section>

      {/* 最近项目 */}
      <section>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-semibold'>最新项目</h2>
          <Link href='/projects' className='text-sm text-blue-600 hover:underline'>查看全部 →</Link>
        </div>
        {recentProjects.length > 0 ? (
          <div className='grid md:grid-cols-3 gap-4'>
            {recentProjects.map((p) => (
              <div key={p.id} className='border rounded-lg p-5 hover:shadow-md transition-shadow'>
                <h3 className='font-semibold mb-2'>{p.name}</h3>
                <p className='text-sm text-muted-foreground mb-3 line-clamp-2'>{p.description || '暂无描述'}</p>
                <div className='flex flex-wrap gap-1 mb-3'>
                  {p.tech_stack?.slice(0, 3).map((t: string) => (
                    <span key={t} className='px-2 py-0.5 bg-gray-100 rounded text-xs'>{t}</span>
                  ))}
                </div>
                <div className='flex gap-3 text-sm'>
                  {p.git_url && (
                    <a href={p.git_url} target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'>
                      代码 →
                    </a>
                  )}
                  {p.live_url && (
                    <a href={p.live_url} target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'>
                      演示 →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-8 border rounded-lg text-muted-foreground'>
            暂无项目
            {user && <Link href='/admin/projects/new' className='text-blue-600 hover:underline ml-2'>去创建 →</Link>}
          </div>
        )}
      </section>

      {/* 最近笔记 */}
      <section>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-semibold'>最新笔记</h2>
          <Link href='/notes' className='text-sm text-blue-600 hover:underline'>查看全部 →</Link>
        </div>
        {recentNotes.length > 0 ? (
          <div className='space-y-3'>
            {recentNotes.map((n) => (
              <Link key={n.id} href={`/notes/${n.id}`} className='block border rounded-lg p-4 hover:shadow-md transition-shadow'>
                <div className='flex justify-between items-start'>
                  <h3 className='font-medium'>{n.title}</h3>
                  <span className='text-xs text-muted-foreground'>
                    {new Date(n.created_at).toLocaleDateString('zh-CN')}
                  </span>
                </div>
                <div className='flex gap-2 mt-2'>
                  {n.tags?.slice(0, 4).map((t: string) => (
                    <span key={t} className='px-2 py-0.5 bg-gray-100 rounded text-xs'>{t}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className='text-center py-8 border rounded-lg text-muted-foreground'>
            暂无笔记
            {user && <Link href='/admin/notes/new' className='text-blue-600 hover:underline ml-2'>去创建 →</Link>}
          </div>
        )}
      </section>
    </div>
  )
}
