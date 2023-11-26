import React, { useContext, useEffect, useState } from "react"
import { auth } from '../firebase'
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, updateEmail as updateFirebaseEmail, updatePassword as updateFirebasePassword, deleteUser as deleteFirebaseUser, User } from "firebase/auth";

type Props = { children?: React.ReactNode }
type CurrentUser = User | null
type Auth = {
  currentUser?: CurrentUser,
  utils: typeof utils
}

const utils = {
  signup: (email:string, password:string) => {
    return createUserWithEmailAndPassword(auth, email, password)
  },
  
  login: (email:string, password:string) => {
    return signInWithEmailAndPassword(auth, email, password)
  },
  
  logout: () => signOut(auth),
  
  resetPassword: (email:string) => {
    return sendPasswordResetEmail(auth, email)
  },
  
  updateEmail: (currentUser:User, newEmail:string) => {
    return updateFirebaseEmail(currentUser, newEmail)
  },
  
  updatePassword: (currentUser:User, newPasword:string) => {
    return updateFirebasePassword(currentUser, newPasword)
  },
  
  deleteUser: (currentUser:User) => {
    return deleteFirebaseUser(currentUser)
  },
  
}



const AuthContext = React.createContext<Auth>({utils})

export function useAuth() {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])
  
  const value = {
    currentUser,
    utils
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
