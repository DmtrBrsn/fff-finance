import { db } from "../../firebase"
import { getDocs, collection, addDoc, doc, deleteDoc, setDoc } from 'firebase/firestore'
import { getColPath } from "../db-utils"
import { ApiCb, Operation } from ".."

export const getAllOperations = async () => {
  const collectionRef = collection(db, getColPath('operations'))
  const querySnapshot = await getDocs(collectionRef)
  return querySnapshot.docs.map(doc => {
    return { id: doc.id, ...doc.data() } as Operation
  })
}

export const addOperation = async (
  { newDoc }:
  {
    newDoc: Omit<Operation, "id">
    onSuccess?: ApiCb
    onFail?: ApiCb
  }
): Promise<Operation> => {
  const collectionRef = collection(db, getColPath('operations'))
  const docRef = await addDoc(collectionRef, newDoc)
  const addedDoc = { id: docRef.id, ...newDoc }
  return addedDoc
}

export const updateOperation = async (
  { updDoc }: 
  {
    updDoc: Operation
    onSuccess?: ApiCb
    onFail?: ApiCb
  }
) => {
  const docRef = doc(db, getColPath('operations'), updDoc.id)
  await setDoc(docRef, updDoc)
  return updDoc
}

export const deleteOperation = async (
  { id }:
  {
    id: string
    onSuccess?: ApiCb
    onFail?: ApiCb
  }
) => {
  const docRef = doc(db, getColPath('operations'), id)
  await deleteDoc(docRef)
  return id
}
