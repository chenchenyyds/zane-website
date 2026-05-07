'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function NewProject() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    git_url: '',
    live_url: '',
    tech_stack: '',
    is_public: true,
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.replace('/login')
    })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      alert('请输入项目名称')
      return
    }
    setLoading(true)

    const { error } = await supabase.from('projects').insert({
      name: form.name,
      description: form.description,
      git_url: form.git_url || null,
      live_url: form.live_url || null,
      tech_stack: form.tech_stack.split(',').map(t => t.trim()).filter(Boolean),
      is_public: form.is_public,
    })

    setLoading(false)
    if (error) {
      alert('创建失败：' + error.message)
    } else {
      router.push('/admin/projects')
    }
  }

  return (
    <div className='max-w-2xl mx-auto' style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <Link href='/admin/projects' className='text-sm hover:underline mb-4 inline-block' style={{ color: 'var(--foreground)' }}>
        ← 返回
      </Link>
      <h1 className='text-2xl font-bold mb-6'>新建项目</h1>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium mb-1'>项目名称 *</label>
          <input
            type='text'
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className='w-full px-3 py-2 border rounded-md'
            style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            placeholder='我的项目'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>项目描述</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className='w-full px-3 py-2 border rounded-md'
            style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            rows={3}
            placeholder='这是一个很棒的项目...'
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>技术栈（逗号分隔）</label>
          <input
            type='text'
            value={form.tech_stack}
            onChange={(e) => setForm({ ...form, tech_stack: e.target.value })}
            className='w-full px-3 py-2 border rounded-md'
            style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            placeholder='React, Node.js, PostgreSQL'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>GitHub 地址</label>
            <input
              type='url'
              value={form.git_url}
              onChange={(e) => setForm({ ...form, git_url: e.target.value })}
              className='w-full px-3 py-2 border rounded-md'
              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              placeholder='https://github.com/...'
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>在线演示地址</label>
            <input
              type='url'
              value={form.live_url}
              onChange={(e) => setForm({ ...form, live_url: e.target.value })}
              className='w-full px-3 py-2 border rounded-md'
              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              placeholder='https://myproject.vercel.app'
            />
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            id='is_public'
            checked={form.is_public}
            onChange={(e) => setForm({ ...form, is_public: e.target.checked })}
            className='rounded'
          />
          <label htmlFor='is_public' className='text-sm'>公开分享</label>
        </div>

        <div className='flex gap-3 pt-4'>
          <button type='submit' disabled={loading} className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50'>
            {loading ? '创建中...' : '创建'}
          </button>
          <Link href='/admin/projects' className='px-6 py-2 border rounded-md hover:opacity-80' style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
            取消
          </Link>
        </div>
      </form>
    </div>
  )
}
