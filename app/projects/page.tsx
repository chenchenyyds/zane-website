'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

// 渐变背景数组
const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',   // 蓝紫渐变
  'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',   // 青绿渐变
  'linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)',   // 橙红渐变
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',   // 天蓝渐变
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',   // 粉橙渐变
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',   // 紫粉渐变
  'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)',   // 翠绿渐变
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',   // 粉红渐变
]

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([])
  const [filteredProjects, setFilteredProjects] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      fetchProjects()
    })
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      setFilteredProjects(projects.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.tech_stack?.some((t: string) => t.toLowerCase().includes(query))
      ))
    } else {
      setFilteredProjects(projects)
    }
  }, [searchQuery, projects])

  async function fetchProjects() {
    const { data } = await supabase.from('projects').select('*').eq('is_public', true).order('created_at', { ascending: false })
    setProjects(data || [])
    setFilteredProjects(data || [])
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('确定删除？')) return
    await supabase.from('projects').delete().eq('id', id)
    fetchProjects()
  }

  if (loading) return <div className='text-center py-20' style={{ color: 'var(--foreground)' }}>加载中...</div>

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold' style={{ color: 'var(--foreground)' }}>项目展示</h1>
          <p className='mt-1' style={{ color: 'var(--muted-foreground)' }}>共 {filteredProjects.length} 个项目</p>
        </div>
        {user && <Link href='/projects/new' className='px-4 py-2 rounded-md text-white' style={{ backgroundColor: '#3b82f6' }}>+ 新建</Link>}
      </div>

      {/* 搜索框 */}
      <div className='flex items-center gap-3 px-4 py-2.5 border rounded-lg' style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
        <svg className='w-5 h-5 flex-shrink-0' style={{ color: 'var(--foreground)' }} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
        </svg>
        <input
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='搜索项目名称、描述或技术栈...'
          className='flex-1 border-0 p-0 focus:ring-0 bg-transparent text-sm'
          style={{ color: 'var(--foreground)' }}
        />
      </div>

      {filteredProjects.length > 0 ? (
        <div className='grid md:grid-cols-2 gap-5'>
          {filteredProjects.map((p, index) => (
            <div 
              key={p.id} 
              className='rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group'
              style={{ 
                background: gradients[index % gradients.length],
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className='flex justify-between items-start mb-3'>
                <h2 className='font-bold text-xl text-white group-hover:text-opacity-90'>{p.name}</h2>
                {user && (
                  <div className='flex gap-3 text-sm'>
                    <Link href={`/projects/${p.id}`} className='text-white/80 hover:text-white hover:underline'>编辑</Link>
                    <button onClick={() => handleDelete(p.id)} className='text-white/80 hover:text-white hover:underline'>删除</button>
                  </div>
                )}
              </div>
              <p className='text-sm mb-4 text-white/90 line-clamp-2'>{p.description || '暂无描述'}</p>
              <div className='flex flex-wrap gap-2 mb-4'>
                {p.tech_stack?.map((t: string) => (
                  <span key={t} className='px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white'>{t}</span>
                ))}
              </div>
              <div className='flex gap-5 text-sm'>
                {p.git_url && (
                  <a href={p.git_url} target='_blank' rel='noopener noreferrer' className='text-white hover:text-white/80 flex items-center gap-1'>
                    <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'><path d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z'/></svg>
                    代码 →
                  </a>
                )}
                {p.live_url && (
                  <a href={p.live_url} target='_blank' rel='noopener noreferrer' className='text-white hover:text-white/80 flex items-center gap-1'>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' /></svg>
                    演示 →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-16 border rounded-lg' style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
          {searchQuery ? '没有找到匹配的项目' : '暂无公开项目'}
        </div>
      )}
    </div>
  )
}
