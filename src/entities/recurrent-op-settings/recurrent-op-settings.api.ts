import { db } from "@app/firebase"
import { addDoc, collection, deleteDoc, doc, getDoc, setDoc} from "firebase/firestore"
import { RecurrentOpSettings, RecurrentOpSettingsAdd, RecurrentOpSettingsUpd } from "./recurrent-op-types"
import { DateUtils, getColPath } from "@shared/utils"

export const getRecurrentOpSettings = async (id: RecurrentOpSettings['id']) => {
  const collectionRef = collection(db, getColPath('recurrent-op-settings'))
  const docRef = doc(collectionRef, id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    const rawDoc = docSnap.data()
    return {
      id, ...rawDoc,
      endsOn: rawDoc.endsOn ? DateUtils.tsToIsoStr(rawDoc.endsOn) : undefined,
    } as RecurrentOpSettings
  } else {
    console.error("No such document!");
    return null
  }
}

export const addRecurrentOpSettings = async (newDoc: RecurrentOpSettingsAdd): Promise<RecurrentOpSettings> => {
  const collectionRef = collection(db, getColPath('recurrent-op-settings'))
  const { endsOn, ...rest } = newDoc
  const docRef = await addDoc(
    collectionRef,
    {...rest, endsOn: endsOn ? DateUtils.isoStrToTs(endsOn) : undefined}
  )
  const addedDoc = { id: docRef.id, ...newDoc }
  return addedDoc
}

export const updateRecurrentOpSettings = async (updDoc: RecurrentOpSettingsUpd) => {
  const docRef = doc(db, getColPath('recurrent-op-settings'), updDoc.id)
  const { endsOn, ...rest } = updDoc
  await setDoc(
    docRef,
    {...rest, endsOn: endsOn ? DateUtils.isoStrToTs(endsOn) : undefined}
  )
  return updDoc
}

export const deleteRecurrentOpSettings = async (id: RecurrentOpSettings['id']) => {
  const docRef = doc(db, getColPath('recurrent-op-settings'), id)
  await deleteDoc(docRef)
  return id
}
