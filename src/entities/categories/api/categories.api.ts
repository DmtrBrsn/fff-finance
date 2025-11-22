
import { addDoc, collection, deleteDoc, doc, getDocs, query, setDoc, writeBatch } from 'firebase/firestore'
import { Category, CategoryAdd, CategoryUpd } from '../lib'
import { db } from '../../../app/firebase'
import { Id } from '../../../shared/lib/types/api-types'
import { getColPath, TimestampAdapter } from '../../../shared/lib/utils'

export const getAllCategories = async () => {
  const q = query(collection(db, getColPath('categories')))
  const querySnapshot = await getDocs(q)
  console.log(`read categories: ${querySnapshot.docs.length}`)
  return querySnapshot.docs.map(doc => {
    const rawDoc = doc.data()
    return {
      id: doc.id,
      ...rawDoc,
      created: rawDoc.created ? TimestampAdapter.tsToIsoStr(rawDoc.created) : undefined
    } as Category
  })
}

export const addCategory = async (newDoc: CategoryAdd): Promise<Category> => {
  const collectionRef = collection(db, getColPath('categories'))
  const { created, ...rest } = newDoc
  const docRef = await addDoc(
    collectionRef,
    {
      ...rest,
      order: newDoc.order ?? null,
      created: TimestampAdapter.isoStrToTs(newDoc.created)
    }
  )
  const addedDoc = { id: docRef.id, ...newDoc } as Category
  return addedDoc
}

export const updateCategory = async (updDoc: CategoryUpd) => {
  const docRef = doc(db, getColPath('categories'), updDoc.id)
  if (('order' in updDoc) && updDoc.order === undefined) delete updDoc.order
  await setDoc(docRef, updDoc)
  return updDoc
}

export const batchUpdateCategories = async (updDocs: CategoryUpd[]) => {
  let batch = writeBatch(db)
  for (const updDoc of updDocs) {
    const ref = doc(collection(db, getColPath('categories')), updDoc.id)
    batch.update(
      ref,
      updDoc
    )
  }
  await batch.commit()
  return updDocs
}

export const deleteCategory = async (id: Id) => {
  const docRef = doc(db, getColPath('categories'), id)
  await deleteDoc(docRef)
  return id
}
