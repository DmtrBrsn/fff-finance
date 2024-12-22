import { addDoc, collection, CollectionReference, deleteDoc, doc, DocumentData, getDocs, limit, orderBy, query, QueryConstraint, where } from "firebase/firestore"
import { Balance, BalanceAdd, GetBalanceParams } from "../lib/types"
import { DateUtils, getColPath } from "@shared/utils"
import { db } from "@app/firebase"
import { Id } from "@shared/types/api-types"

const balanceParamsToQuery = (
  collectionRef: CollectionReference<DocumentData, DocumentData>, params?: GetBalanceParams
) => {
  const queryArr: QueryConstraint[] = []

  if (params?.limit) queryArr.push(limit(params.limit))
  if (params?.from !== undefined) queryArr.push(where('date', '>=', DateUtils.isoStrToTs(params.from)))
  if (params?.to !== undefined) queryArr.push(where('date', '<=', DateUtils.isoStrToTs(params.to)))
  if (params?.sortDir !== undefined) queryArr.push(orderBy('date', params.sortDir))

  if (params && queryArr.length > 0) return query(collectionRef, ...queryArr)
  else return query(collectionRef)
}

export const getBalance = async (params?: GetBalanceParams) => {
  const collectionRef = collection(db, getColPath('balance'))
  const q = balanceParamsToQuery(collectionRef, params)
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => {
    const rawDoc = doc.data()
    return {
      id: doc.id,
      sum: rawDoc.sum,
      note: rawDoc.note,
      date: DateUtils.tsToIsoStr(rawDoc.date),
    } as Balance
  })
}

export const addBalance = async (newDoc: BalanceAdd): Promise<Balance> => {
  const collectionRef = collection(db, getColPath('balance'))
  const { date, ...rest } = newDoc
  const docRef = await addDoc(
    collectionRef,
    {
      ...rest,
      date: DateUtils.isoStrToTs(newDoc.date)
    }
  )
  const addedDoc = { id: docRef.id, ...newDoc }
  return addedDoc
}

export const deleteBalance = async (id: Id) => {
  const docRef = doc(db, getColPath('balance'), id)
  await deleteDoc(docRef)
  return id
}
