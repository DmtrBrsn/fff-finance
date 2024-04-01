import { db } from "../../firebase"
import { getDocs, collection, addDoc, doc, deleteDoc, setDoc } from 'firebase/firestore'
import { getColPath } from "../db-utils"
import { ApiCb, Category } from ".."

export const getAllCategories = async () => {
  const collectionRef = collection(db, getColPath('categories'))
  const querySnapshot = await getDocs(collectionRef)
  return querySnapshot.docs.map(doc => {
    return { id: doc.id, ...doc.data() } as Category
  })
}

export const addCategory = async (
  { newDoc }:
  {
    newDoc: Omit<Category, "id">
    onSuccess?: ApiCb
    onFail?: ApiCb
  }
): Promise<Category> => {
  const collectionRef = collection(db, getColPath('categories'))
  const docRef = await addDoc(collectionRef, newDoc)
  const addedDoc = { id: docRef.id, ...newDoc }
  return addedDoc
}

export const updateCategory = async (
  { updDoc }: 
  {
    updDoc: Category
    onSuccess?: ApiCb
    onFail?: ApiCb
  }
) => {
  const docRef = doc(db, getColPath('categories'), updDoc.id)
  await setDoc(docRef, updDoc)
  return updDoc
}


export const deleteCategory = async (
  { id }:
  {
    id: string
    onSuccess?: ApiCb
    onFail?: ApiCb
  }
) => {
  const docRef = doc(db, getColPath('categories'), id)
  await deleteDoc(docRef)
  return id
}

