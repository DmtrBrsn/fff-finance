import { getDocs, collection, addDoc, doc, deleteDoc, setDoc, query, orderBy } from 'firebase/firestore'
import { Id } from "@shared/types/api-types"
import { Category, CategoryAdd, CategoryUpd } from "./categories-types";
import { db } from '@app/firebase';
import { DateUtils, getColPath } from '@shared/utils';

export const getAllCategories = async () => {
  const q = query(collection(db, getColPath('categories')), orderBy('isIncome'));
  const querySnapshot = await getDocs(q)
  console.log(`read categories: ${querySnapshot.docs.length}`)
  return querySnapshot.docs.map(doc => {
    const rawDoc = doc.data()
    return {
      id: doc.id,
      ...rawDoc,
      created: rawDoc.created ? DateUtils.tsToIsoStr(rawDoc.created) : undefined
    } as Category
  })
}

export const addCategory = async (newDoc: CategoryAdd): Promise<Category> => {
  const collectionRef = collection(db, getColPath('categories'))
  const { created, ...rest } = newDoc
  const docRef = await addDoc(
    collectionRef,
    { ...rest, created: DateUtils.isoStrToTs(newDoc.created) }
  )
  const addedDoc = { id: docRef.id, ...newDoc} as Category
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

