'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ReactMarkdown from 'react-markdown'

export default function NoteDetail() {
  const params = useParams()
  const [note, setNote] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNote()
  }, [params.id])

  async function fetchNote() {
    const { data } = await supabase
      .from('notes')
      .select('*')
      .eq('id', params.id)
      .eq('is_public', true)
      .single()
    setNote(data)
    setLoading(false)
  }

  if (loading) return <div className='text-center py-20'>加载中...</div>

  if (!note) {
    return (
      <div className='text-center py-20'>
        <h1 className='text-2xl font-bold mb-4'>笔记不存在</h1>
        <Link href='/notes' className='text-blue-600 hover:underline'>返回笔记列表</Link>
      </div>
    )
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <Link href='/notes' className='text-sm text-muted-foreground hover:underline'>← 返回</Link>
        <Link href={`/admin/notes/${note.id}`} className='px-3 py-1 border rounded text-sm'>编辑</Link>
      </div>
      
      <h1 className='text-3xl font-bold mb-4'>{note.title}</h1>
      <div className='flex gap-2 mb-8'>
        {note.tags?.map((t: string) => (
          <span key={t} className='px-2 py-1 bg-gray-100 rounded text-sm'>{t}</span>
        ))}
        <span className='text-sm text-muted-foreground ml-auto'>
          {new Date(note.created_at).toLocaleDateString('zh-CN')}
        </span>
      </div>
      <div className='prose max-w-none'>
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </div>
    </div>
  )
}
