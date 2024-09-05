import { writeBatch, doc, collection } from "firebase/firestore"
import { toast } from "react-toastify"
import { getAllCategories } from "./categories.api"
import { db } from "@app/firebase"
import { DateUtils, getColPath } from "@shared/utils"

export async function importCategories(json: string) {
  const catsParsed = JSON.parse(json)
  if (!Array.isArray(catsParsed)) throw `must be an array`
  catsParsed.forEach((o, i) => validateImportCategory(o, i))
  const cats = catsParsed.map(catp => parsedImportCatToCat(catp))
  if (cats.length > 20000) {
    toast('>20000')
    return
  }
  const batch = writeBatch(db)
  for (const cat of cats) {
    const ref = doc(collection(db, getColPath('categories')))
    batch.set(ref, cat)
  }
  await batch.commit()
  toast(`created ${cats.length} categories`)
}

function validateImportCategory(catParsed: any, index: number) {
  if (catParsed.name == undefined || typeof catParsed.name !== 'string') {
    throw new Error(`incorrect name at ${index}}`)
  }
  if (catParsed.isIncome == undefined && typeof catParsed.isIncome !== 'boolean') {
    throw new Error(`incorrect isIncome at ${index}`)
  }
  if (catParsed.created != undefined && !DateUtils.isDateValid(new Date(catParsed.created))) {
    throw new Error(`incorrect created at ${index}`)
  }
}

function parsedImportCatToCat(catParsed: any) {
  return {
    name: catParsed.name,
    isIncome: catParsed.isIncome,
    created: catParsed.created ? DateUtils.isoStrToTs(catParsed.created) :  DateUtils.getCurTs(),
  }
}

export async function exportCategories() {
  const cats = await getAllCategories()
  const catsForExport: any[] = []

  for (let cat of cats) {
    catsForExport.push({...cat})
  }

  const json = JSON.stringify(cats)
  const blob = new Blob([json], { type: 'text/plain' })

  const name = DateUtils.getCurIsoStr()+'_categories.json'
  return {blob, name}
}
