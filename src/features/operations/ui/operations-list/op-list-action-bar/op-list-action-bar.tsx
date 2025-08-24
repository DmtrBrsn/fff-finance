import { useOperationsBatchDelete } from "@features/operations/api"
import { useOpsListStore } from "../operations-list-store"
import { Separator, Toolbar } from "react-aria-components"
import { toast } from "@features/toaster"
import { ButtonIcon } from "@shared/ui/react-aria"
import { CloseIcon, DeleteIcon, SelectAll } from "@shared/ui/svg"
import { Operation } from "@features/operations/lib"
import { numToFixedStr } from "@shared/lib/utils"
import { useMemo, useState } from "react"
import { useCategoriesGet } from "@features/categories/api"
import './op-list-action-bar.css'
import { ConfirmDialog } from "@shared/ui/confirm-dialog"


export const OpListActionBar = ({ ops }: { ops: Operation[] }) => {
  const selected = useOpsListStore(state => state.selected)
  const setSelected = useOpsListStore(state => state.setSelected)

  const { mutateAsync: batchDeleteOps } = useOperationsBatchDelete()
  const { data: cats } = useCategoriesGet()
  const [delConfirmOpen, setDelConfirmOpen] = useState(false)

  const deleteSelected = () => batchDeleteOps(selected)
    .then(() => {
      toast('Selected operations deleted')
      setSelected([])
    })

  const selectedIncSum = useMemo(
    () => ops?.filter(op =>
      cats?.find(c => c.id === op.idCategory && c.isIncome) &&
      selected.includes(op.id))?.reduce((acc, op) => acc + op.sum, 0
      ) ?? 0,
    [ops, selected])

  const selectedExpSum = useMemo(
    () => ops?.filter(op =>
      cats?.find(c => c.id === op.idCategory && !c.isIncome) &&
      selected.includes(op.id))?.reduce((acc, op) => acc + op.sum, 0
      ) ?? 0,
    [ops, selected]
  )

  const selectAll = () => {
    setSelected(ops.map(op => op.id))
  }

  const cancel = () => {
    setSelected([])
  }

  return (
    <>
      <Toolbar className='react-aria-Toolbar op-list-action-bar'>
        <ButtonIcon
          tooltip="Cancel selection"
          onPress={cancel}
        >
          <CloseIcon />
        </ButtonIcon>
        {selected.length + '/' + ops.length}
        <ButtonIcon
          tooltip="Select all"
          onPress={selectAll}
        >
          <SelectAll />
        </ButtonIcon>
        <Separator orientation="vertical" />
        <ButtonIcon
          onPress={() => setDelConfirmOpen(true)}
          isDisabled={selected.length === 0}
          tooltip={'Delete selected'}
        ><DeleteIcon /></ButtonIcon>
        {selected.length > 0 && 'exp sum: ' + numToFixedStr(selectedExpSum) + '; '}
        {selected.length > 0 && 'inc sum: ' + numToFixedStr(selectedIncSum) + ';'}
      </Toolbar>
      <ConfirmDialog
        title="Delete plans?"
        isOpen={delConfirmOpen}
        setOpen={setDelConfirmOpen}
        onConfirm={deleteSelected}
      />
    </>
  )
}