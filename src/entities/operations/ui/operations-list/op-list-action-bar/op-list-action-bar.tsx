
import { IconSelectAll, IconTrash, IconX } from '@tabler/icons-react'
import { useMemo, useState } from "react"
import { Separator, Toolbar } from "react-aria-components"
import { useOpsListStore } from "../operations-list-store"
import './op-list-action-bar.css'
import { toast } from '../../../../../features/toaster'
import { numToFixedStr } from '../../../../../shared/lib/utils'
import { ButtonIcon } from '../../../../../shared/ui'
import { ConfirmDialog } from '../../../../../shared/ui/confirm-dialog'
import { useCategoriesGet } from '../../../../categories/api'
import { useOperationsBatchDelete } from '../../../api'
import { Operation } from '../../../lib'


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
          <IconX />
        </ButtonIcon>
        {selected.length + '/' + ops.length}
        <ButtonIcon
          tooltip="Select all"
          onPress={selectAll}
        >
          <IconSelectAll />
        </ButtonIcon>
        <Separator orientation="vertical" />
        <ButtonIcon
          onPress={() => setDelConfirmOpen(true)}
          isDisabled={selected.length === 0}
          tooltip={'Delete selected'}
        ><IconTrash /></ButtonIcon>
        {selected.length > 0 && '+ ' + numToFixedStr(selectedIncSum) + ';'}
        {selected.length > 0 && '- ' + numToFixedStr(selectedExpSum) + '; '}
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