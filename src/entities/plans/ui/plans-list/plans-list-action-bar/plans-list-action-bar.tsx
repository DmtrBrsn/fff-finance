
import { IconSelectAll, IconTrash, IconX } from '@tabler/icons-react'
import { useState } from "react"
import { Separator, Toolbar } from "react-aria-components"
import { usePlansListStore } from "../plans-list-store"
import './plans-list-action-bar.css'
import { toast } from '../../../../../features/toaster'
import { ButtonIcon } from '../../../../../shared/ui'
import { ConfirmDialog } from '../../../../../shared/ui/confirm-dialog'
import { usePlansBatchDelete } from '../../../api'
import { Plan } from '../../../lib'

export const PlansListActionBar = ({ plans }: { plans: Plan[] }) => {
  const selected = usePlansListStore(state => state.selected)
  const setSelected = usePlansListStore(state => state.setSelected)
  const { mutateAsync: batchDeletePlans } = usePlansBatchDelete()
  const [delConfirmOpen, setDelConfirmOpen] = useState(false)

  const deleteSelected = () => batchDeletePlans(selected)
    .then(() => {
      toast('Selected plans deleted')
      setSelected([])
    })
  const selectAll = () => {
    setSelected(plans.map(p => p.id))
  }
  const cancel = () => {
    setSelected([])
  }

  return (
    <>
      <Toolbar className='react-aria-Toolbar plans-list-action-bar'>
        <ButtonIcon
          tooltip="Cancel selection"
          onPress={cancel}
        >
          <IconX />
        </ButtonIcon>
        {selected.length + '/' + plans.length}
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