import { isTouchDevice } from "@shared/lib/utils"
import { DialogCloseBtn, MenuButtonIcon, MenuItem } from "@shared/ui/react-aria"
import { useMemo, useState } from "react"
import { Dialog, Heading, Modal } from "react-aria-components"
import { useNavigate } from "react-router-dom"
import { usePlansDelete } from "../../api"
import { Plan } from "../../lib"
import { PlanForm } from "../plan-form"

export const PlanMenuBtn = ({ plan }: { plan: Plan }) => {
  const [isOpen, setOpen] = useState(false)
  const { mutateAsync: deletePlan, isPending: deleting } = usePlansDelete()
  const isTouch = useMemo(() => isTouchDevice(), [])
  const navigate = useNavigate()

  const editBtnAction = () => {
    isTouch ? navigate(`/plans/${plan.id}`) : setOpen(true)
  }
  const close = () => setOpen(false)
  
  return (
    <>
      <MenuButtonIcon>
        <MenuItem onAction={editBtnAction}>Edit</MenuItem>
        <MenuItem isDisabled={deleting} onAction={() => deletePlan(plan.id)}>Delete</MenuItem>
      </MenuButtonIcon>

      <Modal isOpen={isOpen} onOpenChange={setOpen}>
        <Dialog>
          <DialogCloseBtn close={close} />
          <Heading slot="title">Plan editing</Heading>
          <PlanForm mode='edit' plan={plan} onSuccess={close} onCancel={close} />
        </Dialog>
      </Modal>
    </>
  )
}
