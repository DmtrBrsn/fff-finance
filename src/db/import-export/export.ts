import { formatISO } from "date-fns"
import { getAllCategories } from "../categories/categories.api"
import { getOperations } from "../operations/operations.api"

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

export async function exportCategories() {
  const cats = await getAllCategories()
  const catsForExport: any[] = []

  for (let cat of cats) {
    catsForExport.push({
      ...cat, created: formatISO(cat.created.toDate())
    })
  }

  const json = JSON.stringify(cats)
  const blob = new Blob([json], { type: 'text/plain' })

  const name = new Date().toISOString()+'_categories.json'
  return {blob, name}
}
