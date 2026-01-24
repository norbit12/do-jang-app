'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Button from './ui/Button'

type Props = {
  mode: 'login' | 'signup'
  onSuccess?: () => void
}

export default function AuthForm({ mode, onSuccess }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) setMessage(error.message)
      else setMessage('確認メールを送信しました')
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        setMessage(error.message)
      } else {
        onSuccess?.()
      }
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        className="mb-2 w-full border rounded-md px-4 py-2 border-slate-200 placeholder:text-slate-400 outline-none focus:border-slate-400 focus:ring-4 ring-slate-200 duration-200"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="mb-4 w-full border rounded-md px-4 py-2 border-slate-200 placeholder:text-slate-400 outline-none focus:border-slate-400 focus:ring-4 ring-slate-200 duration-200"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {message && (
        <p className="mb-4 text-sm text-center text-red-500">{message}</p>
      )}

      <Button type="submit" disabled={loading} className='w-full'>
        {loading
          ? 'Processing…'
          : mode === 'login'
          ? 'Login'
          : 'Sign up'}
      </Button>
    </form>
  )
}
