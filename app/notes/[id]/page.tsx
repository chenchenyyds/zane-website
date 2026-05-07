'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function NoteDetail() {
  const params = useParams()
  const [note, setNote] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
    fetchNote()
  }, [params.id])

  async function fetchNote() {
    const { data } = await supabase
      .from('notes')
      .select('*')
      .eq('id', params.id)
      .eq('is_public', true)
      .single()
    setNote(data)
    setLoading(false)
  }

  if (loading) return <div className='text-center py-20'>加载中...</div>

  if (!note) {
    return (
      <div className='text-center py-20'>
        <h1 className='text-2xl font-bold mb-4'>笔记不存在</h1>
        <Link href='/notes' className='text-blue-600 hover:underline'>返回笔记列表</Link>
      </div>
    )
  }

  const CodeBlock = ({ children, className, ...props }: any) => {
    const [copied, setCopied] = useState(false)
    const code = String(children).replace(/\n$/, '')
    
    const handleCopy = async () => {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }

    if (!className) {
      return <code className={className} {...props}>{children}</code>
    }

    return (
      <div className='relative group'>
        <pre className='bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm'>
          <code className={className} {...props}>{children}</code>
        </pre>
        <button
          onClick={handleCopy}
          className='absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity'
        >
          {copied ? '已复制!' : '复制'}
        </button>
      </div>
    )
  }

  const components = {
    h1: (props: any) => <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }} {...props} />,
    h2: (props: any) => <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }} {...props} />,
    h3: (props: any) => <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }} {...props} />,
    h4: (props: any) => <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }} {...props} />,
    p: (props: any) => <p style={{ marginBottom: '0.75rem', lineHeight: 1.7, color: 'var(--text-secondary)' }} {...props} />,
    a: ({ href, children, ...props }: any) => (
      <a href={href} style={{ color: '#2563eb' }} target={href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" {...props}>{children}</a>
    ),
    ul: (props: any) => <ul style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', listStyle: 'disc', color: 'var(--text-secondary)' }} {...props} />,
    ol: (props: any) => <ol style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', listStyle: 'decimal', color: 'var(--text-secondary)' }} {...props} />,
    li: (props: any) => <li style={{ marginBottom: '0.25rem' }} {...props} />,
    blockquote: (props: any) => <blockquote style={{ borderLeft: '3px solid #d1d5db', paddingLeft: '1rem', margin: '1rem 0', color: '#6b7280', fontStyle: 'italic' }} {...props} />,
    code: ({ className, children, ...props }: any) => {
      if (!className) return <code style={{ backgroundColor: 'var(--code-bg)', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', fontSize: '0.875rem', fontFamily: 'monospace' }}>{children}</code>
      return <code className={className} {...props}>{children}</code>
    },
    pre: (props: any) => <CodeBlock {...props} />,
    img: (props: any) => <img style={{ maxWidth: '100%', height: 'auto', borderRadius: '0.5rem', margin: '1rem 0' }} {...props} />,
    table: (props: any) => (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0' }} {...props} />
      </div>
    ),
    th: (props: any) => <th style={{ border: '1px solid var(--border)', padding: '0.5rem', textAlign: 'left', backgroundColor: 'var(--th-bg)' }} {...props} />,
    td: (props: any) => <td style={{ border: '1px solid var(--border)', padding: '0.5rem' }} {...props} />,
    hr: () => <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '2rem 0' }} />,
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <Link href='/notes' className='text-sm text-muted-foreground hover:text-foreground'>← 返回</Link>
        {user && (
          <Link href={`/admin/notes/${note.id}`} className='px-3 py-1 border rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-800'>
            编辑
          </Link>
        )}
      </div>
      
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>{note.title}</h1>
      <div className='flex gap-2 mb-8 flex-wrap items-center'>
        {note.tags?.map((t: string) => (
          <span key={t} style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--tag-bg)', borderRadius: '0.25rem', fontSize: '0.875rem' }}>{t}</span>
        ))}
        <span style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: 'auto' }}>
          {new Date(note.created_at).toLocaleDateString('zh-CN')}
        </span>
      </div>
      
      <article style={{ lineHeight: 1.75 }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {note.content}
        </ReactMarkdown>
      </article>
    </div>
  )
}
