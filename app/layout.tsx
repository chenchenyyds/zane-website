import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: {
    default: 'Zane - 全栈开发者',
    template: '%s | Zane',
  },
  description: 'Zane的个人网站，记录项目作品和技术笔记。全栈开发者，专注Java/Spring Boot/Angular开发。',
  keywords: ['个人网站', '全栈开发', 'Java', 'Spring Boot', 'Angular', '技术博客'],
  authors: [{ name: 'Zane' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://zane-website.vercel.app',
    siteName: 'Zane',
    title: 'Zane - 全栈开发者',
    description: 'Zane的个人网站，记录项目作品和技术笔记',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zane - 全栈开发者',
    description: 'Zane的个人网站，记录项目作品和技术笔记',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='zh-CN'>
      <body className='min-h-screen bg-white text-gray-900'>
        <Nav />
        <main className='max-w-4xl mx-auto px-4 py-8'>
          {children}
        </main>
        <footer className='border-t mt-16'>
          <div className='max-w-4xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground'>
            © {new Date().getFullYear()} Zane. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  )
}
