import { MenuButtonIcon, MenuItem } from "@shared/react-aria"
import { usePlansDelete } from "../../api"
import { Plan } from "../../lib"
import { ConditionalModal } from "@shared/conditional-modal"
import { useState } from "react"
import { PlanForm } from "../plan-form"

export const PlanMenuBtn = ({ plan }: { plan: Plan }) => {
  const { mutateAsync: deletePlan, isPending: deleting } = usePlansDelete()
  const [isOpen, setOpen] = useState(false)
  
  return (
    <>
      <MenuButtonIcon>
        <MenuItem onAction={() => setOpen(true)}>Edit</MenuItem>
        <MenuItem isDisabled={deleting} onAction={() => () => deletePlan(plan.id)}>Delete</MenuItem>
      </MenuButtonIcon>

      <ConditionalModal
        title="Edit plan"
        isOpen={isOpen}
        setOpen={setOpen}
      >
        <PlanForm mode='edit' plan={plan} />
      </ConditionalModal>
    </>
  )
}
