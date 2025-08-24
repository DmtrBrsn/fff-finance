import { Dates, numToFixedStr } from "@shared/lib/utils"
import { ButtonIcon, GridList, GridListItem } from "@shared/ui/react-aria"
import { IconTrash } from '@tabler/icons-react'
import { useBalanceDelete, useBalanceGet } from "../api"
import { Balance } from "../lib/types"

export const BalanceList = ({ fetch = true }: { fetch?: boolean }) => {
  const { data: balance, isFetching } = useBalanceGet({ sortDir: 'desc' }, fetch)
  const { mutate: del } = useBalanceDelete()

  const getItemTextValue = (item: Balance) => numToFixedStr(item.sum) + ' (' + Dates.formatDateLoc(item.date) + ')'

  return (
    <GridList
      aria-label='Balance'
      renderEmptyState={() => isFetching ? 'Loading' : 'No data'}
      selectionMode="none"
      items={balance ?? []}
    >
      {(item) => <GridListItem textValue={getItemTextValue(item)}>
        {getItemTextValue(item)}
        <ButtonIcon onPress={() => del(item.id)}><IconTrash /></ButtonIcon>
      </GridListItem>}
    </GridList>
  )
}
