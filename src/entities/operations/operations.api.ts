import { db } from "@app/firebase"
import { getDocs, collection, addDoc, doc, deleteDoc, setDoc, query, orderBy, where, CollectionReference, DocumentData, QueryConstraint, limit, writeBatch } from 'firebase/firestore'
import { GetOpsParams } from "./operations-params"
import { Id } from "@/shared/types/api-types"
import { Operation, OperationAdd, OperationUpd } from "./operations-types"
import { DateUtils, getColPath } from "@shared/utils"

const opParamsToQuery = (collectionRef: CollectionReference<DocumentData, DocumentData>, params?: GetOpsParams ) => {
  let queryArr: QueryConstraint[] = []

  if (params?.from !== undefined) queryArr.push(where('date', '>=', DateUtils.isoStrToTs(params.from)))
  if (params?.to!==undefined) queryArr.push(where('date', '<=', DateUtils.isoStrToTs(params.to)))
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
    const rawDoc = doc.data()
    return {
      id: doc.id, ...rawDoc,
      created: DateUtils.tsToIsoStr(rawDoc.created),
      date: DateUtils.tsToIsoStr(rawDoc.date)
    } as Operation
  })
}

export const addOperation = async (newDoc: OperationAdd): Promise<Operation> => {
  const collectionRef = collection(db, getColPath('operations'))
  const { created, date, ...rest } = newDoc
  const docRef = await addDoc(
    collectionRef,
    {
      ...rest,
      created: DateUtils.isoStrToTs(newDoc.created),
      date: DateUtils.isoStrToTs(newDoc.date)
    }
  )
  const addedDoc = { id: docRef.id, ...newDoc }
  return addedDoc
}

export const batchAddOperations = (newDocs: OperationAdd[]) => {
  let batch = writeBatch(db)
  for (const newDoc of newDocs) {
    const ref = doc(collection(db, getColPath('operations')))
    const { created, date, ...rest } = newDoc
    batch.set(ref, {
      ...rest,
      created: DateUtils.isoStrToTs(newDoc.created),
      date: DateUtils.isoStrToTs(newDoc.date)
    })
  }
  return batch.commit()
}

export const updateOperation = async (updDoc: OperationUpd) => {
  const docRef = doc(db, getColPath('operations'), updDoc.id)
  await setDoc(
    docRef,
    updDoc.date ? { ...updDoc, date: DateUtils.isoStrToTs(updDoc.date) } : updDoc
  )
  return updDoc
}

export const batchUpdateOperations = async (updDocs: OperationUpd[]) => {
  let batch = writeBatch(db)
  for (const updDoc of updDocs) {
    const ref = doc(collection(db, getColPath('operations')),  updDoc.id)
    batch.update(
      ref,
      updDoc.date ? { ...updDoc, date: DateUtils.isoStrToTs(updDoc.date) } : updDoc
    )
  }
  await batch.commit()
  return updDocs
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
  await batch.commit()
  return ids
}
