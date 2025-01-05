import { SortUtils } from "@shared/lib/utils"
import { Category, CategoryUpd } from "./categories-types"
import { DroppableCollectionReorderEvent } from "react-aria-components"
import { Id } from "@shared/lib/types/api-types"

export class CatUtils {
  public static getIncExpStr(cat?: Pick<Category, 'isIncome'>) {
    if (cat === undefined) return '-';
    const isIncome = cat.isIncome
    return isIncome === false ? 'Expense' : isIncome ? 'Income' : '-'
  }

  public static orderCats(cats: Category[]) {
    return cats
      .sort(SortUtils.num((c) => c.order, 'asc'))
      .sort(SortUtils.bool((c) => c.isIncome, 'desc'))
  }

  public static getDndReorderedCatUpdDocs(cats: Category[], e: DroppableCollectionReorderEvent) {
    const catsIds = cats.map(c => c.id)
    const droppedId = [...e.keys][0] as Id
    const targetId = e.target.key as Id
    const newDroppedOrder = catsIds.indexOf(targetId)
    if (newDroppedOrder === catsIds.indexOf(droppedId)) return []

    const updDocs: CategoryUpd[] = catsIds
      .filter(id => id !== droppedId)
      .map((id, i) => ({ id, order: i >= newDroppedOrder ? i + 1 : i }))
    updDocs.push({ id: droppedId, order: newDroppedOrder })

    return updDocs
  }
}
