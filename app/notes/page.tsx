import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function Notes() {
  const supabase = await createClient()
  
  const { data: notes } = await supabase
    .from('notes')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-3xl font-bold mb-2'>知识库</h1>
        <p className='text-muted-foreground'>
          技术笔记和学习记录
        </p>
      </div>

      {notes && notes.length > 0 ? (
        <div className='space-y-4'>
          {notes.map((note) => (
            <Link
              key={note.id}
              href={`/notes/${note.id}`}
              className='block border rounded-lg p-6 hover:shadow-md transition-shadow'
            >
              <h2 className='text-xl font-semibold mb-2'>{note.title}</h2>
              <p className='text-muted-foreground text-sm mb-4 line-clamp-2'>
                {note.content?.substring(0, 200) || '暂无内容'}...
              </p>
              
              <div className='flex flex-wrap gap-2 mb-4'>
                {note.tags?.map((tag: string) => (
                  <span
                    key={tag}
                    className='px-2 py-1 bg-muted rounded text-xs'
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className='text-xs text-muted-foreground'>
                {new Date(note.created_at).toLocaleDateString('zh-CN')}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className='text-center py-12 border rounded-lg'>
          <p className='text-muted-foreground'>
            还没有公开笔记，敬请期待！
          </p>
        </div>
      )}
    </div>
  )
}
