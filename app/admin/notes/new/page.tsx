'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ReactMarkdown from 'react-markdown'

export default function NewNote() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    is_public: true,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const tagsArray = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t)

    const { error } = await supabase.from('notes').insert({
      title: formData.title,
      content: formData.content,
      tags: tagsArray,
      is_public: formData.is_public,
    })

    if (!error) {
      router.push('/admin/notes')
      router.refresh()
    } else {
      alert('创建失败：' + error.message)
    }
    
    setLoading(false)
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>新建笔记</h1>
      
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
            placeholder='笔记标题...'
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
            placeholder='技术, Next.js, 前端'
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
              placeholder='# 标题

这是正文内容。

## 二级标题

- 列表项1
- 列表项2

```javascript
console.log("代码块")
```'
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-2'>
              预览
            </label>
            <div className='w-full px-4 py-4 border rounded-md h-96 overflow-auto prose prose-sm max-w-none'>
              {formData.content ? (
                <ReactMarkdown>{formData.content}</ReactMarkdown>
              ) : (
                <p className='text-muted-foreground'>开始输入内容后这里会显示预览</p>
              )}
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
            type='submit'
            disabled={loading}
            className='px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity disabled:opacity-50'
          >
            {loading ? '创建中...' : '创建笔记'}
          </button>
        </div>
      </form>
    </div>
  )
}
