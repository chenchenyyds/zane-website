'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'

export default function NoteDetail() {
  const params = useParams()
  const [note, setNote] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
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
        <Link href='/notes' className='text-sm text-muted-foreground hover:text-foreground'>← 返回</Link>
        {user && (
          <Link href={`/admin/notes/${note.id}`} className='px-3 py-1 border rounded text-sm hover:bg-gray-100'>
            编辑
          </Link>
        )}
      </div>
      
      <h1 className='text-3xl font-bold mb-4'>{note.title}</h1>
      <div className='flex gap-2 mb-8 flex-wrap'>
        {note.tags?.map((t: string) => (
          <span key={t} className='px-2 py-1 bg-gray-100 rounded text-sm'>{t}</span>
        ))}
        <span className='text-sm text-muted-foreground ml-auto'>
          {new Date(note.created_at).toLocaleDateString('zh-CN')}
        </span>
      </div>
      
      <article className='prose prose-slate max-w-none
        prose-headings:font-semibold prose-headings:text-gray-900
        prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
        prose-p:text-gray-700 prose-p:leading-relaxed
        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
        prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-gray-900 prose-pre:rounded-lg prose-pre:p-4
        prose-img:rounded-lg prose-img:shadow-md
        prose-table:border prose-th:border prose-td:border
        prose-ul:list-disc prose-ol:list-decimal
        prose-li:my-1'>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw]}
        >
          {note.content}
        </ReactMarkdown>
      </article>
    </div>
  )
}
