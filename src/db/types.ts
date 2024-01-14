type CategoryDoc = {
  id: string
  name: string
  isIncome: boolean
  created?: string
}

type OperationDoc = {
  id: string
  idCategory: string
  date?: string
  description: string
  isPlan: boolean
  sum: number
  created?: string
}
