"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { loginSuccess, logout } from "@/store/actions"

interface AuthContextType {
   isAuthenticated: boolean
   user: any
   login: (token: string, userData: any) => void
   logout: () => void
   loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
   const context = useContext(AuthContext)
   if (context === undefined) {
      throw new Error("useAuth must be used within an AuthProvider")
   }
   return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   const dispatch = useDispatch()
   const [loading, setLoading] = useState(true)
   const registration = useSelector((state: RootState) => state.registration)
   const isAuthenticated = registration?.isAuthenticated || false
   const user = registration?.user || null

   useEffect(() => {
      // Check for existing token on app load
      const token = localStorage.getItem("token") || sessionStorage.getItem("token")

      if (token) {
         // Verify token with backend
         verifyToken(token)
      } else {
         setLoading(false)
      }
   }, [])

   const verifyToken = async (token: string) => {
      try {
         const response = await fetch("/api/auth?action=profile", {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         })

         if (response.ok) {
            const userData = await response.json()
            dispatch(loginSuccess(userData))
         } else {
            // Token is invalid, clear it
            localStorage.removeItem("token")
            sessionStorage.removeItem("token")
            dispatch(logout())
         }
      } catch (error) {
         console.error("Error verifying token:", error)
         localStorage.removeItem("token")
         sessionStorage.removeItem("token")
         dispatch(logout())
      } finally {
         setLoading(false)
      }
   }

   const login = (token: string, userData: any) => {
      localStorage.setItem("token", token)
      dispatch(loginSuccess(userData))
   }

   const handleLogout = () => {
      localStorage.removeItem("token")
      sessionStorage.removeItem("token")
      dispatch(logout())
   }

   const value: AuthContextType = {
      isAuthenticated,
      user,
      login,
      logout: handleLogout,
      loading,
   }

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
