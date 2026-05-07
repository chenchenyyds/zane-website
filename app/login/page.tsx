'use client'

import { supabase } from '@/lib/supabase'
import { useState } from 'react'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
    } else if (data.user) {
      // 登录成功，跳转到 admin
      window.location.href = '/admin'
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
            />
          </div>
          
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-black text-white py-3 rounded-md font-medium'
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
      </div>
    </div>
  )
}
