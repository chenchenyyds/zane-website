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

  const components = {
    h1: (props: any) => <h1 style={styles.h1} {...props} />,
    h2: (props: any) => <h2 style={styles.h2} {...props} />,
    h3: (props: any) => <h3 style={styles.h3} {...props} />,
    h4: (props: any) => <h4 style={styles.h4} {...props} />,
    p: (props: any) => <p style={styles.p} {...props} />,
    a: ({ href, children, ...props }: any) => (
      <a href={href} style={styles.a} target={href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" {...props}>{children}</a>
    ),
    ul: (props: any) => <ul style={styles.ul} {...props} />,
    ol: (props: any) => <ol style={styles.ol} {...props} />,
    li: (props: any) => <li style={styles.li} {...props} />,
    blockquote: (props: any) => <blockquote style={styles.blockquote} {...props} />,
    code: ({ className, children, ...props }: any) => {
      const isInline = !className
      if (isInline) return <code style={styles.inlineCode}>{children}</code>
      return <code style={styles.codeBlock}>{children}</code>
    },
    pre: (props: any) => <pre style={styles.pre} {...props} />,
    img: (props: any) => <img style={styles.img} {...props} />,
    table: (props: any) => (
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table} {...props} />
      </div>
    ),
    th: (props: any) => <th style={styles.th} {...props} />,
    td: (props: any) => <td style={styles.td} {...props} />,
    hr: () => <hr style={styles.hr} />,
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <Link href='/notes' className='text-sm text-muted-foreground hover:text-foreground'>← 返回</Link>
        {user && (
          <Link href={`/admin/notes/${note.id}`} className='px-3 py-1 border rounded text-sm hover:bg-gray-100'>
            编辑
          </Link>
        )}
      </div>
      
      <h1 style={styles.title}>{note.title}</h1>
      <div className='flex gap-2 mb-8 flex-wrap items-center'>
        {note.tags?.map((t: string) => (
          <span key={t} style={styles.tag}>{t}</span>
        ))}
        <span style={styles.date}>
          {new Date(note.created_at).toLocaleDateString('zh-CN')}
        </span>
      </div>
      
      <article style={styles.article}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {note.content}
        </ReactMarkdown>
      </article>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  title: { fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: '#111' },
  tag: { padding: '0.25rem 0.5rem', backgroundColor: '#f3f4f6', borderRadius: '0.25rem', fontSize: '0.875rem' },
  date: { fontSize: '0.875rem', color: '#6b7280', marginLeft: 'auto' },
  article: { color: '#374151', lineHeight: 1.75 },
  h1: { fontSize: '1.875rem', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem', color: '#111' },
  h2: { fontSize: '1.5rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '0.75rem', color: '#1f2937' },
  h3: { fontSize: '1.25rem', fontWeight: 600, marginTop: '1.25rem', marginBottom: '0.5rem', color: '#1f2937' },
  h4: { fontSize: '1.125rem', fontWeight: 600, marginTop: '1rem', marginBottom: '0.5rem', color: '#1f2937' },
  p: { marginBottom: '1rem' },
  a: { color: '#2563eb', textDecoration: 'none' },
  ul: { marginBottom: '1rem', paddingLeft: '1.5rem', listStyleType: 'disc' },
  ol: { marginBottom: '1rem', paddingLeft: '1.5rem', listStyleType: 'decimal' },
  li: { marginBottom: '0.25rem' },
  blockquote: { borderLeft: '4px solid #e5e7eb', paddingLeft: '1rem', margin: '1rem 0', color: '#6b7280', fontStyle: 'italic' },
  inlineCode: { backgroundColor: '#f3f4f6', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', fontSize: '0.875rem', fontFamily: 'monospace' },
  pre: { backgroundColor: '#1f2937', color: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto', margin: '1rem 0' },
  codeBlock: { fontFamily: 'monospace', fontSize: '0.875rem' },
  img: { maxWidth: '100%', height: 'auto', borderRadius: '0.5rem', margin: '1rem 0' },
  table: { width: '100%', borderCollapse: 'collapse', margin: '1rem 0' },
  th: { border: '1px solid #e5e7eb', padding: '0.5rem', textAlign: 'left', backgroundColor: '#f9fafb' },
  td: { border: '1px solid #e5e7eb', padding: '0.5rem' },
  hr: { border: 'none', borderTop: '1px solid #e5e7eb', margin: '2rem 0' },
}
