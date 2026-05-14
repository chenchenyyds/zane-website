'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

// 卡片渐变背景
const cardGradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  'linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
]

export default function Notes() {
  const [notes, setNotes] = useState<any[]>([])
  const [filteredNotes, setFilteredNotes] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      fetchNotes()
    })
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      setFilteredNotes(notes.filter(n => 
        n.title.toLowerCase().includes(query) || 
        n.tags?.some((t: string) => t.toLowerCase().includes(query))
      ))
    } else {
      setFilteredNotes(notes)
    }
  }, [searchQuery, notes])

  async function fetchNotes() {
    const { data } = await supabase.from('notes').select('*').eq('is_public', true).order('created_at', { ascending: false })
    setNotes(data || [])
    setFilteredNotes(data || [])
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('确定删除？')) return
    await supabase.from('notes').delete().eq('id', id)
    fetchNotes()
  }

  // 截取内容前100字
  const truncateContent = (content: string, maxLength: number = 100) => {
    if (!content) return '暂无内容'
    const plainText = content.replace(/[#*`\[\]()]/g, '').replace(/\n/g, ' ').trim()
    if (plainText.length <= maxLength) return plainText
    return plainText.substring(0, maxLength) + '...'
  }

  if (loading) return <div className='text-center py-20' style={{ color: 'var(--foreground)' }}>加载中...</div>

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold' style={{ color: 'var(--foreground)' }}>知识库</h1>
          <p className='mt-1' style={{ color: 'var(--muted-foreground)' }}>共 {filteredNotes.length} 篇笔记</p>
        </div>
        {user && <Link href='/notes/new' className='px-4 py-2 rounded-md text-white' style={{ backgroundColor: '#3b82f6' }}>+ 新建</Link>}
      </div>

      {/* 搜索框 */}
      <div className='flex items-center gap-3 px-4 py-2.5 border rounded-lg' style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
        <svg className='w-5 h-5 flex-shrink-0' style={{ color: 'var(--foreground)' }} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
        </svg>
        <input
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='搜索标题或标签...'
          className='flex-1 border-0 p-0 focus:ring-0 bg-transparent text-sm'
          style={{ color: 'var(--foreground)' }}
        />
      </div>

      {filteredNotes.length > 0 ? (
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-5'>
          {filteredNotes.map((n, index) => (
            <Link 
              key={n.id} 
              href={`/notes/${n.id}`}
              className='rounded-xl p-5 transition-all duration-300 hover:scale-105 hover:shadow-xl group block'
              style={{ 
                background: cardGradients[index % cardGradients.length],
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className='flex justify-between items-start mb-2'>
                <h3 className='font-bold text-lg text-white group-hover:text-opacity-90 line-clamp-1'>{n.title}</h3>
              </div>
              <p className='text-sm mb-4 text-white/90 line-clamp-3'>{truncateContent(n.content)}</p>
              <div className='flex flex-wrap gap-2 mb-3'>
                {n.tags?.slice(0, 3).map((t: string) => (
                  <span key={t} className='px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded text-xs text-white'>{t}</span>
                ))}
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-xs text-white/80'>
                  {new Date(n.created_at).toLocaleDateString('zh-CN')}
                </span>
                {user && (
                  <div className='flex gap-3 text-xs'>
                    <Link href={`/notes/${n.id}`} className='text-white/80 hover:text-white hover:underline' onClick={e => e.stopPropagation()}>编辑</Link>
                    <button onClick={(e) => { e.preventDefault(); handleDelete(n.id); }} className='text-white/80 hover:text-white hover:underline'>删除</button>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className='text-center py-16 border rounded-lg' style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
          {searchQuery ? '没有找到匹配的笔记' : '暂无公开笔记'}
        </div>
      )}
    </div>
  )
}
