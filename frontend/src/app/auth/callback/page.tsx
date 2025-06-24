'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession()
      
      if (data.session) {
        router.push('/dashboard') // or wherever you want to redirect
      } else {
        router.push('/auth/signup')
      }
    }

    handleAuthCallback()
  }, [router])

  return <div>Loading...</div>
}