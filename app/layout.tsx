import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: "Zane's Personal Website",
  description: '个人网站 - 项目展示与知识库',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='zh-CN'>
      <body className='min-h-screen bg-background font-sans antialiased'>
        <Nav />
        <main className='max-w-4xl mx-auto px-4 py-8'>
          {children}
        </main>
      </body>
    </html>
  )
}
