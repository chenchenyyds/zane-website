'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import MDEditor from '@/components/MDEditor'

export default function NewNote() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.replace('/login')
    })
  }, [router])

  const handleSave = async (data: { title: string; content: string; tags: string[]; is_public: boolean }) => {
    setSaving(true)
    const { error } = await supabase.from('notes').insert({
      title: data.title,
      content: data.content,
      tags: data.tags,
      is_public: data.is_public,
    })
    setSaving(false)

    if (error) {
      alert('创建失败：' + error.message)
    } else {
      router.push('/notes')
    }
  }

  return (
    <div className='min-h-screen' style={{ backgroundColor: 'var(--background)' }}>
      <div className='sticky top-0 z-10 border-b' style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
        <div className='max-w-7xl mx-auto px-4 py-3 flex items-center gap-4'>
          <Link href='/notes' className='text-sm hover:underline' style={{ color: 'var(--foreground)' }}>
            ← 返回
          </Link>
          <span className='text-sm' style={{ color: '#6b7280' }}>| 新建笔记</span>
        </div>
      </div>
      <MDEditor onSave={handleSave} saving={saving} />
    </div>
  )
}
