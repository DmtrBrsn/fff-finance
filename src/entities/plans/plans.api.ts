import { db } from "@app/firebase"
import { Id } from "@shared/types/api-types"
import { DateUtils, getColPath } from "@shared/utils"
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc } from "firebase/firestore"
import { Plan, PlanAdd, PlanUpd } from "./plans.types"

export const getAllPlans = async () => {
  const q = query(collection(db, getColPath('plans')));
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
