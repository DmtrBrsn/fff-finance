import { db } from "../../firebase"
import { getDocs, collection, addDoc, doc, deleteDoc, setDoc, query, orderBy } from 'firebase/firestore'
import { getColPath } from "../db-utils"
import { Id, Operation, OperationAdd, OperationUpd } from ".."

export const getAllOperations = async () => {
  // const collectionRef = collection(db, getColPath('operations'))

  const q = query(collection(db, getColPath('operations')), orderBy('date', 'desc'));
  
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => {
    return { id: doc.id, ...doc.data() } as Operation
  })
}

export const addOperation = async (
  { newDoc }:
  {newDoc: OperationAdd}
): Promise<Operation> => {
  const collectionRef = collection(db, getColPath('operations'))
  const docRef = await addDoc(collectionRef, newDoc)
  const addedDoc = { id: docRef.id, ...newDoc }
  return addedDoc
}

export const updateOperation = async (
  { updDoc }: 
  {updDoc: OperationUpd}
) => {
  const docRef = doc(db, getColPath('operations'), updDoc.id)
  await setDoc(docRef, updDoc)
  return updDoc
}

export const deleteOperation = async (
  { id }:
  {id: Id}
) => {
  const docRef = doc(db, getColPath('operations'), id)
  await deleteDoc(docRef)
  return id
}
