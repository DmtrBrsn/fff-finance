import { auth } from "@app/firebase"
import { onAuthStateChanged, User, } from "firebase/auth"
import React, { createContext, useContext, useEffect, useState } from "react"
import { AuthService, UserService } from "./lib"

type Props = { children?: React.ReactNode }
type CurrentUser = User | null
type AuthContextValue = {
  service: typeof AuthService
  currentUser?: CurrentUser
  userService?: UserService
}

export const AuthContext = createContext<AuthContextValue>({ service: AuthService })

export function useAuth() {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | undefined>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      localStorage.setItem('uid', user?.uid ?? '')
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const userService = currentUser == null ? undefined : new UserService(currentUser)

  const value = {
    currentUser,
    service: AuthService,
    userService
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
