import { type FilterBy, FilterUtils, type SortBy, SortUtils } from "@shared/utils"
import { OpSummary, type Operation, type OpFilterFields, type OpSortableFields } from "./operations.types"
import { Category } from "@features/categories/lib"
import { toast } from "@features/toaster"

export type OpSortBy = SortBy<OpSortableFields>
export type OpFilterBy = FilterBy<OpFilterFields>

export class OpUtils {
  // public static extractField(
  //   op: Operation,
  //   field: OpSortableFields | OpFilterFields,
  //   cats: Category[]
  // ) {
  //   switch (field) {
  //     case 'category':
  //       return cats.find(cat => cat.id === op.idCategory)?.name ?? 'No category found'
  //     default: return op[field]
  //   }
  // }

  public static sortOps(ops: Operation[], sortOptions: OpSortBy[], cats: Category[]) {
    let opsCopy = [...ops]
    for (const { field, dir } of sortOptions) {
      if (field === 'category') {
        opsCopy.sort(SortUtils.string(
          (op) => (cats.find(cat => cat.id === op.idCategory)?.name ?? 'No category found').toString(),
          dir
        ))
      }
      else if (field === 'isIncome') {
        opsCopy.sort(SortUtils.bool(
          (op) => (cats.find(cat => cat.id === op.idCategory)?.isIncome ?? undefined),
          dir
        ))
      }
      else if (field === 'date' || field === 'created') {
        opsCopy.sort(SortUtils.date(
          (op) => op[field],
          dir
        ))
      }
      else if (field === 'sum') {
        opsCopy.sort(SortUtils.num(
          (op) => op.sum,
          dir
        ))
      }
      else {
        opsCopy.sort(SortUtils.string(
          (op) => op[field],
          dir
        ))
      }
    }
    return opsCopy
  }

  public static filterOps(ops: Operation[], filterOptions: OpFilterBy[], cats: Category[]) {
    let opsCopy = [...ops]
    for (const fo of filterOptions) {
      switch (fo.field) {
        case 'category': {
          let value = fo.value?.toString()
          const values = fo.values==undefined ? undefined : fo.values.map(v => v.toString())
          opsCopy = opsCopy.filter(FilterUtils.getStringFiltering(
            (op) => (cats.find(cat => cat.id === op.idCategory)?.name ?? 'No category found').toString(),
            fo.condition, value, values
          ))
          break
        }
        case 'isIncome': {
          opsCopy = opsCopy.filter(FilterUtils.getBooleanFiltering(
            (op) => (cats.find(cat => cat.id === op.idCategory)?.isIncome ?? false),
              !!fo.value,
              fo.condition
          ))
          break
        }
        case 'date':
        case 'created': {
          opsCopy = opsCopy.filter(FilterUtils.getDateFiltering(
            (op) => op[fo.field as 'date' | 'created'],
            fo.condition,
            fo.value as string,
            fo.value1 as string,
            fo.values
          ))
          break
        }
        case 'sum': {
          let value = Number(fo.value?.toString())
          let value1 = Number(fo.value1?.toString())
          const values = fo.values==undefined ? undefined : fo.values.map(v => Number(v.toString()))
          opsCopy = opsCopy.filter(FilterUtils.getNumberFiltering(
            (op) => op[fo.field as 'sum'],
            fo.condition,
            value,
            value1,
            values
          ))
          break
        }
        case 'description': {
          let value = fo.value?.toString()
          opsCopy = opsCopy.filter(FilterUtils.getStringFiltering(
            (op) => op[fo.field as 'description'],
            fo.condition,
            value, 
          ))
          break
        }
      }
    }
    return opsCopy
  }

  public static makeSummary(ops: Pick<Operation, 'sum' | 'idCategory' >[], cats: Category[]): OpSummary {
    const summary: OpSummary = {
      incSum: 0,
      expSum: 0,
      margin: 0,
      cats: new Map()
    }
    for (const op of ops) {
      const cat = cats.find(c => c.id === op.idCategory)
      if (cat === undefined) {
        toast.error('Category is undefined')
        throw new Error('Category is undefined')
      }
      if (cat.isIncome) {
        summary.incSum += op.sum
      } else {
        summary.expSum += op.sum
      }
      summary.cats.set(cat.id, (summary.cats.get(cat.id) ?? 0) + op.sum)
    }
    summary.margin = summary.incSum - summary.expSum
    return summary
  }

  public static calcMargin(ops: Pick<Operation, 'sum' | 'idCategory'>[], cats: Category[]): number {
    let margin = 0
    for (const op of ops) {
      const cat = cats.find(c => c.id === op.idCategory)
      if (cat === undefined) {
        toast.error('Category is undefined')
        throw new Error('Category is undefined')
      }
      if (cat.isIncome) {
        margin += op.sum
      } else {
        margin -= op.sum
      }
    }
    return margin
  }
  
}
