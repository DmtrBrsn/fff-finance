import { db } from "@app/firebase"
import { getDocs, collection, addDoc, doc, deleteDoc, query, orderBy, where, CollectionReference, DocumentData, QueryConstraint, limit, writeBatch, Timestamp, updateDoc } from 'firebase/firestore'
import { GetOpsParams } from "./operations-params"
import { Id } from "@/shared/types/api-types"
import { Operation, OperationAdd, OperationUpd } from "./operations.types"
import { DateUtils, getColPath } from "@shared/utils"
import { toast } from "@app/toaster"

const opParamsToQuery = (collectionRef: CollectionReference<DocumentData, DocumentData>, params?: GetOpsParams ) => {
  let queryArr: QueryConstraint[] = []

  if (params?.from !== undefined) queryArr.push(where('date', '>=', DateUtils.isoStrToTs(params.from)))
  if (params?.to!==undefined) queryArr.push(where('date', '<=', DateUtils.isoStrToTs(params.to)))
  if (params?.orderBy !== undefined) queryArr.push(orderBy(params.orderBy, params.orderByDirection ?? undefined))
  if (params?.limit !== undefined) queryArr.push(limit(params.limit))
  
  if (params && queryArr.length>0) return query(collectionRef, ...queryArr)
  else return query(collectionRef)
}

export const getOperations = async (params?: GetOpsParams) => {
  const collectionRef = collection(db, getColPath('operations'))
  const q = opParamsToQuery(collectionRef, params)
  const querySnapshot = await getDocs(q)
  console.log(`read operations: ${querySnapshot.docs.length}`)
  querySnapshot.metadata.fromCache && console.log('fromCache')
  const ops: Operation[] = []
  for (const doc of querySnapshot.docs) {
    const rawDoc = doc.data()
    let created
    let date
    if (!(rawDoc.date instanceof Timestamp)) {
      toast.error(`Invalid date in operation id ${doc.id}. Operation is not shown `)
      console.error(`Invalid date in ${doc.id}`)
      continue
    }
    else date = DateUtils.tsToIsoStr(rawDoc.date)
    if (!(rawDoc.created instanceof Timestamp)) {
      toast.error(`Invalid created in doc ${doc.id}`)
      created = 'Invalid date'
    } else created = DateUtils.tsToIsoStr(rawDoc.created)
    ops.push({ id: doc.id, ...rawDoc, created, date } as Operation)
  }
  return ops
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
  if ('created' in updDoc) delete updDoc.created
  const docRef = doc(db, getColPath('operations'), updDoc.id)
  await updateDoc(
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
