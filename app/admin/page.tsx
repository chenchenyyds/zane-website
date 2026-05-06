import { createClient } from '@/lib/supabase-server'
import { logout } from '@/app/auth/actions'

export default async function Admin() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

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
