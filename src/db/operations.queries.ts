import { db } from "../firebase"
import { getDocs, collection, addDoc, doc, deleteDoc, setDoc } from 'firebase/firestore'

const getAllOperations = async () => {
  const collectionRef = collection(db, 'operations')
  try {
    const querySnapshot = await getDocs(collectionRef)
    return querySnapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() } as OperationDoc
    })
  }
  catch(err) {
    console.error(err)
    return []
  }
}

const addOperation = async (doc: Omit<OperationDoc, "id">): Promise<OperationDoc | null>  => {
  const collectionRef = collection(db, 'operations')
  try {
    const docRef = await addDoc(collectionRef, doc)
    const addedDoc = { id: docRef.id, ...doc }
    return addedDoc
  }
  catch (err) {
    console.error(err)
    return null
  }
}

const deleteOperation = async (id: string) => {
  const docRef = doc(db, 'operations', id)
  try {
    await deleteDoc(docRef)
  }
  catch(err) {
    console.error(err)
    return null
  }
}

const updateOperation = async (updDoc: OperationDoc) => {
  const docRef = doc(db, 'operations', updDoc.id)
  try {
    await setDoc(docRef, updDoc)
  }
  catch(err) {
    console.error(err)
    return null
  }
}


export { getAllOperations, addOperation, deleteOperation, updateOperation }