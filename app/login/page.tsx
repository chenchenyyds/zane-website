'use client'

import { login } from '@/app/auth/actions'
import { useState } from 'react'

export default function Login({
  searchParams,
}: {
  searchParams: { message?: string }
}) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    await login(formData)
    setLoading(false)
  }

  return (
    <div className='max-w-md mx-auto mt-16'>
      <div className='border rounded-lg p-8'>
        <h1 className='text-2xl font-bold mb-6 text-center'>管理员登录</h1>
        
        {searchParams.message && (
          <div className='bg-red-50 text-red-600 p-3 rounded mb-4 text-sm'>
            {searchParams.message}
          </div>
        )}
        
        <form action={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-2'>
              邮箱
            </label>
            <input
              type='email'
              name='email'
              className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
              placeholder='your@email.com'
              required
            />
          </div>
          
          <div>
            <label className='block text-sm font-medium mb-2'>
              密码
            </label>
            <input
              type='password'
              name='password'
              className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
              placeholder='••••••••'
              required
            />
          </div>
          
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-primary text-primary-foreground py-2 px-4 rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50'
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
        
        <p className='text-sm text-muted-foreground mt-6 text-center'>
          只有管理员可以登录后台管理内容
        </p>
      </div>
    </div>
  )
}
