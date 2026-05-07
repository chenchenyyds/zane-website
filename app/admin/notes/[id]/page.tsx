'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import ReactMarkdown from 'react-markdown'

export default function EditNote({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notePublic, setNotePublic] = useState(false)
  
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
        setNotePublic(data.is_public)
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
    } else {
      alert('删除失败：' + error.message)
    }
  }

  const copyShareLink = () => {
    const siteUrl = window.location.origin
    navigator.clipboard.writeText(`${siteUrl}/notes/${params.id}`)
    alert('分享链接已复制！')
  }

  if (loading) {
    return <div className='text-center py-12'>加载中...</div>
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>编辑笔记</h1>
        <div className='flex gap-2'>
          {notePublic && (
            <button
              onClick={copyShareLink}
              className='px-4 py-2 border rounded-md hover:bg-muted transition-colors'
            >
              复制分享链接
            </button>
          )}
          <Link
            href='/admin/notes'
            className='px-4 py-2 border rounded-md hover:bg-muted transition-colors'
          >
            返回
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='border rounded-lg p-6 space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-2'>标题 *</label>
            <input
              type='text'
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className='w-full px-3 py-2 border rounded-md'
              placeholder='输入笔记标题'
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>内容 (支持 Markdown)</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={15}
              className='w-full px-3 py-2 border rounded-md font-mono text-sm'
              placeholder='使用 Markdown 编写笔记内容...'
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>标签</label>
            <input
              type='text'
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className='w-full px-3 py-2 border rounded-md'
              placeholder='技术, 前端, React（用逗号分隔）'
            />
            <p className='text-xs text-muted-foreground mt-1'>
              多个标签用逗号分隔
            </p>
          </div>

          <div className='flex items-center gap-3'>
            <input
              type='checkbox'
              id='is_public'
              checked={formData.is_public}
              onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
              className='w-4 h-4'
            />
            <label htmlFor='is_public' className='text-sm font-medium'>
              公开分享（取消勾选则仅自己可见）
            </label>
          </div>
        </div>

        {formData.content && (
          <div className='border rounded-lg p-6'>
            <h3 className='text-sm font-medium mb-4 text-muted-foreground'>预览</h3>
            <div className='prose prose-sm max-w-none'>
              <ReactMarkdown>{formData.content}</ReactMarkdown>
            </div>
          </div>
        )}

        <div className='flex gap-4'>
          <button
            type='submit'
            disabled={saving}
            className='px-6 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50'
          >
            {saving ? '保存中...' : '保存修改'}
          </button>
          <button
            type='button'
            onClick={handleDelete}
            className='px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600'
          >
            删除笔记
          </button>
        </div>
      </form>
    </div>
  )
}
