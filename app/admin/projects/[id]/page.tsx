'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function EditProject({ params }: { params: { id: string } }) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    git_url: '',
    live_url: '',
    tech_stack: '',
    is_public: true,
  })

  useEffect(() => {
    async function loadProject() {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('id', params.id)
        .single()

      if (data) {
        setFormData({
          name: data.name,
          description: data.description || '',
          git_url: data.git_url || '',
          live_url: data.live_url || '',
          tech_stack: data.tech_stack?.join(', ') || '',
          is_public: data.is_public,
        })
      }
      
      setLoading(false)
    }

    loadProject()
  }, [params.id, supabase])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const techStackArray = formData.tech_stack
      .split(',')
      .map(t => t.trim())
      .filter(t => t)

    const { error } = await supabase
      .from('projects')
      .update({
        name: formData.name,
        description: formData.description,
        git_url: formData.git_url || null,
        live_url: formData.live_url || null,
        tech_stack: techStackArray,
        is_public: formData.is_public,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)

    if (!error) {
      router.push('/admin/projects')
      router.refresh()
    } else {
      alert('保存失败：' + error.message)
    }
    
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm('确定要删除这个项目吗？')) return
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', params.id)

    if (!error) {
      router.push('/admin/projects')
      router.refresh()
    }
  }

  if (loading) {
    return <div className='text-center py-12'>加载中...</div>
  }

  return (
    <div className='max-w-2xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>编辑项目</h1>
      
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
