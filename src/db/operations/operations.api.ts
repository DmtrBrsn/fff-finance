import { db } from "../../firebase"
import { getDocs, collection, addDoc, doc, deleteDoc, setDoc, query, orderBy, where, CollectionReference, DocumentData, QueryConstraint, limit } from 'firebase/firestore'
import { getColPath } from "../db-utils"
import { Id, Operation, OperationAdd, OperationUpd } from ".."
import { GetOpsParams } from "./operations-params"

const opParamsToQuery = (collectionRef: CollectionReference<DocumentData, DocumentData>, params?: GetOpsParams ) => {
  let queryArr: QueryConstraint[] = []

  if (params?.from !== undefined) queryArr.push(where('date', '>=', params.from))
  if (params?.to!==undefined) queryArr.push(where('date', '<=', params.to))
  if (params?.orderBy !== undefined) queryArr.push(orderBy(params.orderBy, params.orderByDirection ?? undefined))
  if (params?.limit !== undefined) queryArr.push(limit(params.limit))
  if (params?.isPlan !== undefined) queryArr.push(where('isPlan', '==', params.isPlan))
  
  if (params && queryArr.length>0) return query(collectionRef, ...queryArr)
  else return query(collectionRef)
}

export const getOperations = async (params?: GetOpsParams) => {
  const collectionRef = collection(db, getColPath('operations'))
  const q = opParamsToQuery(collectionRef, params)
  const querySnapshot = await getDocs(q)
  console.log(`read operations: ${querySnapshot.docs.length}`)
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
