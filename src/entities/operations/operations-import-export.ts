import { isValid, formatISO } from "date-fns"
import { writeBatch, doc, collection, Timestamp } from "firebase/firestore"
import { toast } from "react-toastify"
import { getOperations } from "./operations.api"
import { Category } from "../categories/categories-types"
import { OperationAdd } from "./operations-types"
import { db } from "@app/firebase"
import { getColPath } from "@shared/utils"

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
  if (opParsed.date == undefined || !isValid(new Date(opParsed.date))) {
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
  if (!catExists) throw new Error(`no category exists by name ${opParsed.categoryName} at ${index}`)
  if (opParsed.sum == undefined || typeof opParsed.sum !== 'number' || opParsed.sum<0) {
    throw new Error(`incorrect sum at ${index}}`)
  }
  if (opParsed.created != undefined && !isValid(new Date(opParsed.created))) {
    throw new Error(`incorrect created at ${index}`)
  }
  if (opParsed.isPlan != undefined && typeof opParsed.isPlan !== 'boolean') {
    throw new Error(`incorrect isPlan at ${index}`)
  }
}

function parsedImportOpToOp(opParsed: any, cats: Category[]): OperationAdd {
  const cat = opParsed.idCategory ?
    cats.find(c => c.id === opParsed.idCategory) : 
    cats.find(c => c.name === opParsed.categoryName)
  
  if (!cat) throw new Error('category not found')
  else return {
    date: Timestamp.fromDate(new Date(opParsed.date)),
    description: opParsed.description,
    idCategory: cat.id,
    sum: opParsed.sum,
    created: opParsed.created ? Timestamp.fromDate(new Date(opParsed.created)) : Timestamp.now(),
    isPlan: opParsed.isPlan!=undefined ? opParsed.isPlan : false
  }
}

export async function exportOperations() {
  const ops = await getOperations()
  const opsForExport: any[] = []

  for (let op of ops) {
    opsForExport.push({
      ...op, date: formatISO(op.date.toDate()), created: formatISO(op.created.toDate())
    })
  }

  const json = JSON.stringify(opsForExport)

  const blob = new Blob([json], { type: 'text/plain' })

  const name = new Date().toISOString()+'_operations.json'
  return {blob, name}
}
