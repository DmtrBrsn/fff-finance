import { writeBatch, doc, collection } from "firebase/firestore"
import { toast } from "@features/toaster"
import { db } from "@app/firebase"
import { Dates, getColPath, TimestampAdapter } from "@shared/lib/utils"
import { Category } from "@features/categories/lib"
import { getOperations } from "../api"

export async function importOperations(json: string, cats: Category[]) {
  const opsParsed = JSON.parse(json)
  if (!Array.isArray(opsParsed)) throw `must be an array`
  opsParsed.forEach((o, i) => validateImportOperation(o, i, cats))
  const ops = opsParsed.map(opp => parsedImportOpToOp(opp, cats))
  if (ops.length > 20000) {
    toast('>20000')
    return
  }
  let count = 0
  let batch = writeBatch(db)
  for (const [i, op] of ops.entries()) {
    const ref = doc(collection(db, getColPath('operations')))
    batch.set(ref, op)
    count++
    if (count === 500 || i === ops.length - 1) {
      await batch.commit()
      count = 0
      batch = writeBatch(db)
    }
  }
  toast(`created ${ops.length} operations`)
}

function validateImportOperation(opParsed: any, index: number, cats: Category[]) {
  if (opParsed.date == undefined || !Dates.isDateValid(new Date(opParsed.date))) {
    throw new Error(`incorrect date at ${index}`)
  }
  if (opParsed.description == undefined || typeof opParsed.description !== 'string') {
    throw new Error(`incorrect description at ${index}`)
  }
  let hasIdCat = false
  if (opParsed.idCategory != undefined && typeof opParsed.idCategory == 'string') {
    hasIdCat = true
  }
  if (!hasIdCat && opParsed.categoryName == undefined || typeof opParsed.categoryName !== 'string') {
    throw new Error(`incorrect categoryName at ${index}}`)
  }
  const catExists = cats.some(c => c.name === opParsed.categoryName)
  if (!catExists) {
    throw new Error(`no category exists by name "${opParsed.categoryName}" at ${index}`)
  }
  if (opParsed.sum == undefined || typeof opParsed.sum !== 'number' || opParsed.sum < 0) {
    throw new Error(`incorrect sum at ${index}}`)
  }
  if (opParsed.created != undefined && !Dates.isDateValid(new Date(opParsed.created))) {
    throw new Error(`incorrect created at ${index}`)
  }
}

function parsedImportOpToOp(opParsed: any, cats: Category[]) {
  const cat = opParsed.idCategory ?
    cats.find(c => c.id === opParsed.idCategory) :
    cats.find(c => c.name === opParsed.categoryName)

  if (!cat) throw new Error('category not found')
  else return {
    date: TimestampAdapter.isoStrToTs(opParsed.date),
    description: opParsed.description,
    idCategory: cat.id,
    sum: opParsed.sum,
    created: opParsed.created ? TimestampAdapter.isoStrToTs(opParsed.created) : TimestampAdapter.getCurTs(),
  }
}

export async function exportOperations() {
  const ops = await getOperations()
  const opsForExport: any[] = []

  for (let op of ops) {
    opsForExport.push({ ...op })
  }

  const json = JSON.stringify(opsForExport)

  const blob = new Blob([json], { type: 'text/plain' })

  const name = new Date().toISOString() + '_operations.json'
  return { blob, name }
}
