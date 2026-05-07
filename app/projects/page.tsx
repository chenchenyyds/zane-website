import { createClient } from '@/lib/supabase-server'

export default async function Projects() {
  const supabase = createClient()
  
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-3xl font-bold mb-2'>项目展示</h1>
        <p className='text-muted-foreground'>
          我的开源项目和作品
        </p>
      </div>

      {projects && projects.length > 0 ? (
        <div className='grid md:grid-cols-2 gap-6'>
          {projects.map((project) => (
            <div
              key={project.id}
              className='border rounded-lg p-6 hover:shadow-md transition-shadow'
            >
              <h2 className='text-xl font-semibold mb-2'>{project.name}</h2>
              <p className='text-muted-foreground text-sm mb-4 line-clamp-2'>
                {project.description || '暂无描述'}
              </p>
              
              <div className='flex flex-wrap gap-2 mb-4'>
                {project.tech_stack?.map((tech: string) => (
                  <span
                    key={tech}
                    className='px-2 py-1 bg-muted rounded text-xs'
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className='flex gap-4 text-sm'>
                {project.git_url && (
                  <a
                    href={project.git_url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary hover:underline'
                  >
                    GitHub →
                  </a>
                )}
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary hover:underline'
                  >
                    在线演示 →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-12 border rounded-lg'>
          <p className='text-muted-foreground'>
            还没有公开项目，敬请期待！
          </p>
        </div>
      )}
    </div>
  )
}
