import { type FilterBy, FilterUtils, type SortBy, SortUtils } from "@shared/utils"
import { type Operation, type OpFilterFields, type OpSortableFields } from "./operations-types"
import { type Category } from "@entities/categories"

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
        opsCopy.sort(SortUtils.getStringSorting(
          (op) => (cats.find(cat => cat.id === op.idCategory)?.name ?? 'No category found').toString(),
          dir
        ))
      }
      else if (field === 'isIncome') {
        opsCopy.sort(SortUtils.getBooleanSorting(
          (op) => (cats.find(cat => cat.id === op.idCategory)?.isIncome ?? undefined),
          dir
        ))
      }
      else if (field === 'date' || field === 'created') {
        opsCopy.sort(SortUtils.getDateSorting(
          (op) => op[field],
          dir
        ))
      }
      else if (field === 'sum') {
        opsCopy.sort(SortUtils.getNumSorting(
          (op) => op.sum,
          dir
        ))
      }
      else {
        opsCopy.sort(SortUtils.getStringSorting(
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
          let value = fo.value.toString()
          opsCopy = opsCopy.filter(FilterUtils.getStringFiltering(
            (op) => (cats.find(cat => cat.id === op.idCategory)?.name ?? 'No category found').toString(),
            value, fo.condition
          ))
          break
        }
        case 'isIncome': {
          opsCopy = opsCopy.filter(FilterUtils.getBooleanFiltering(
            (op) => (cats.find(cat => cat.id === op.idCategory)?.isIncome ?? 'No category found').toString(),
            !!fo.value, fo.condition
          ))
          break
        }
        case 'date':
        case 'created': {
          opsCopy = opsCopy.filter(FilterUtils.getDateFiltering(
            (op) => op[fo.field as 'date' | 'created'],
            fo.value as string, fo.condition, fo.value1 as string
          ))
          break
        }
        case 'sum': {
          let value = parseFloat(fo.value.toString())
          let value1 = fo.value1 === undefined ? undefined : parseFloat(fo.value1.toString())
          opsCopy = opsCopy.filter(FilterUtils.getNumberFiltering(
            (op) => op[fo.field as 'sum'],
            value, fo.condition, value1
          ))
          break
        }
        case 'description': {
          let value = fo.value.toString()
          opsCopy = opsCopy.filter(FilterUtils.getStringFiltering(
            (op) => op[fo.field as 'description'],
            value, fo.condition
          ))
          break
        }
      }
    }
    return opsCopy
  }
}
