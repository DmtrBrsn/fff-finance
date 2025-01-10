import { usePlansBatchDelete } from "@features/plans/api"
import { Plan } from "@features/plans/lib"
import { toast } from "@features/toaster"
import { ButtonIcon } from "@shared/ui/react-aria"
import { CloseIcon, DeleteIcon, SelectAll } from "@shared/ui/svg"
import { Separator, Toolbar } from "react-aria-components"
import { usePlansListStore } from "../plans-list-store"
import './plans-list-action-bar.css'
import { useState } from "react"
import { ConfirmDialog } from "@shared/ui/confirm-dialog"

export const PlansListActionBar = ({ plans }: { plans: Plan[] }) => {
  const {
    selected,
    setSelected
  } = usePlansListStore()
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
          <CloseIcon />
        </ButtonIcon>
        {selected.length + '/' + plans.length}
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