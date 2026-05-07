'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      fetchProjects()
    })
  }, [])

  async function fetchProjects() {
    const { data } = await supabase.from('projects').select('*').eq('is_public', true).order('created_at', { ascending: false })
    setProjects(data || [])
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
        <div><h1 className='text-3xl font-bold'>项目展示</h1><p className='text-muted-foreground mt-1'>共 {projects.length} 个项目</p></div>
        {user && <Link href='/admin/projects/new' className='px-4 py-2 bg-black text-white rounded-md'>+ 新建</Link>}
      </div>
      {projects.length > 0 ? (
        <div className='grid md:grid-cols-2 gap-4'>
          {projects.map((p) => (
            <div key={p.id} className='border rounded-lg p-5'>
              <div className='flex justify-between items-start mb-2'>
                <h2 className='font-semibold'>{p.name}</h2>
                {user && <div className='flex gap-3 text-sm'><Link href={`/admin/projects/${p.id}`} className='text-blue-600 hover:underline'>编辑</Link><button onClick={() => handleDelete(p.id)} className='text-red-600 hover:underline'>删除</button></div>}
              </div>
              <p className='text-sm text-muted-foreground mb-3'>{p.description || '暂无描述'}</p>
              <div className='flex flex-wrap gap-1 mb-3'>{p.tech_stack?.map((t: string) => <span key={t} className='px-2 py-0.5 bg-gray-100 rounded text-xs'>{t}</span>)}</div>
              <div className='flex gap-4 text-sm'>{p.git_url && <a href={p.git_url} target='_blank' className='text-blue-600 hover:underline'>GitHub →</a>}{p.live_url && <a href={p.live_url} target='_blank' className='text-blue-600 hover:underline'>演示 →</a>}</div>
            </div>
          ))}
        </div>
      ) : <div className='text-center py-16 border rounded-lg text-muted-foreground'>暂无公开项目</div>}
    </div>
  )
}
