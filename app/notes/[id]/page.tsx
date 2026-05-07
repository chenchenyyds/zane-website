import { createClient } from '@/lib/supabase-server'
import ReactMarkdown from 'react-markdown'

export default async function NoteDetail({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  const { data: note } = await supabase
    .from('notes')
    .select('*')
    .eq('id', params.id)
    .eq('is_public', true)
    .single()

  if (!note) {
    return (
      <div className='max-w-3xl mx-auto py-16 text-center'>
        <h1 className='text-2xl font-bold mb-4'>笔记不存在</h1>
        <p className='text-muted-foreground'>
          这篇笔记可能是私密的或者已被删除
        </p>
      </div>
    )
  }

  return (
    <div className='max-w-3xl mx-auto py-8'>
      <h1 className='text-3xl font-bold mb-4'>{note.title}</h1>
      
      <div className='flex flex-wrap gap-2 mb-8'>
        {note.tags?.map((tag: string) => (
          <span
            key={tag}
            className='px-3 py-1 bg-muted rounded text-sm'
          >
            {tag}
          </span>
        ))}
        <span className='text-sm text-muted-foreground ml-auto'>
          {new Date(note.created_at).toLocaleDateString('zh-CN')}
        </span>
      </div>

      <div className='prose prose-lg max-w-none'>
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </div>
    </div>
  )
}
