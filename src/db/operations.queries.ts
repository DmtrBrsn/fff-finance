import { db } from "../firebase"
import { getDocs, collection, addDoc, doc, deleteDoc, setDoc } from 'firebase/firestore'
import { getColPath } from "./db-utils"
import { toast } from "react-toastify"

const getAllOperations = async () => {
  const collectionRef = collection(db, getColPath('operations'))
  try {
    const querySnapshot = await getDocs(collectionRef)
    return querySnapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() } as OperationDoc
    })
  }
  catch (err) {
    toast.error(`${err}`)
    console.error(err)
    return []
  }
}

const addOperation = async (doc: Omit<OperationDoc, "id">): Promise<OperationDoc | null>  => {
  const collectionRef = collection(db, getColPath('operations'))
  try {
    const docRef = await addDoc(collectionRef, doc)
    const addedDoc = { id: docRef.id, ...doc }
    return addedDoc
  }
  catch (err) {
    toast.error(`${err}`)
    console.error(err)
    return null
  }
}

const deleteOperation = async (id: string) => {
  const docRef = doc(db, getColPath('operations'), id)
  try {
    await deleteDoc(docRef)
  }
  catch (err) {
    toast.error(`${err}`)
    console.error(err)
    return null
  }
}

const updateOperation = async (updDoc: OperationDoc) => {
  const docRef = doc(db, getColPath('operations'), updDoc.id)
  try {
    await setDoc(docRef, updDoc)
  }
  catch (err) {
    toast.error(`${err}`)
    console.error(err)
    return null
  }
}

export { getAllOperations, addOperation, deleteOperation, updateOperation }
