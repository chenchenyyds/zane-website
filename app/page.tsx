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
    
    Promise.all([
      supabase.from('projects').select('*').eq('is_public', true).order('created_at', { ascending: false }).limit(3),
      supabase.from('notes').select('*').eq('is_public', true).order('created_at', { ascending: false }).limit(3),
    ]).then(([projects, notes]) => {
      setRecentProjects(projects.data || [])
      setRecentNotes(notes.data || [])
    })
  }, [])

  return (
    <div className='space-y-12'>
      {/* Hero Section */}
      <section className='text-center py-10 md:py-16 relative'>
        <div className='absolute inset-0 -z-10'>
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 bg-blue-500/10 rounded-full blur-3xl'></div>
        </div>
        
        <div className='w-20 h-20 md:w-28 md:h-28 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-lg'>
          Z
        </div>
        
        <h1 className='text-2xl md:text-4xl font-bold mb-3'>
          你好，我是 <span className='bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent'>Zane</span>
        </h1>
        <p className='text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-6'>
          全栈开发者 · 技术爱好者
        </p>
        <p className='text-sm text-gray-500 mb-6'>专注 Java / Spring Boot / Angular 开发</p>
        <div className='flex justify-center gap-3 flex-wrap'>
          <a href='https://github.com/chenchenyyds' target='_blank' rel='noopener noreferrer' 
             className='btn-secondary'>
            <svg className='w-4 h-4 md:w-5 md:h-5' fill='currentColor' viewBox='0 0 24 24'><path d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z'/></svg>
            GitHub
          </a>
          <a href='mailto:847965641@qq.com' className='btn-primary'>
            <svg className='w-4 h-4 md:w-5 md:h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'/></svg>
            联系我
          </a>
        </div>
      </section>

      {/* 最近项目 */}
      <section>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl md:text-2xl font-bold'>最新项目</h2>
          <Link href='/projects' className='text-blue-500 hover:text-blue-600 font-medium text-sm'>
            查看全部 →
          </Link>
        </div>
        {recentProjects.length > 0 ? (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {recentProjects.map((p, index) => {
              const gradients = [
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              ]
              const gradient = gradients[index % gradients.length]
              return (
                <div key={p.id} className='rounded-xl p-5 transition-all duration-300 hover:scale-105 hover:shadow-xl' style={{ background: gradient }}>
                  <h3 className='font-bold text-white text-lg mb-2'>{p.name}</h3>
                  <p className='text-white/80 text-sm mb-3 line-clamp-2'>{p.description || '暂无描述'}</p>
                  <div className='flex flex-wrap gap-1.5 mb-3'>
                    {p.tech_stack?.slice(0, 3).map((t: string) => (
                      <span key={t} className='px-2 py-0.5 bg-white/20 rounded text-white text-xs'>{t}</span>
                    ))}
                  </div>
                  <div className='flex gap-3 text-sm'>
                    {p.git_url && (
                      <a href={p.git_url} target='_blank' rel='noopener noreferrer' className='text-white hover:underline'>代码 →</a>
                    )}
                    {p.live_url && (
                      <a href={p.live_url} target='_blank' rel='noopener noreferrer' className='text-white hover:underline'>演示 →</a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className='card p-6 text-center'>
            <p className='text-gray-500'>还没有项目</p>
            {user && <Link href='/projects/new' className='text-blue-500 hover:text-blue-600 mt-2 inline-block text-sm'>去创建 →</Link>}
          </div>
        )}
      </section>

      {/* 最近笔记 */}
      <section>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl md:text-2xl font-bold'>最新笔记</h2>
          <Link href='/notes' className='text-blue-500 hover:text-blue-600 font-medium text-sm'>
            查看全部 →
          </Link>
        </div>
        {recentNotes.length > 0 ? (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {recentNotes.map((n) => (
              <Link key={n.id} href={`/notes/${n.id}`} className='block p-5 rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-lg' style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className='font-semibold mb-2 line-clamp-1' style={{ color: 'var(--foreground)' }}>{n.title}</h3>
                <p className='text-sm mb-3 line-clamp-2' style={{ color: 'var(--foreground)', opacity: 0.7 }}>
                  {n.content?.substring(0, 80) || '暂无内容'}...
                </p>
                <div className='flex flex-wrap gap-1 mb-2'>
                  {n.tags?.slice(0, 3).map((t: string) => (
                    <span key={t} className='px-2 py-0.5 rounded text-xs' style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>{t}</span>
                  ))}
                </div>
                <span className='text-xs' style={{ color: 'var(--foreground)', opacity: 0.5 }}>
                  {new Date(n.created_at).toLocaleDateString('zh-CN')}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className='card p-6 text-center'>
            <p className='text-gray-500'>还没有笔记</p>
            {user && <Link href='/notes/new' className='text-blue-500 hover:text-blue-600 mt-2 inline-block text-sm'>去创建 →</Link>}
          </div>
        )}
      </section>
    </div>
  )
}
