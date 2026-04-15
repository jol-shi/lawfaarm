"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type { User } from "./types"
import { mockUsers } from "./mock-data"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
  switchUser: (userId: string) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const AUTH_STORAGE_KEY = "legalcase_auth_user"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(AUTH_STORAGE_KEY)
      if (stored) {
        const parsedUser = JSON.parse(stored)
        // Verify the user still exists in mock data
        const foundUser = mockUsers.find((u) => u.id === parsedUser.id)
        if (foundUser) {
          setUser(foundUser)
        }
      }
    } catch {
      // Ignore errors
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    // Simulated login - in production, this would verify credentials
    const foundUser = mockUsers.find((u) => u.email === email)
    if (foundUser) {
      setUser(foundUser)
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(foundUser))
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    sessionStorage.removeItem(AUTH_STORAGE_KEY)
  }, [])

  const switchUser = useCallback((userId: string) => {
    const foundUser = mockUsers.find((u) => u.id === userId)
    if (foundUser) {
      setUser(foundUser)
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(foundUser))
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
        switchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
