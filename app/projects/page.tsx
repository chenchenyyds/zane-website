'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

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

  if (loading) return <div className='text-center py-20'>加载中...</div>

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold'>项目展示</h1>
          <p className='text-muted-foreground mt-1'>共 {filteredProjects.length} 个项目</p>
        </div>
        {user && <Link href='/admin/projects/new' className='px-4 py-2 bg-black dark:bg-gray-700 text-white dark:text-white rounded-md'>+ 新建</Link>}
      </div>

      {/* 搜索框 */}
      <div className='relative'>
        <svg className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
        </svg>
        <input
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='搜索项目名称、描述或技术栈...'
          className='w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white'
        />
      </div>

      {filteredProjects.length > 0 ? (
        <div className='grid md:grid-cols-2 gap-4'>
          {filteredProjects.map((p) => (
            <div key={p.id} className='border dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition-shadow'>
              <div className='flex justify-between items-start mb-2'>
                <h2 className='font-semibold dark:text-white'>{p.name}</h2>
                {user && (
                  <div className='flex gap-3 text-sm'>
                    <Link href={`/admin/projects/${p.id}`} className='text-blue-600 hover:underline'>编辑</Link>
                    <button onClick={() => handleDelete(p.id)} className='text-red-600 hover:underline'>删除</button>
                  </div>
                )}
              </div>
              <p className='text-sm text-muted-foreground mb-3 dark:text-gray-400'>{p.description || '暂无描述'}</p>
              <div className='flex flex-wrap gap-1 mb-3'>
                {p.tech_stack?.map((t: string) => (
                  <span key={t} className='px-2 py-0.5 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded text-xs'>{t}</span>
                ))}
              </div>
              <div className='flex gap-4 text-sm'>
                {p.git_url && (
                  <a href={p.git_url} target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'>
                    GitHub →
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
        <div className='text-center py-16 border dark:border-gray-700 rounded-lg text-muted-foreground'>
          {searchQuery ? '没有找到匹配的项目' : '暂无公开项目'}
        </div>
      )}
    </div>
  )
}
