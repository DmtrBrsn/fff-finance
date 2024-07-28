import { db } from "../../app/firebase"
import { getDocs, collection, addDoc, doc, deleteDoc, setDoc, query, orderBy, where, CollectionReference, DocumentData, QueryConstraint, limit, writeBatch } from 'firebase/firestore'
import { GetOpsParams } from "./operations-params"
import { Id } from "../api-types"
import { Operation, OperationAdd, OperationUpd } from "./operations-types"
import { getColPath } from "@shared/utils"

const opParamsToQuery = (collectionRef: CollectionReference<DocumentData, DocumentData>, params?: GetOpsParams ) => {
  let queryArr: QueryConstraint[] = []

  if (params?.from !== undefined) queryArr.push(where('date', '>=', params.from))
  if (params?.to!==undefined) queryArr.push(where('date', '<=', params.to))
  if (params?.orderBy !== undefined) queryArr.push(orderBy(params.orderBy, params.orderByDirection ?? undefined))
  if (params?.limit !== undefined) queryArr.push(limit(params.limit))
  if (params?.isPlan !== undefined) queryArr.push(where('isPlan', '==', params.isPlan))
  if (params?.idRecurrent !== undefined) queryArr.push(where('idRecurrent', '==', params.idRecurrent))
  
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

export const addOperation = async (newDoc: OperationAdd): Promise<Operation> => {
  const collectionRef = collection(db, getColPath('operations'))
  const docRef = await addDoc(collectionRef, newDoc)
  const addedDoc = { id: docRef.id, ...newDoc }
  return addedDoc
}

export const batchAddOperations = (newDocs: OperationAdd[]) => {
  let batch = writeBatch(db)
  for (const newDoc of newDocs) {
    const ref = doc(collection(db, getColPath('operations')))
    batch.set(ref, newDoc)
  }
  return batch.commit()
}

export const updateOperation = async (updDoc: OperationUpd) => {
  const docRef = doc(db, getColPath('operations'), updDoc.id)
  await setDoc(docRef, updDoc)
  return updDoc
}

export const batchUpdateOperations = (updDocs: OperationUpd[]) => {
  let batch = writeBatch(db)
  for (const updDoc of updDocs) {
    const ref = doc(collection(db, getColPath('operations')),  updDoc.id)
    batch.update(ref, updDoc)
  }
  return batch.commit()
}

export const deleteOperation = async (id: Id) => {
  const docRef = doc(db, getColPath('operations'), id)
  await deleteDoc(docRef)
  return id
}

export const batchDeleteOperations = async (ids: Id[]) => { 
  let batch = writeBatch(db)
  for (const id of ids) {
    const ref = doc(collection(db, getColPath('operations')), id)
    batch.delete(ref)
  }
  return batch.commit()
}
