import { db } from "@app/firebase"
import { Category } from "@features/categories/lib"
import { toast } from "@features/toaster"
import { Id } from "@shared/lib/types/api-types"
import { TimestampAdapter, getColPath } from "@shared/lib/utils"
import { CollectionReference, DocumentData, DocumentSnapshot, QueryConstraint, QueryDocumentSnapshot, Timestamp, addDoc, collection, deleteDoc, doc, getAggregateFromServer, getDoc, getDocs, limit, orderBy, query, sum, updateDoc, where, writeBatch } from 'firebase/firestore'
import { Operation, OperationAdd, OperationUpd } from "../lib"
import { GetOpsParams } from "./operations-params"

const opParamsToQuery = (collectionRef: CollectionReference<DocumentData, DocumentData>, params?: GetOpsParams) => {
  let queryArr: QueryConstraint[] = []

  if (params?.from !== undefined) queryArr.push(where('date', '>=', TimestampAdapter.isoStrToTs(params.from)))
  if (params?.to !== undefined) queryArr.push(where('date', '<=', TimestampAdapter.isoStrToTs(params.to)))
  if (params?.orderBy !== undefined) queryArr.push(orderBy(params.orderBy, params.orderByDirection ?? undefined))
  if (params?.limit !== undefined) queryArr.push(limit(params.limit))

  if (params && queryArr.length > 0) return query(collectionRef, ...queryArr)
  else return query(collectionRef)
}

const docSnapToOp = (
  docSnap: QueryDocumentSnapshot<DocumentData, DocumentData> | DocumentSnapshot<DocumentData, DocumentData>
) => {
  if (!docSnap.exists()) return null
  const rawDoc = docSnap.data()
  let created
  let date
  if (!(rawDoc.date instanceof Timestamp)) {
    toast.error(`Invalid date in operation id ${docSnap.id}. Operation is not shown `)
    console.error(`Invalid date in ${docSnap.id}`)
    return null
  }
  else date = TimestampAdapter.tsToIsoStr(rawDoc.date)
  if (!(rawDoc.created instanceof Timestamp)) {
    toast.error(`Invalid created in doc ${docSnap.id}`)
    created = 'Invalid date'
  } else created = TimestampAdapter.tsToIsoStr(rawDoc.created, true)
  return { id: docSnap.id, ...rawDoc, created, date } as Operation
}

export const getOperation = async (id: Id) => {
  const docRef = doc(db, getColPath('operations'), id)
  const docSnap = await getDoc(docRef);
  const op = docSnapToOp(docSnap)
  return op === null ? [] : [op]
}

export const getOperations = async (params?: GetOpsParams) => {
  const collectionRef = collection(db, getColPath('operations'))
  const q = opParamsToQuery(collectionRef, params)
  const querySnapshot = await getDocs(q)
  console.log(`read operations: ${querySnapshot.docs.length}`)
  querySnapshot.metadata.fromCache && console.log('fromCache')
  const ops: Operation[] = []
  for (const docSnap of querySnapshot.docs) {
    const op = docSnapToOp(docSnap)
    if (op === null) continue
    ops.push(op)
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
      created: TimestampAdapter.isoStrToTs(newDoc.created),
      date: TimestampAdapter.isoStrToTs(newDoc.date)
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
      created: TimestampAdapter.isoStrToTs(newDoc.created),
      date: TimestampAdapter.isoStrToTs(newDoc.date)
    })
  }
  return batch.commit()
}

export const updateOperation = async (updDoc: OperationUpd) => {
  if ('created' in updDoc) delete updDoc.created
  const docRef = doc(db, getColPath('operations'), updDoc.id)
  await updateDoc(
    docRef,
    updDoc.date ? { ...updDoc, date: TimestampAdapter.isoStrToTs(updDoc.date) } : updDoc
  )
  return updDoc
}

export const batchUpdateOperations = async (updDocs: OperationUpd[]) => {
  let batch = writeBatch(db)
  for (const updDoc of updDocs) {
    const ref = doc(collection(db, getColPath('operations')), updDoc.id)
    batch.update(
      ref,
      updDoc.date ? { ...updDoc, date: TimestampAdapter.isoStrToTs(updDoc.date) } : updDoc
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

export const getOpSumsBetweenDates = async (
  dateStart: string,
  dateEnd: string,
  cats: Category[]
) => {
  const incCatIds = cats.filter(cat => cat.isIncome).map(cat => cat.id)
  const expCatIds = cats.filter(cat => !cat.isIncome).map(cat => cat.id)

  const result = { incSum: 0, expSum: 0, margin: 0 }

  const collectionRef = collection(db, getColPath('operations'))

  if (incCatIds.length > 0) {
    const q = query(
      collectionRef,
      where('date', '>', TimestampAdapter.isoStrToTs(dateStart)),
      where('date', '<', TimestampAdapter.isoStrToTs(dateEnd)),
      where('idCategory', 'in', [...incCatIds])
    )
    const querySnapshot = await getAggregateFromServer(q, { incSum: sum('sum') })
    result.incSum = querySnapshot.data().incSum
  }

  if (expCatIds.length > 0) {
    const q = query(
      collectionRef,
      where('date', '>', TimestampAdapter.isoStrToTs(dateStart)),
      where('date', '<', TimestampAdapter.isoStrToTs(dateEnd)),
      where('idCategory', 'in', [...expCatIds])
    )
    const querySnapshot = await getAggregateFromServer(q, { expSum: sum('sum') })
    result.expSum = querySnapshot.data().expSum
  }
  result.margin = result.incSum - result.expSum
  return result
}
