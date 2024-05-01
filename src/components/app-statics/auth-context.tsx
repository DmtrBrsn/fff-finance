import React, { useContext, useEffect, useState } from "react"
import { auth } from '../../firebase'
import { onAuthStateChanged, User, } from "firebase/auth"
import { AuthService, UserService } from "../../utils"

type Props = { children?: React.ReactNode }
type CurrentUser = User | null
type AuthContext = {
  service: typeof AuthService
  currentUser?: CurrentUser
  userService?: UserService
}

export const AuthContext = React.createContext<AuthContext>({service: AuthService})

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

  const userService = currentUser==null ? undefined : new UserService(currentUser)
  
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
