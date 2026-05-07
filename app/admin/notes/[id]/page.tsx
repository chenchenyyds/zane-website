'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import MDEditor from '@/components/MDEditor'

export default function EditNote() {
  const router = useRouter()
  const params = useParams()
  const [note, setNote] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.replace('/login')
    })
    fetchNote()
  }, [params.id, router])

  async function fetchNote() {
    const { data } = await supabase.from('notes').select('*').eq('id', params.id).single()
    setNote(data)
    setLoading(false)
  }

  const handleSave = async (data: { title: string; content: string; tags: string[]; is_public: boolean }) => {
    setSaving(true)
    const { error } = await supabase.from('notes').update({
      title: data.title,
      content: data.content,
      tags: data.tags,
      is_public: data.is_public,
    }).eq('id', params.id)
    setSaving(false)

    if (error) {
      alert('保存失败：' + error.message)
    } else {
      router.push('/admin/notes')
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center' style={{ backgroundColor: 'var(--background)' }}>
        <span style={{ color: 'var(--foreground)' }}>加载中...</span>
      </div>
    )
  }

  if (!note) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center gap-4' style={{ backgroundColor: 'var(--background)' }}>
        <h1 style={{ color: 'var(--foreground)' }}>笔记不存在</h1>
        <Link href='/admin/notes' className='text-blue-600 hover:underline'>返回笔记列表</Link>
      </div>
    )
  }

  return (
    <div className='min-h-screen' style={{ backgroundColor: 'var(--background)' }}>
      <div className='sticky top-0 z-10 border-b' style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
        <div className='max-w-7xl mx-auto px-4 py-3 flex items-center gap-4'>
          <Link href='/admin/notes' className='text-sm hover:underline' style={{ color: 'var(--foreground)' }}>
            ← 返回
          </Link>
          <span className='text-sm' style={{ color: '#6b7280' }}>| 编辑笔记</span>
        </div>
      </div>
      <MDEditor 
        onSave={handleSave} 
        saving={saving}
        initialTitle={note.title}
        initialContent={note.content}
        initialTags={note.tags || []}
        initialIsPublic={note.is_public}
      />
    </div>
  )
}
