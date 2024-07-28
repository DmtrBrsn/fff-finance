import { db } from "../../app/firebase"
import { addDoc, collection, deleteDoc, doc, getDoc, setDoc} from "firebase/firestore"
import { RecurrentOpSettings, RecurrentOpSettingsAdd, RecurrentOpSettingsUpd } from "./recurrent-op-types"
import { getColPath } from "@shared/utils"

export const getRecurrentOpSettings = async (id: RecurrentOpSettings['id']) => {
  const collectionRef = collection(db, getColPath('recurrent-op-settings'))
  const docRef = doc(collectionRef, id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return { id, ...docSnap.data() } as RecurrentOpSettings
  } else {
    console.error("No such document!");
    return null
  }
}

export const addRecurrentOpSettings = async (newDoc: RecurrentOpSettingsAdd): Promise<RecurrentOpSettings> => {
  const collectionRef = collection(db, getColPath('recurrent-op-settings'))
  const docRef = await addDoc(collectionRef, newDoc)
  const addedDoc = { id: docRef.id, ...newDoc }
  return addedDoc
}

export const updateRecurrentOpSettings = async (updDoc: RecurrentOpSettingsUpd) => {
  const docRef = doc(db, getColPath('recurrent-op-settings'), updDoc.id)
  await setDoc(docRef, updDoc)
  return updDoc
}

export const deleteRecurrentOpSettings = async (id: RecurrentOpSettings['id']) => {
  const docRef = doc(db, getColPath('recurrent-op-settings'), id)
  await deleteDoc(docRef)
  return id
}
