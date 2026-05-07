'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function EditProject() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', git_url: '', live_url: '', tech_stack: '', is_public: true })

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.replace('/login')
      else fetchProject()
    })
  }, [params.id, router])

  async function fetchProject() {
    const { data } = await supabase.from('projects').select('*').eq('id', params.id).single()
    if (data) setForm({ ...data, tech_stack: data.tech_stack?.join(', ') || '' })
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('projects').update({
      name: form.name, description: form.description, git_url: form.git_url || null,
      live_url: form.live_url || null, tech_stack: form.tech_stack.split(',').map(t => t.trim()).filter(Boolean),
      is_public: form.is_public,
    }).eq('id', params.id)
    if (error) { alert('保存失败：' + error.message); setSaving(false) }
    else router.push('/admin/projects')
  }

  async function handleDelete() {
    if (!confirm('确定删除？')) return
    await supabase.from('projects').delete().eq('id', params.id)
    router.push('/admin/projects')
  }

  if (loading) return <div className='text-center py-20'>加载中...</div>

  return (
    <div className='max-w-xl'>
      <Link href='/admin/projects' className='text-sm text-muted-foreground hover:underline mb-4 inline-block'>← 返回</Link>
      <h1 className='text-2xl font-bold mb-6'>编辑项目</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div><label className='block text-sm mb-1'>项目名称 *</label>
          <input type='text' value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className='w-full px-3 py-2 border rounded-md' required />
        </div>
        <div><label className='block text-sm mb-1'>项目描述</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className='w-full px-3 py-2 border rounded-md' rows={3} />
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div><label className='block text-sm mb-1'>GitHub</label>
            <input type='url' value={form.git_url} onChange={(e) => setForm({ ...form, git_url: e.target.value })} className='w-full px-3 py-2 border rounded-md' />
          </div>
          <div><label className='block text-sm mb-1'>在线地址</label>
            <input type='url' value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} className='w-full px-3 py-2 border rounded-md' />
          </div>
        </div>
        <div><label className='block text-sm mb-1'>技术栈</label>
          <input type='text' value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} className='w-full px-3 py-2 border rounded-md' placeholder='逗号分隔' />
        </div>
        <div className='flex items-center gap-2'>
          <input type='checkbox' id='is_public' checked={form.is_public} onChange={(e) => setForm({ ...form, is_public: e.target.checked })} className='w-4 h-4' />
          <label htmlFor='is_public' className='text-sm'>公开</label>
        </div>
        <div className='flex gap-3 pt-4'>
          <button type='submit' disabled={saving} className='px-6 py-2 bg-black text-white rounded-md disabled:opacity-50'>{saving ? '保存中...' : '保存'}</button>
          <button type='button' onClick={handleDelete} className='px-6 py-2 bg-red-500 text-white rounded-md'>删除</button>
          <Link href='/admin/projects' className='px-6 py-2 border rounded-md'>取消</Link>
        </div>
      </form>
    </div>
  )
}
