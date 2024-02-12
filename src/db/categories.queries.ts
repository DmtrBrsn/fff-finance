import { db } from "../firebase"
import { getDocs, collection, addDoc, doc, deleteDoc, setDoc } from 'firebase/firestore'
import { getColPath } from "./db-utils"
import { toast } from "react-toastify"

const getAllCategories = async () => {
  const collectionRef = collection(db, getColPath('categories'))
  try {
    const querySnapshot = await getDocs(collectionRef)
    return querySnapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() } as CategoryDoc
    })
  }
  catch(err) {
    console.error(err)
    return []
  }
}

const addCategory = async (doc: Omit<CategoryDoc, "id">): Promise<CategoryDoc | null>  => {
  const collectionRef = collection(db, getColPath('categories'))
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

const deleteCategory = async (id: string) => {
  const docRef = doc(db, getColPath('categories'), id)
  try {
    await deleteDoc(docRef)
  }
  catch (err) {
    toast.error(`${err}`)
    console.error(err)
    return null
  }
}

const updateCategory = async (updDoc: CategoryDoc) => {
  const docRef = doc(db, getColPath('categories'), updDoc.id)
  try {
    await setDoc(docRef, updDoc)
  }
  catch (err) {
    toast.error(`${err}`)
    console.error(err)
    return null
  }
}



export { getAllCategories, addCategory, deleteCategory, updateCategory }
