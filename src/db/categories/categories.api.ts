import { db } from "../../firebase"
import { getDocs, collection, addDoc, doc, deleteDoc, setDoc, query, orderBy } from 'firebase/firestore'
import { getColPath } from "../db-utils"
import { Category, CategoryAdd, CategoryUpd, Id } from ".."

export const getAllCategories = async () => {
  const q = query(collection(db, getColPath('categories')), orderBy('isIncome'));
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => {
    return { id: doc.id, ...doc.data() } as Category
  })
}

export const addCategory = async (newDoc: CategoryAdd): Promise<Category> => {
  const collectionRef = collection(db, getColPath('categories'))
  const docRef = await addDoc(collectionRef, newDoc)
  const addedDoc = { id: docRef.id, ...newDoc }
  return addedDoc
}

export const updateCategory = async (updDoc: CategoryUpd) => {
  const docRef = doc(db, getColPath('categories'), updDoc.id)
  await setDoc(docRef, updDoc)
  return updDoc
}


export const deleteCategory = async (id: Id) => {
  const docRef = doc(db, getColPath('categories'), id)
  await deleteDoc(docRef)
  return id
}

