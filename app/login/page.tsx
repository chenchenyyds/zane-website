'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace('/admin')
    })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) { setError(err.message); setLoading(false) }
    else if (data.user) router.replace('/admin')
  }

  return (
    <div className='max-w-sm mx-auto mt-20'>
      <div className='border rounded-lg p-8'>
        <h1 className='text-2xl font-bold mb-6 text-center'>管理员登录</h1>
        {error && <div className='bg-red-50 text-red-600 p-3 rounded mb-4 text-sm'>{error}</div>}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div><label className='block text-sm mb-1'>邮箱</label><input type='email' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full px-3 py-2 border rounded-md' placeholder='your@email.com' required /></div>
          <div><label className='block text-sm mb-1'>密码</label><input type='password' value={password} onChange={(e) => setPassword(e.target.value)} className='w-full px-3 py-2 border rounded-md' placeholder='••••••••' required /></div>
          <button type='submit' disabled={loading} className='w-full bg-black text-white py-2.5 rounded-md font-medium disabled:opacity-50'>{loading ? '登录中...' : '登录'}</button>
        </form>
      </div>
    </div>
  )
}
