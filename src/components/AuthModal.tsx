'use client'
import { useState } from 'react'
import AuthForm from './AuthForm'
import { FiX } from 'react-icons/fi'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: Props) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 md:w-1/4 relative">
        <button className="absolute top-3 right-3" onClick={onClose} >
          <FiX className="text-xl text-slate-400" />
        </button>
        <h2 className="text-xl font-semibold mb-4">
          {mode === 'login' ? 'Login' : 'Sign up'}
        </h2>

        <AuthForm mode={mode} onSuccess={onClose} />

        <button
          className="text-sm text-slate-500 mt-3 flex mx-auto"
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
        >
          {mode === 'login'
            ? 'Create a new account'
            : 'Already have an account?'}
        </button>
      </div>
    </div>
  )
}