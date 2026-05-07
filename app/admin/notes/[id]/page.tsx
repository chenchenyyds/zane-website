'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ReactMarkdown from 'react-markdown'

export default function EditNote({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    is_public: true,
  })

  useEffect(() => {
    async function loadNote() {
      const { data } = await supabase
        .from('notes')
        .select('*')
        .eq('id', params.id)
        .single()

      if (data) {
        setFormData({
          title: data.title,
          content: data.content || '',
          tags: data.tags?.join(', ') || '',
          is_public: data.is_public,
        })
      }
      
      setLoading(false)
    }

    loadNote()
  }, [params.id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const tagsArray = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t)

    const { error } = await supabase
      .from('notes')
      .update({
        title: formData.title,
        content: formData.content,
        tags: tagsArray,
        is_public: formData.is_public,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)

    if (!error) {
      router.push('/admin/notes')
      router.refresh()
    } else {
      alert('保存失败：' + error.message)
    }
    
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm('确定要删除这篇笔记吗？')) return
    
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', params.id)

    if (!error) {
      router.push('/admin/notes')
      router.refresh()
    }
  }

  if (loading) {
    return <div className='text-center py-12'>加载中...</div>
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>编辑笔记</h1>
      
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label className='block text-sm font-medium mb-2'>
            笔记标题 *
          </label>
          <input
            type='text'
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-2'>
            标签（逗号分隔）
          </label>
          <input
            type='text'
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium mb-2'>
              内容（Markdown）
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary h-96 font-mono text-sm'
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-2'>
              预览
            </label>
            <div className='w-full px-4 py-4 border rounded-md h-96 overflow-auto prose prose-sm max-w-none'>
              <ReactMarkdown>{formData.content}</ReactMarkdown>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            id='is_public'
            checked={formData.is_public}
            onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
            className='w-4 h-4'
          />
          <label htmlFor='is_public' className='text-sm'>
            公开笔记（访客可见）
          </label>
        </div>

        <div className='flex gap-4'>
          <button
            type='button'
            onClick={() => router.back()}
            className='px-4 py-2 border rounded-md hover:bg-muted transition-colors'
          >
            取消
          </button>
          <button
            type='button'
            onClick={handleDelete}
            className='px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors'
          >
            删除
          </button>
          <button
            type='submit'
            disabled={saving}
            className='px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity disabled:opacity-50'
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  )
}
