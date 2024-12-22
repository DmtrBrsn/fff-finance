import { useMemo } from "react"
import { useCategoriesGet } from "../api"
import { CatAddBtn } from "./add-cat-btn"
import { CatGrid } from "./cat-grid"

export const CatWidget = () => {
  const { data: categories, isFetching: catsFetching } = useCategoriesGet()

  const exp = useMemo(() => categories?.filter(cat => !cat.isIncome), [categories])
  const inc = useMemo(() => categories?.filter(cat => cat.isIncome), [categories])

  return (
    <div className="flex-col gap-3 pad-1 align-start">
      <CatAddBtn />
      <div className="flex-row gap-3 wrap">
        <CatGrid isIncome={false} cats={exp || []} fetching={catsFetching} />
        <CatGrid isIncome={true} cats={inc || []} fetching={catsFetching} />
      </div>
    </div>
  )
}
