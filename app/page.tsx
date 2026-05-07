'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className='space-y-12'>
      <section className='text-center py-12'>
        <h1 className='text-4xl font-bold mb-4'>欢迎来到我的个人网站</h1>
        <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
          这里记录了我的项目作品和技术笔记
        </p>
      </section>

      <section className='grid md:grid-cols-2 gap-8'>
        <Link href='/projects' className='border rounded-lg p-6 hover:shadow-md transition-shadow'>
          <h2 className='text-xl font-semibold mb-3'>📂 项目展示</h2>
          <p className='text-muted-foreground'>查看我的开源项目和作品</p>
        </Link>
        <Link href='/notes' className='border rounded-lg p-6 hover:shadow-md transition-shadow'>
          <h2 className='text-xl font-semibold mb-3'>📝 知识库</h2>
          <p className='text-muted-foreground'>技术笔记和学习记录</p>
        </Link>
      </section>
    </div>
  )
}
