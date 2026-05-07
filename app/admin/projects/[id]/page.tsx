'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Project {
  id: string
  name: string
  description: string
  git_url: string
  live_url: string
  tech_stack: string[]
  is_public: boolean
}

export default function EditProject({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [gitUrl, setGitUrl] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [techStack, setTechStack] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchProject()
  }, [params.id])

  const fetchProject = async () => {
    const res = await fetch(`/api/projects/${params.id}`)
    if (res.ok) {
      const data = await res.json()
      setProject(data)
      setName(data.name || '')
      setDescription(data.description || '')
      setGitUrl(data.git_url || '')
      setLiveUrl(data.live_url || '')
      setTechStack((data.tech_stack || []).join(', '))
      setIsPublic(data.is_public || false)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    const res = await fetch(`/api/projects/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        git_url: gitUrl,
        live_url: liveUrl,
        tech_stack: techStack.split(',').map(s => s.trim()).filter(Boolean),
        is_public: isPublic,
      }),
    })
    
    if (res.ok) {
      router.push('/admin/projects')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm('确定要删除这个项目吗？')) return
    setDeleting(true)
    
    const res = await fetch(`/api/projects/${params.id}`, {
      method: 'DELETE',
    })
    
    if (res.ok) {
      router.push('/admin/projects')
    }
    setDeleting(false)
  }

  const copyShareLink = () => {
    const siteUrl = window.location.origin
    navigator.clipboard.writeText(`${siteUrl}/projects`)
    alert('分享链接已复制！')
  }

  if (loading) {
    return <div className='text-center py-12'>加载中...</div>
  }

  if (!project) {
    return <div className='text-center py-12'>项目不存在</div>
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>编辑项目</h1>
        <div className='flex gap-2'>
          {project.is_public && (
            <button
              onClick={copyShareLink}
              className='px-4 py-2 border rounded-md hover:bg-muted transition-colors'
            >
              复制分享链接
            </button>
          )}
          <Link
            href='/admin/projects'
            className='px-4 py-2 border rounded-md hover:bg-muted transition-colors'
          >
            返回
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='border rounded-lg p-6 space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-2'>项目名称 *</label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className='w-full px-3 py-2 border rounded-md'
              placeholder='输入项目名称'
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>项目描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className='w-full px-3 py-2 border rounded-md'
              placeholder='简单描述一下这个项目'
            />
          </div>

          <div className='grid md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>GitHub 地址</label>
              <input
                type='url'
                value={gitUrl}
                onChange={(e) => setGitUrl(e.target.value)}
                className='w-full px-3 py-2 border rounded-md'
                placeholder='https://github.com/username/repo'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>在线地址</label>
              <input
                type='url'
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                className='w-full px-3 py-2 border rounded-md'
                placeholder='https://your-project.vercel.app'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>技术栈</label>
            <input
              type='text'
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className='w-full px-3 py-2 border rounded-md'
              placeholder='React, TypeScript, Node.js（用逗号分隔）'
            />
            <p className='text-xs text-muted-foreground mt-1'>
              多个技术栈用逗号分隔
            </p>
          </div>

          <div className='flex items-center gap-3'>
            <input
              type='checkbox'
              id='is_public'
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className='w-4 h-4'
            />
            <label htmlFor='is_public' className='text-sm font-medium'>
              公开分享（取消勾选则仅自己可见）
            </label>
          </div>
        </div>

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
            disabled={deleting}
            className='px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50'
          >
            {deleting ? '删除中...' : '删除项目'}
          </button>
        </div>
      </form>
    </div>
  )
}
