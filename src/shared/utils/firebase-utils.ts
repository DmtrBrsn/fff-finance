import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, updateEmail, updatePassword, deleteUser, User, GoogleAuthProvider, signInWithPopup, unlink } from "firebase/auth";
import { auth } from "@app/firebase";

export class AuthService {
  static providersIds = {
    google: 'google.com',
    emailAndPassword: 'password'
  }

  static signup = (email:string, password:string) => {
    return createUserWithEmailAndPassword(auth, email, password)
  }
  
  static loginWithEmailAndPassword = (email:string, password:string) => {
    return signInWithEmailAndPassword(auth, email, password)
  }
  
  static logout = () => signOut(auth)
  
  static resetPassword = (email:string) => sendPasswordResetEmail(auth, email)
  
  static loginWithGoogle = () => {
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
  }
}


export class UserService {
  private readonly user

  constructor(user: User) {
    this.user = user
  }

  updateEmail = (newEmail:string) => {
    return updateEmail(this.user, newEmail)
  }

  updatePassword = (newPasword:string) => {
    return updatePassword(this.user, newPasword)
  }
    
  delete = () => {
    return deleteUser(this.user)
  }
  
  unlinkGoogle = () => {
    return unlink(this.user, AuthService.providersIds.google)
  }

  unlinkEmailAndPassword = () => {
    return unlink(this.user, AuthService.providersIds.emailAndPassword)
  }
}
