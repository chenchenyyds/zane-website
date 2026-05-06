import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function ProjectsAdmin() {
  const supabase = createClient()
  
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>项目管理</h1>
        <Link
          href='/admin/projects/new'
          className='px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity'
        >
          新建项目
        </Link>
      </div>

      {projects && projects.length > 0 ? (
        <div className='border rounded-lg divide-y'>
          {projects.map((project) => (
            <div
              key={project.id}
              className='p-4 flex items-center justify-between hover:bg-muted/50 transition-colors'
            >
              <div>
                <h3 className='font-medium'>{project.name}</h3>
                <p className='text-sm text-muted-foreground mt-1 line-clamp-1'>
                  {project.description || '暂无描述'}
                </p>
                <div className='flex gap-2 mt-2'>
                  {project.tech_stack?.map((tech: string) => (
                    <span
                      key={tech}
                      className='px-2 py-0.5 bg-muted rounded text-xs'
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <span className={`text-xs px-2 py-1 rounded ${
                  project.is_public ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {project.is_public ? '公开' : '私密'}
                </span>
                <Link
                  href={`/admin/projects/${project.id}`}
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
          <p className='text-muted-foreground mb-4'>还没有项目</p>
          <Link
            href='/admin/projects/new'
            className='text-primary hover:underline font-medium'
          >
            创建第一个项目 →
          </Link>
        </div>
      )}
    </div>
  )
}
