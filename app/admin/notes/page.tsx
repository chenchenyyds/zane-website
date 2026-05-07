import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function NotesAdmin() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }
  
  const { data: notes } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>笔记管理</h1>
        <Link
          href='/admin/notes/new'
          className='px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity'
        >
          新建笔记
        </Link>
      </div>

      {notes && notes.length > 0 ? (
        <div className='border rounded-lg divide-y'>
          {notes.map((note) => (
            <div
              key={note.id}
              className='p-4 flex items-center justify-between hover:bg-muted/50 transition-colors'
            >
              <div className='flex-1'>
                <h3 className='font-medium'>{note.title}</h3>
                <p className='text-sm text-muted-foreground mt-1 line-clamp-1'>
                  {note.content?.substring(0, 100) || '暂无内容'}
                </p>
                <div className='flex gap-2 mt-2'>
                  {note.tags?.map((tag: string) => (
                    <span
                      key={tag}
                      className='px-2 py-0.5 bg-muted rounded text-xs'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className='flex items-center gap-4 ml-4'>
                <span className={`text-xs px-2 py-1 rounded ${
                  note.is_public ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {note.is_public ? '公开' : '私密'}
                </span>
                <Link
                  href={`/admin/notes/${note.id}`}
                  className='text-sm text-primary hover:underline'
                >
                  编辑
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-12 border rounded-lg'>
          <p className='text-muted-foreground mb-4'>还没有笔记</p>
          <Link
            href='/admin/notes/new'
            className='text-primary hover:underline font-medium'
          >
            创建第一篇笔记 →
          </Link>
        </div>
      )}
    </div>
  )
}
