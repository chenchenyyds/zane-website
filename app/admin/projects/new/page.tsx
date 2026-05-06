'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function NewProject() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    git_url: '',
    live_url: '',
    tech_stack: '',
    is_public: true,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const techStackArray = formData.tech_stack
      .split(',')
      .map(t => t.trim())
      .filter(t => t)

    const { error } = await supabase.from('projects').insert({
      name: formData.name,
      description: formData.description,
      git_url: formData.git_url || null,
      live_url: formData.live_url || null,
      tech_stack: techStackArray,
      is_public: formData.is_public,
    })

    if (!error) {
      router.push('/admin/projects')
      router.refresh()
    } else {
      alert('创建失败：' + error.message)
    }
    
    setLoading(false)
  }

  return (
    <div className='max-w-2xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>新建项目</h1>
      
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label className='block text-sm font-medium mb-2'>
            项目名称 *
          </label>
          <input
            type='text'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
            placeholder='我的项目'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-2'>
            项目描述
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary h-32'
            placeholder='项目描述...'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium mb-2'>
              Git 地址
            </label>
            <input
              type='url'
              value={formData.git_url}
              onChange={(e) => setFormData({ ...formData, git_url: e.target.value })}
              className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
              placeholder='https://github.com/...'
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-2'>
              在线演示地址
            </label>
            <input
              type='url'
              value={formData.live_url}
              onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
              className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
              placeholder='https://...'
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium mb-2'>
            技术栈（逗号分隔）
          </label>
          <input
            type='text'
            value={formData.tech_stack}
            onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
            placeholder='React, TypeScript, Tailwind CSS'
          />
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
            公开项目（访客可见）
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
            {loading ? '创建中...' : '创建项目'}
          </button>
        </div>
      </form>
    </div>
  )
}
