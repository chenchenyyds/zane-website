'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function Notes() {
  const [notes, setNotes] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      fetchNotes()
    })
  }, [])

  async function fetchNotes() {
    const { data } = await supabase.from('notes').select('*').eq('is_public', true).order('created_at', { ascending: false })
    setNotes(data || [])
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('确定删除？')) return
    await supabase.from('notes').delete().eq('id', id)
    fetchNotes()
  }

  if (loading) return <div className='text-center py-20'>加载中...</div>

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div><h1 className='text-3xl font-bold'>知识库</h1><p className='text-muted-foreground mt-1'>共 {notes.length} 篇笔记</p></div>
        {user && <Link href='/admin/notes/new' className='px-4 py-2 bg-black text-white rounded-md'>+ 新建</Link>}
      </div>
      {notes.length > 0 ? (
        <div className='space-y-3'>
          {notes.map((n) => (
            <div key={n.id} className='border rounded-lg p-4'>
              <div className='flex justify-between items-start'>
                <Link href={`/notes/${n.id}`} className='font-medium hover:underline'>{n.title}</Link>
                {user && <div className='flex gap-3 text-sm'><Link href={`/admin/notes/${n.id}`} className='text-blue-600 hover:underline'>编辑</Link><button onClick={() => handleDelete(n.id)} className='text-red-600 hover:underline'>删除</button></div>}
              </div>
              <div className='flex gap-2 mt-2'>{n.tags?.map((t: string) => <span key={t} className='px-2 py-0.5 bg-gray-100 rounded text-xs'>{t}</span>)}<span className='text-xs text-muted-foreground ml-auto'>{new Date(n.created_at).toLocaleDateString('zh-CN')}</span></div>
            </div>
          ))}
        </div>
      ) : <div className='text-center py-16 border rounded-lg text-muted-foreground'>暂无公开笔记</div>}
    </div>
  )
}
