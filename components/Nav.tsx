import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'

export default async function Nav() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className='border-b'>
      <div className='max-w-4xl mx-auto px-4 py-3 flex items-center justify-between'>
        <Link href='/' className='font-bold text-xl'>
          Zane's Site
        </Link>
        <div className='flex items-center gap-6'>
          <Link href='/' className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
          首页
        </Link>
        <Link href='/projects' className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
          项目
        </Link>
        <Link href='/notes' className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
          笔记
        </Link>
        {user ? (
          <Link href='/admin' className='text-sm text-primary hover:underline font-medium'>
            管理后台
          </Link>
        ) : (
          <Link href='/login' className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
            登录
          </Link>
        )}
      </div>
    </nav>
  )
}
