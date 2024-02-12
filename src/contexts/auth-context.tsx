import React, { useContext, useEffect, useState } from "react"
import { auth } from '../firebase'
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, updateEmail as updateFirebaseEmail, updatePassword as updateFirebasePassword, deleteUser as deleteFirebaseUser, User, GoogleAuthProvider, signInWithPopup, unlink } from "firebase/auth";

type Props = { children?: React.ReactNode }
type CurrentUser = User | null
type Auth = {
  currentUser?: CurrentUser
  setCurrentUser?: (value: React.SetStateAction<CurrentUser>) => void
  utils: typeof utils
  providersIds: typeof providersIds
}

const providersIds = {
  google: 'google.com',
  emailAndPassword: 'password'
}

const utils = {
  signup: (email:string, password:string) => {
    return createUserWithEmailAndPassword(auth, email, password)
  },
  
  loginWithEmailAndPassword: (email:string, password:string) => {
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
  loginWithGoogle: () => {
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
  },
  unlinkGoogle: (currentUser: User) => {
    return unlink(currentUser, providersIds.google)
  },
  unlinkEmailAndPassword: (currentUser: User) => {
    return unlink(currentUser, providersIds.emailAndPassword)
  },
  
}


export const AuthContext = React.createContext<Auth>({utils, providersIds})

export function useAuth() {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      localStorage.setItem('uid', user?.uid ?? '')
      setLoading(false)
    })
    return unsubscribe
  }, [])
  
  const value = {
    currentUser,
    setCurrentUser,
    utils,
    providersIds
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
