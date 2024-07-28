import { initializeApp } from "firebase/app"
// import { getAnalytics } from "firebase/analytics"
// import { connectAuthEmulator} from "firebase/auth"
// import { connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth } from "firebase/auth"
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASURMENT_ID
}


const firebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)
// connectAuthEmulator(auth, "http://127.0.0.1:9099")

// const analytics = getAnalytics(app)
export const db = getFirestore(firebaseApp)
// connectFirestoreEmulator(db, '127.0.0.1', 8080);

export default firebaseApp
