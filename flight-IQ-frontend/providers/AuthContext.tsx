"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react"
import { useQueryClient } from "@tanstack/react-query"
import { apiClient, setAuthToken, getAuthToken } from "@/lib/axios"
import { useToast } from "@/hooks/use-toast"

export interface User {
  user_id: string
  email: string
  first_name?: string | null
  last_name?: string | null
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  loginWithGoogle: (googleToken: string) => Promise<User>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const queryClient = useQueryClient()
  const { showSuccess, showApiError } = useToast()

  // Load user profile on mount if token exists
  useEffect(() => {
    async function loadUser() {
      const token = getAuthToken()
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const response = await apiClient.get<{ user: User }>("/user/info")
        setUser(response.data.user)
      } catch (err) {
        // Token is invalid or expired
        setAuthToken(null)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const loginWithGoogle = useCallback(
    async (googleToken: string) => {
      setIsLoading(true)
      try {
        let response
        try {
          // Attempt sign in first
          response = await apiClient.post<{
            token: { access_token: string }
            user: User
          }>("/auth/google/signin", { google_token: googleToken })
          showSuccess("Welcome back!", `Signed in as ${response.data.user.email}`)
        } catch (signInErr: any) {
          // If the account does not exist, automatically sign them up
          const errorMessage =
            signInErr?.response?.data?.message || signInErr?.message || ""
          if (errorMessage.includes("does not exist")) {
            response = await apiClient.post<{
              token: { access_token: string }
              user: User
            }>("/auth/google/signup", { google_token: googleToken })
            showSuccess(
              "Account created successfully!",
              `Signed up as ${response.data.user.email}`
            )
          } else {
            throw signInErr
          }
        }

        const { token, user: userProfile } = response.data
        setAuthToken(token.access_token)
        setUser(userProfile)

        // Reset React Query cache to fetch user-contextual data
        queryClient.invalidateQueries()

        return userProfile
      } catch (err: any) {
        showApiError(err, "Failed to authenticate with Google")
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [queryClient, showSuccess, showApiError]
  )

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await apiClient.post("/user/logout").catch(() => {
        // Ignore failure to let client-side logout succeed anyway
      })
    } finally {
      setAuthToken(null)
      setUser(null)
      queryClient.clear() // Clear all query caches on logout
      setIsLoading(false)
      showSuccess("Signed out successfully")
    }
  }, [queryClient, showSuccess])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
