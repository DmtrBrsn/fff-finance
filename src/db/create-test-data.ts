import { Timestamp } from "firebase/firestore"
import { addCategory, getAllCategories } from "./categories/categories.api"
import { addOperation } from "./operations/operations.api"
import { CategoryAdd, OperationAdd } from "./types"
import { addDays } from "date-fns"

(async function () {
  const existingCats = await getAllCategories()
  if (existingCats.length > 0) {
    return
  }
  console.log('creating test data...')
  const cats: CategoryAdd[] = [
    {
      name: 'Связь',
      isIncome: false,
      created: Timestamp.now()
    },
    {
      name: 'ЗП',
      isIncome: true,
      created: Timestamp.now()
    },
    {
      name: 'Продукты',
      isIncome: false,
      created: Timestamp.now()
    },
  ]
  for (let cat of cats) await addCategory(cat)
  
  const createdCats = await getAllCategories()
  
  const ops: OperationAdd[] = []

  let count = 0
  while (count < 1000) {
    const catIndex = count<500 ? 0 : count<700 ? 1 : 2
    ops.push({
      description: `TEST_${count}`,
      sum: Math.floor(Math.random() * 1000),
      idCategory: createdCats[catIndex].id,
      date: Timestamp.fromDate(addDays(new Date, Math.floor((Math.random() * 100)))),
      created: Timestamp.now(),
      isPlan: false
    })
    count++
  }
  for (let op of ops) await addOperation(op)
  console.log(`${createdCats.length} cats created; ${ops.length} ops created`)
  window.location.reload()
})()
