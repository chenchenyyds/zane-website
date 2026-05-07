'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ReactMarkdown from 'react-markdown'

export default function EditNote() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', tags: '', is_public: true })

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.replace('/login')
      else fetchNote()
    })
  }, [params.id, router])

  async function fetchNote() {
    const { data } = await supabase.from('notes').select('*').eq('id', params.id).single()
    if (data) setForm({ ...data, tags: data.tags?.join(', ') || '' })
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('notes').update({
      title: form.title, content: form.content,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean), is_public: form.is_public,
    }).eq('id', params.id)
    if (error) { alert('保存失败：' + error.message); setSaving(false) }
    else router.push('/admin/notes')
  }

  async function handleDelete() {
    if (!confirm('确定删除？')) return
    await supabase.from('notes').delete().eq('id', params.id)
    router.push('/admin/notes')
  }

  if (loading) return <div className='text-center py-20'>加载中...</div>

  return (
    <div className='max-w-3xl'>
      <Link href='/admin/notes' className='text-sm text-muted-foreground hover:underline mb-4 inline-block'>← 返回</Link>
      <h1 className='text-2xl font-bold mb-6'>编辑笔记</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='flex gap-4 items-center'>
          <input type='text' value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className='flex-1 px-3 py-2 border rounded-md text-lg font-medium' placeholder='标题' required />
          <button type='button' onClick={() => setPreview(!preview)} className='px-4 py-2 border rounded-md'>{preview ? '编辑' : '预览'}</button>
        </div>
        {preview ? <div className='border rounded-lg p-6 min-h-[400px]'><ReactMarkdown>{form.content}</ReactMarkdown></div> : <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className='w-full px-3 py-2 border rounded-md font-mono text-sm' rows={20} placeholder='Markdown...' />}
        <input type='text' value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className='w-full px-3 py-2 border rounded-md' placeholder='标签（逗号分隔）' />
        <div className='flex items-center gap-2'><input type='checkbox' id='is_public' checked={form.is_public} onChange={(e) => setForm({ ...form, is_public: e.target.checked })} className='w-4 h-4' /><label htmlFor='is_public' className='text-sm'>公开</label></div>
        <div className='flex gap-3 pt-4'>
          <button type='submit' disabled={saving} className='px-6 py-2 bg-black text-white rounded-md disabled:opacity-50'>{saving ? '保存中...' : '保存'}</button>
          <button type='button' onClick={handleDelete} className='px-6 py-2 bg-red-500 text-white rounded-md'>删除</button>
          <Link href='/admin/notes' className='px-6 py-2 border rounded-md'>取消</Link>
        </div>
      </form>
    </div>
  )
}
