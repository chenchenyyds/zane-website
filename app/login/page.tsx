'use client'

import { login } from '@/app/auth/actions'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login({
  searchParams,
}: {
  searchParams: { message?: string }
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(searchParams.message || '')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)
      
      const result = await login(formData)
      
      // 如果返回了错误信息
      if (result?.error) {
        setError(result.error)
        setLoading(false)
        return
      }
      
      // 登录成功，跳转到 admin
      router.push('/admin')
      router.refresh()
    } catch (err) {
      setError('登录失败，请稍后重试')
      setLoading(false)
    }
  }

  return (
    <div className='max-w-md mx-auto mt-16'>
      <div className='border rounded-lg p-8'>
        <h1 className='text-2xl font-bold mb-6 text-center'>管理员登录</h1>
        
        {error && (
          <div className='bg-red-50 text-red-600 p-4 rounded-lg mb-4 text-sm'>
            ⚠️ {error}
          </div>
        )}
        
        {loading && (
          <div className='bg-blue-50 text-blue-600 p-4 rounded-lg mb-4 text-sm flex items-center gap-2'>
            <span className='animate-spin'>⏳</span>
            正在登录，请稍候...
          </div>
        )}
        
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-2'>
              邮箱
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
              placeholder='your@email.com'
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className='block text-sm font-medium mb-2'>
              密码
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
              placeholder='••••••••'
              required
              disabled={loading}
            />
          </div>
          
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-primary text-primary-foreground py-3 px-4 rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2'
          >
            {loading ? (
              <>
                <span className='animate-spin'>⏳</span>
                登录中...
              </>
            ) : (
              '登录'
            )}
          </button>
        </form>
        
        <p className='text-sm text-muted-foreground mt-6 text-center'>
          只有管理员可以登录后台管理内容
        </p>
      </div>
    </div>
  )
}
