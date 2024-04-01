export type Category = {
  id: string
  name: string
  isIncome: boolean
  created?: string
}

export type Operation = {
  id: string
  idCategory: string
  date?: string
  description: string
  isPlan: boolean
  sum: number
  created?: string
}

export type ApiCb = ()=> void
