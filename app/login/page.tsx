'use client'

import { login } from '@/app/auth/actions'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)
    
    const result = await login(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      // 登录成功，跳转
      router.push('/admin')
    }
  }

  return (
    <div className='max-w-md mx-auto mt-16'>
      <div className='border rounded-lg p-8'>
        <h1 className='text-2xl font-bold mb-6 text-center'>管理员登录</h1>
        
        {error && (
          <div className='bg-red-50 text-red-600 p-4 rounded-lg mb-4'>
            ⚠️ {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-2'>邮箱</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-3 py-2 border rounded-md'
              placeholder='your@email.com'
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className='block text-sm font-medium mb-2'>密码</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-3 py-2 border rounded-md'
              placeholder='••••••••'
              required
              disabled={loading}
            />
          </div>
          
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-black text-white py-3 rounded-md font-medium disabled:opacity-50'
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
      </div>
    </div>
  )
}
