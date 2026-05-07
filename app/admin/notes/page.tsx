'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminNotes() {
  const router = useRouter()
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.replace('/login')
      else fetchNotes()
    })
  }, [router])

  async function fetchNotes() {
    const { data } = await supabase.from('notes').select('*').order('created_at', { ascending: false })
    setNotes(data || [])
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('确定删除？')) return
    await supabase.from('notes').delete().eq('id', id)
    fetchNotes()
  }

  async function togglePublic(id: string, current: boolean) {
    await supabase.from('notes').update({ is_public: !current }).eq('id', id)
    fetchNotes()
  }

  if (loading) return <div className='text-center py-20'>加载中...</div>

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <Link href='/admin' className='text-sm text-muted-foreground hover:underline'>← 返回</Link>
        <Link href='/admin/notes/new' className='px-4 py-2 bg-black text-white rounded-md'>+ 新建笔记</Link>
      </div>
      <h1 className='text-2xl font-bold'>笔记管理</h1>
      {notes.length > 0 ? (
        <div className='border rounded-lg divide-y'>
          {notes.map((n) => (
            <div key={n.id} className='p-4 flex items-center justify-between'>
              <div className='flex-1'>
                <h3 className='font-medium'>{n.title}</h3>
                <div className='flex gap-2 mt-1'>{n.tags?.map((t: string) => <span key={t} className='px-2 py-0.5 bg-gray-100 rounded text-xs'>{t}</span>)}</div>
              </div>
              <div className='flex items-center gap-4'>
                <button onClick={() => togglePublic(n.id, n.is_public)} className={`text-xs px-2 py-1 rounded ${n.is_public ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>{n.is_public ? '公开' : '私密'}</button>
                <Link href={`/admin/notes/${n.id}`} className='text-sm text-blue-600 hover:underline'>编辑</Link>
                <button onClick={() => handleDelete(n.id)} className='text-sm text-red-600 hover:underline'>删除</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-12 border rounded-lg text-muted-foreground'>暂无笔记，<Link href='/admin/notes/new' className='text-blue-600 hover:underline'>创建一个</Link></div>
      )}
    </div>
  )
}
