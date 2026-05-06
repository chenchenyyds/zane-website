'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: '首页' },
    { href: '/projects', label: '项目' },
    { href: '/notes', label: '笔记' },
  ]

  return (
    <nav className='border-b'>
      <div className='max-w-4xl mx-auto px-4 py-3 flex items-center justify-between'>
        <Link href='/' className='font-bold text-xl'>
          Zane's Site
        </Link>
        <div className='flex gap-6'>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition-colors ${
                pathname === item.href
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href='/login'
            className='text-sm text-muted-foreground hover:text-foreground'
          >
            登录
          </Link>
        </div>
      </div>
    </nav>
  )
}
