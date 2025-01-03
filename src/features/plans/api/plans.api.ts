import { db } from "@app/firebase"
import { Id } from "@shared/types/api-types"
import { DateUtils, getColPath } from "@shared/utils"
import { addDoc, collection, CollectionReference, deleteDoc, doc, DocumentData, getDocs, query, QueryConstraint, updateDoc, where } from "firebase/firestore"
import { GetPlanParams, Plan, PlanAdd, PlanUpd, repeatEvery } from "../lib"

const planParamsToQuery = (
  collectionRef: CollectionReference<DocumentData, DocumentData>,
  params: GetPlanParams
) => {
  const queryArr: QueryConstraint[] = []
  if (params.type==='no-date') {
    queryArr.push(where('dateStart', '==', null))
  }
  else if (params.type==='repeating') {
    queryArr.push(where('every', 'in', repeatEvery))
  }
  else if (params.type==='regular') {
    queryArr.push(where('every', '==', null))
    params.from && queryArr.push(where('dateStart', '>=', DateUtils.isoStrToTs(params.from)))
    params.to && queryArr.push(where('dateStart', '<=', DateUtils.isoStrToTs(params.to)))
  }
  return query(collectionRef, ...queryArr)
}

export const getPlans = async (params: GetPlanParams) => {
  const collectionRef = collection(db, getColPath('plans'))
  const q = planParamsToQuery(collectionRef, params)
  const querySnapshot = await getDocs(q)
  console.log(`read plans: ${querySnapshot.docs.length}`)
  return querySnapshot.docs.map(doc => {
    const rawDoc = doc.data()
    return {
      id: doc.id,
      ...rawDoc,
      created: rawDoc.created ? DateUtils.tsToIsoStr(rawDoc.created) : undefined,
      dateStart: rawDoc.dateStart ? DateUtils.tsToIsoStr(rawDoc.dateStart) : undefined,
      dateEnd: rawDoc.dateEnd ? DateUtils.tsToIsoStr(rawDoc.dateEnd) : undefined
    } as Plan
  })
}

export const addPlan = async (newDoc: PlanAdd): Promise<Plan> => {
  const collectionRef = collection(db, getColPath('plans'))
  const { created, dateStart, dateEnd, ...rest } = newDoc
  const docRef = await addDoc(
    collectionRef,
    {
      ...rest,
      created: DateUtils.isoStrToTs(newDoc.created),
      dateStart: newDoc.dateStart ? DateUtils.isoStrToTs(newDoc.dateStart) : null,
      dateEnd: newDoc.dateEnd ? DateUtils.isoStrToTs(newDoc.dateEnd) : null
    }
  )
  const addedDoc = { id: docRef.id, ...newDoc } as Plan
  return addedDoc
}

export const updatePlan = async (updDoc: PlanUpd) => {
  if ('created' in updDoc) delete updDoc.created
  const docRef = doc(db, getColPath('plans'), updDoc.id)
  await updateDoc(
    docRef,
    {
      ...updDoc,
      dateStart: updDoc.dateStart ? DateUtils.isoStrToTs(updDoc.dateStart) : null,
      dateEnd: updDoc.dateEnd ? DateUtils.isoStrToTs(updDoc.dateEnd) : null
    }
  )
  return updDoc
}


export const deletePlan = async (id: Id) => {
  const docRef = doc(db, getColPath('plans'), id)
  await deleteDoc(docRef)
  return id
}
