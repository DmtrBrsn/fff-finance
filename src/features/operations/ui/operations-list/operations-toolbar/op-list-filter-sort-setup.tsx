import { useCategoriesGet } from "@features/categories/api"
import { Button, ButtonGroup, Popover } from "@shared/react-aria"
import { ArrowDropDown, FilterList, FilterListOff } from "@shared/svg"
import { DialogTrigger } from "react-aria-components"
import { useOpsListStore } from "../operations-list-store"

export const OpListFilterSortSetup = () => {
  const { sortOptions, setSort, removeSort, filterOptions, removeFilter } = useOpsListStore()
  const { data: cats } = useCategoriesGet(false)

  const resetFiltersAndSort = () => {
    removeFilter()
    removeSort()
  }


  return (
    <ButtonGroup>
      <DialogTrigger>
        <Button narrow> <FilterList/><ArrowDropDown /></Button>
        <Popover>
          <span className="flex-col gap-1">

          </span>
        </Popover>
      </DialogTrigger>
      <Button
        narrow
        onPress={resetFiltersAndSort}
        tooltip={'Reset filters and sort'}
        isDisabled={filterOptions.length === 0 && sortOptions.length === 0}
      ><FilterListOff /></Button>
    </ButtonGroup>
  )
}
