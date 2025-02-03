import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../integrations/supabase/client"
import type { User } from "@supabase/supabase-js"

const AuthContext = createContext<{
  user: User | null
  signOut: () => Promise<void>
} | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, signOut: () => supabase.auth.signOut() }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

