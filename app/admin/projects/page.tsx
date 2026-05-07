'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminProjects() {
  const router = useRouter()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.replace('/login')
      else fetchProjects()
    })
  }, [router])

  async function fetchProjects() {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    setProjects(data || [])
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('确定删除？')) return
    await supabase.from('projects').delete().eq('id', id)
    fetchProjects()
  }

  async function togglePublic(id: string, current: boolean) {
    await supabase.from('projects').update({ is_public: !current }).eq('id', id)
    fetchProjects()
  }

  if (loading) return <div className='text-center py-20'>加载中...</div>

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <Link href='/admin' className='text-sm text-muted-foreground hover:underline'>← 返回</Link>
        <Link href='/admin/projects/new' className='px-4 py-2 bg-black text-white rounded-md'>+ 新建项目</Link>
      </div>

      <h1 className='text-2xl font-bold'>项目管理</h1>

      {projects.length > 0 ? (
        <div className='border rounded-lg divide-y'>
          {projects.map((p) => (
            <div key={p.id} className='p-4 flex items-center justify-between'>
              <div className='flex-1'>
                <h3 className='font-medium'>{p.name}</h3>
                <p className='text-sm text-muted-foreground mt-1'>{p.description || '暂无描述'}</p>
              </div>
              <div className='flex items-center gap-4'>
                <button onClick={() => togglePublic(p.id, p.is_public)} className={`text-xs px-2 py-1 rounded ${p.is_public ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                  {p.is_public ? '公开' : '私密'}
                </button>
                <Link href={`/admin/projects/${p.id}`} className='text-sm text-blue-600 hover:underline'>编辑</Link>
                <button onClick={() => handleDelete(p.id)} className='text-sm text-red-600 hover:underline'>删除</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-12 border rounded-lg text-muted-foreground'>
          暂无项目，<Link href='/admin/projects/new' className='text-blue-600 hover:underline'>创建一个</Link>
        </div>
      )}
    </div>
  )
}
