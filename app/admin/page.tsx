import { createClient } from '@/lib/supabase-server'
import { logout } from '@/app/auth/actions'
import { redirect } from 'next/navigation'

export default async function Admin() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-site.vercel.app'

  return (
    <div className='space-y-8'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold'>管理后台</h1>
          <p className='text-muted-foreground mt-1'>
            欢迎回来，{user?.email}
          </p>
        </div>
        <form action={logout}>
          <button
            type='submit'
            className='px-4 py-2 border rounded-md hover:bg-muted transition-colors'
          >
            退出登录
          </button>
        </form>
      </div>

      <div className='border rounded-lg p-6 bg-muted/30'>
        <h2 className='text-xl font-semibold mb-3'>🔗 分享链接</h2>
        <p className='text-muted-foreground mb-4'>
          分享以下链接给访客，他们只能查看你设置为公开的内容
        </p>
        <div className='grid md:grid-cols-2 gap-4'>
          <div className='bg-background p-4 rounded-lg'>
            <p className='text-sm font-medium mb-2'>项目展示页</p>
            <div className='flex items-center gap-2'>
              <code className='flex-1 text-xs bg-muted px-3 py-2 rounded truncate'>
                {siteUrl}/projects
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(`${siteUrl}/projects`)}
                className='px-3 py-2 bg-primary text-primary-foreground rounded text-sm hover:opacity-90'
              >
                复制
              </button>
            </div>
          </div>
          <div className='bg-background p-4 rounded-lg'>
            <p className='text-sm font-medium mb-2'>笔记知识库</p>
            <div className='flex items-center gap-2'>
              <code className='flex-1 text-xs bg-muted px-3 py-2 rounded truncate'>
                {siteUrl}/notes
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(`${siteUrl}/notes`)}
                className='px-3 py-2 bg-primary text-primary-foreground rounded text-sm hover:opacity-90'
              >
                复制
              </button>
            </div>
          </div>
        </div>
        <p className='text-xs text-muted-foreground mt-4'>
          💡 提示：在项目管理或笔记管理中，可以为单个项目/笔记复制分享链接
        </p>
      </div>

      <div className='grid md:grid-cols-2 gap-6'>
        <div className='border rounded-lg p-6 hover:shadow-md transition-shadow'>
          <h2 className='text-xl font-semibold mb-3'>项目管理</h2>
          <p className='text-muted-foreground mb-4'>
            管理你的项目展示
          </p>
          <a
            href='/admin/projects'
            className='text-primary hover:underline font-medium'
          >
            管理项目 →
          </a>
        </div>

        <div className='border rounded-lg p-6 hover:shadow-md transition-shadow'>
          <h2 className='text-xl font-semibold mb-3'>笔记管理</h2>
          <p className='text-muted-foreground mb-4'>
            管理你的知识库和笔记
          </p>
          <a
            href='/admin/notes'
            className='text-primary hover:underline font-medium'
          >
            管理笔记 →
          </a>
        </div>
      </div>
    </div>
  )
}
