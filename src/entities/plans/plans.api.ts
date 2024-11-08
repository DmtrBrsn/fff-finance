import { addDoc, and, collection, CollectionReference, deleteDoc, doc, DocumentData, getDocs, query, QueryCompositeFilterConstraint, Timestamp, updateDoc, where } from "firebase/firestore"
import { GetPlansDatesParams } from "./plans.params"
import { DateUtils, getColPath } from "@shared/utils"
import { db } from "@app/firebase"
import { Plan, PlanAdd, PlanUpd } from "./plans.types"
import { toast } from "@app/toaster"
import { Id } from "@shared/types/api-types"

const planParamsToQuery = (collectionRef: CollectionReference<DocumentData, DocumentData>, params?: GetPlansDatesParams) => {
  let queryArr: QueryCompositeFilterConstraint[] = []

  if (params?.from !== undefined && params?.to !== undefined) {
    queryArr.push(
      and(
        where('dateStart', '<=', DateUtils.isoStrToTs(params.to)),
        where('dateEnd', '>=', DateUtils.isoStrToTs(params.from))
      )
    )
  }

  if (params && queryArr.length > 0) return query(collectionRef, queryArr[0])
  else return query(collectionRef)
}

export const getPlans = async (params?: GetPlansDatesParams) => {
  const collectionRef = collection(db, getColPath('plans'))
  const q = planParamsToQuery(collectionRef, params)
  const querySnapshot = await getDocs(q)
  querySnapshot.metadata.fromCache && console.log('fromCache')
  const plans: Plan[] = []
  for (const doc of querySnapshot.docs) {
    const rawDoc = doc.data()
    let created
    let dateStart
    let dateEnd
    if (!(rawDoc.dateStart instanceof Timestamp)) {
      toast.error(`Invalid dateStart in operation id ${doc.id}. Operation is not shown `)
      console.error(`Invalid dateStart in ${doc.id}`)
      continue
    }
    else dateStart = DateUtils.tsToIsoStr(rawDoc.dateStart)
    if (!(rawDoc.dateEnd instanceof Timestamp)) {
      toast.error(`Invalid dateEnd in operation id ${doc.id}. Operation is not shown `)
      console.error(`Invalid dateEnd in ${doc.id}`)
      continue
    }
    else dateEnd = DateUtils.tsToIsoStr(rawDoc.dateEnd)
    if (!(rawDoc.created instanceof Timestamp)) {
      toast.error(`Invalid created in doc ${doc.id}`)
      created = 'Invalid date'
    } else created = DateUtils.tsToIsoStr(rawDoc.created)
    plans.push({ id: doc.id, ...rawDoc, created, dateStart, dateEnd } as Plan)
  }
  return plans
}

export const addPlan = async (newDoc: PlanAdd): Promise<Plan> => {
  const collectionRef = collection(db, getColPath('plans'))
  const { created, dateStart, dateEnd, ...rest } = newDoc
  const docRef = await addDoc(
    collectionRef,
    {
      ...rest,
      created: DateUtils.isoStrToTs(newDoc.created),
      dateStart: DateUtils.isoStrToTs(newDoc.dateStart),
      dateEnd: DateUtils.isoStrToTs(newDoc.dateEnd)
    }
  )
  const addedDoc = { id: docRef.id, ...newDoc }
  return addedDoc
}

export const updatePlan = async (updDoc: PlanUpd) => {
  if ('created' in updDoc) delete updDoc.created
  const docRef = doc(db, getColPath('plans'), updDoc.id)
  await updateDoc(
    docRef,
    {
      ...updDoc,
      dateStart: updDoc.dateStart ? DateUtils.isoStrToTs(updDoc.dateStart) : undefined,
      dateEnd: updDoc.dateEnd ? DateUtils.isoStrToTs(updDoc.dateEnd) : undefined
    }
  )
  return updDoc
}

export const deletePlan = async (id: Id) => {
  const docRef = doc(db, getColPath('plans'), id)
  await deleteDoc(docRef)
  return id
}
