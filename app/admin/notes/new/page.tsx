'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ReactMarkdown from 'react-markdown'

export default function NewNote() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', tags: '', is_public: true })
  const [preview, setPreview] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('notes').insert({
      title: form.title,
      content: form.content,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      is_public: form.is_public,
    })

    if (error) {
      alert('创建失败：' + error.message)
      setLoading(false)
    } else {
      router.push('/admin/notes')
    }
  }

  return (
    <div className='max-w-3xl'>
      <Link href='/admin/notes' className='text-sm text-muted-foreground hover:underline mb-4 inline-block'>← 返回</Link>
      <h1 className='text-2xl font-bold mb-6'>新建笔记</h1>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='flex gap-4 items-center'>
          <div className='flex-1'>
            <input
              type='text'
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className='w-full px-3 py-2 border rounded-md text-lg font-medium'
              placeholder='笔记标题'
              required
            />
          </div>
          <button type='button' onClick={() => setPreview(!preview)} className='px-4 py-2 border rounded-md'>
            {preview ? '编辑' : '预览'}
          </button>
        </div>

        {preview ? (
          <div className='border rounded-lg p-6 min-h-[400px]'>
            <ReactMarkdown>{form.content}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className='w-full px-3 py-2 border rounded-md font-mono text-sm'
            rows={20}
            placeholder='支持 Markdown 语法...'
          />
        )}

        <div>
          <input
            type='text'
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className='w-full px-3 py-2 border rounded-md'
            placeholder='标签（逗号分隔）'
          />
        </div>

        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            id='is_public'
            checked={form.is_public}
            onChange={(e) => setForm({ ...form, is_public: e.target.checked })}
            className='w-4 h-4'
          />
          <label htmlFor='is_public' className='text-sm'>公开分享</label>
        </div>

        <div className='flex gap-3 pt-4'>
          <button type='submit' disabled={loading} className='px-6 py-2 bg-black text-white rounded-md disabled:opacity-50'>
            {loading ? '创建中...' : '创建'}
          </button>
          <Link href='/admin/notes' className='px-6 py-2 border rounded-md'>取消</Link>
        </div>
      </form>
    </div>
  )
}
