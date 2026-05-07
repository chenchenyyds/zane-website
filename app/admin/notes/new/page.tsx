'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function NewNote() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', is_public: true })
  const [preview, setPreview] = useState(true)
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.replace('/login')
    })
  }, [router])

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const newTag = tagInput.trim()
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag])
        setTagInput('')
      }
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) {
      alert('请输入标题')
      return
    }
    setLoading(true)

    const { error } = await supabase.from('notes').insert({
      title: form.title,
      content: form.content,
      tags: tags,
      is_public: form.is_public,
    })

    if (error) {
      alert('创建失败：' + error.message)
      setLoading(false)
    } else {
      router.push('/admin/notes')
    }
  }

  const components = {
    h1: (props: any) => <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem', color: '#111' }} {...props} />,
    h2: (props: any) => <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }} {...props} />,
    h3: (props: any) => <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '1rem', marginBottom: '0.5rem', color: '#1f2937' }} {...props} />,
    p: (props: any) => <p style={{ marginBottom: '0.75rem', lineHeight: 1.7 }} {...props} />,
    ul: (props: any) => <ul style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', listStyle: 'disc' }} {...props} />,
    ol: (props: any) => <ol style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', listStyle: 'decimal' }} {...props} />,
    li: (props: any) => <li style={{ marginBottom: '0.25rem' }} {...props} />,
    blockquote: (props: any) => <blockquote style={{ borderLeft: '3px solid #d1d5db', paddingLeft: '1rem', margin: '1rem 0', color: '#6b7280', fontStyle: 'italic' }} {...props} />,
    code: ({ className, children, ...props }: any) => {
      if (!className) return <code style={{ backgroundColor: '#f3f4f6', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', fontSize: '0.875rem', fontFamily: 'monospace' }}>{children}</code>
      return <code style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>{children}</code>
    },
    pre: (props: any) => <pre style={{ backgroundColor: '#1f2937', color: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto', margin: '1rem 0' }} {...props} />,
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* 顶部导航 */}
      <div className='bg-white border-b sticky top-0 z-10'>
        <div className='max-w-7xl mx-auto px-4 py-3 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Link href='/admin/notes' className='text-sm text-gray-500 hover:text-gray-900'>← 笔记</Link>
            <span className='text-gray-300'>|</span>
            <span className='text-sm text-gray-900'>新建笔记</span>
          </div>
          <div className='flex items-center gap-3'>
            <button type='button' onClick={() => setPreview(!preview)} className='px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50'>
              {preview ? '编辑' : '预览'}
            </button>
            <button type='submit' form='note-form' disabled={loading} className='px-4 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50'>
              {loading ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      </div>

      <form id='note-form' onSubmit={handleSubmit} className='max-w-7xl mx-auto'>
        <div className='flex h-[calc(100vh-57px)]'>
          {/* 左侧编辑区 */}
          <div className={`flex-1 p-8 ${preview ? 'border-r' : ''}`}>
            <div className='max-w-3xl mx-auto'>
              <input
                type='text'
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className='w-full text-3xl font-bold border-0 focus:ring-0 p-0 mb-6 placeholder-gray-300'
                placeholder='标题'
                required
              />
              
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className='w-full min-h-[400px] border-0 focus:ring-0 p-0 resize-none text-base leading-relaxed placeholder-gray-300'
                placeholder='写下你的笔记...'
              />
            </div>
          </div>

          {/* 右侧预览区 */}
          {preview && (
            <div className='flex-1 p-8 bg-white overflow-y-auto'>
              <div className='max-w-3xl mx-auto'>
                <h1 className='text-3xl font-bold mb-6'>{form.title || '无标题'}</h1>
                <div className='prose max-w-none'>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                    {form.content || '*暂无内容*'}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* 底部工具栏 */}
      <div className='fixed bottom-4 left-1/2 -translate-x-1/2 bg-white border rounded-full shadow-lg px-4 py-2 flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <span className='text-xs text-gray-500'>标签：</span>
          {tags.map(tag => (
            <span key={tag} className='inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-xs'>
              {tag}
              <button type='button' onClick={() => removeTag(tag)} className='text-gray-400 hover:text-gray-600'>×</button>
            </span>
          ))}
          <input
            type='text'
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
            className='w-24 text-xs border-0 focus:ring-0 p-0 placeholder-gray-400'
            placeholder='添加标签'
          />
        </div>
        <div className='w-px h-4 bg-gray-200' />
        <label className='flex items-center gap-2 text-xs cursor-pointer'>
          <input
            type='checkbox'
            checked={form.is_public}
            onChange={(e) => setForm({ ...form, is_public: e.target.checked })}
            className='rounded'
          />
          公开
        </label>
      </div>
    </div>
  )
}
