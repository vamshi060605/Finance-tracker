import { createContext, useContext, useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/router'

interface AuthContextType {
  session: Session | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setLoading(false)
      
      if (event === 'SIGNED_IN') {
        router.push('/dashboard')
      }
      if (event === 'SIGNED_OUT') {
        router.push('/')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
