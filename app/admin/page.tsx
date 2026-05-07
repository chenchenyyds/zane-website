import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Admin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zane-website.vercel.app'

  return (
    <div className='space-y-8'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold'>管理后台</h1>
          <p className='text-muted-foreground mt-1'>
            欢迎回来，{user?.email}
          </p>
        </div>
        <a href='/api/auth/logout' className='px-4 py-2 border rounded-md hover:bg-muted'>
          退出登录
        </a>
      </div>

      <div className='border rounded-lg p-6'>
        <h2 className='text-xl font-semibold mb-3'>🔗 分享链接</h2>
        <div className='grid md:grid-cols-2 gap-4'>
          <div className='bg-muted p-4 rounded-lg'>
            <p className='text-sm font-medium mb-2'>项目展示页</p>
            <code className='text-xs'>{siteUrl}/projects</code>
          </div>
          <div className='bg-muted p-4 rounded-lg'>
            <p className='text-sm font-medium mb-2'>笔记知识库</p>
            <code className='text-xs'>{siteUrl}/notes</code>
          </div>
        </div>
      </div>

      <div className='grid md:grid-cols-2 gap-6'>
        <Link href='/admin/projects' className='border rounded-lg p-6 hover:shadow-md block'>
          <h2 className='text-xl font-semibold mb-3'>项目管理</h2>
          <p className='text-muted-foreground'>管理你的项目展示 →</p>
        </Link>
        <Link href='/admin/notes' className='border rounded-lg p-6 hover:shadow-md block'>
          <h2 className='text-xl font-semibold mb-3'>笔记管理</h2>
          <p className='text-muted-foreground'>管理你的知识库和笔记 →</p>
        </Link>
      </div>
    </div>
  )
}
