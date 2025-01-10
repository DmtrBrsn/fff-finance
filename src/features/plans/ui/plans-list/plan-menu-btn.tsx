import { isTouchDevice } from "@shared/lib/utils"
import { DialogCloseBtn, MenuButtonIcon, MenuItem } from "@shared/ui/react-aria"
import { useMemo, useState } from "react"
import { Dialog, Heading, Modal } from "react-aria-components"
import { useNavigate } from "react-router-dom"
import { usePlansDelete } from "../../api"
import { Plan } from "../../lib"
import { PlanForm } from "../plan-form"
import { ConfirmDialog } from "@shared/ui/confirm-dialog"
import { usePlansListStore } from "./plans-list-store"

export const PlanMenuBtn = ({ plan }: { plan: Plan }) => {
  const [isOpen, setOpen] = useState(false)
  const { selected, setSelected } = usePlansListStore()
  const isSelected = selected.includes(plan.id)
  const { mutateAsync: deletePlan, isPending: deleting } = usePlansDelete()
  const [delConfirmOpen, setDelConfirmOpen] = useState(false)
  const isTouch = useMemo(() => isTouchDevice(), [])
  const navigate = useNavigate()

  const editBtnAction = () => {
    isTouch ? navigate(`/plans/${plan.id}`) : setOpen(true)
  }
  const close = () => setOpen(false)

  const toggleSelect = () => {
    if (isSelected) {
      setSelected(selected.filter(id => id !== plan.id))
    }
    else {
      setSelected([...selected, plan.id])
    }
  }

  return (
    <>
      <MenuButtonIcon>
        <MenuItem onAction={editBtnAction}>Edit</MenuItem>
        <MenuItem isDisabled={deleting} onAction={() => setDelConfirmOpen(true)}>Delete</MenuItem>
        <MenuItem onAction={toggleSelect}>{isSelected ? 'Deselect' : 'Select'}</MenuItem>
      </MenuButtonIcon>

      <Modal isOpen={isOpen} onOpenChange={setOpen}>
        <Dialog>
          <DialogCloseBtn close={close} />
          <Heading slot="title">Plan editing</Heading>
          <PlanForm mode='edit' plan={plan} onSuccess={close} onCancel={close} />
        </Dialog>
      </Modal>
      <ConfirmDialog
        title="Delete plan?"
        isOpen={delConfirmOpen}
        setOpen={setDelConfirmOpen}
        onConfirm={() => deletePlan(plan.id)}
      />
    </>
  )
}
