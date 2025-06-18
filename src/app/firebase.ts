import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { initializeFirestore, memoryLocalCache } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASURMENT_ID
}

const isEmulation = (
  import.meta.env.VITE_FIREBASE_EMULATION &&
  import.meta.env.VITE_FIREBASE_EMULATION === "true" &&
  import.meta.env.VITE_FIREBASE_EMULATION_AUTH_URL &&
  import.meta.env.VITE_FIREBASE_EMULATION_FIRESTORE_HOST &&
  import.meta.env.VITE_FIREBASE_EMULATION_FIRESTORE_PORT
)

const firebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp);
(async () => {
  if (isEmulation) {
    const { connectAuthEmulator } = await import("firebase/auth")
    connectAuthEmulator(auth, import.meta.env.VITE_FIREBASE_EMULATION_AUTH_URL)
  }
})();

export const db = initializeFirestore(
  firebaseApp, {
  localCache: memoryLocalCache(),
});
(async () => {
  if (isEmulation) {
    const { connectFirestoreEmulator } = await import('firebase/firestore')
    connectFirestoreEmulator(
      db,
      import.meta.env.VITE_FIREBASE_EMULATION_FIRESTORE_HOST,
      import.meta.env.VITE_FIREBASE_EMULATION_FIRESTORE_PORT
    )
  }
})();

export default firebaseApp
