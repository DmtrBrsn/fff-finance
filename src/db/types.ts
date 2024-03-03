type Category = {
  id: string
  name: string
  isIncome: boolean
  created?: string
}

type Operation = {
  id: string
  idCategory: string
  date?: string
  description: string
  isPlan: boolean
  sum: number
  created?: string
}
