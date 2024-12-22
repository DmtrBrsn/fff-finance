import { ButtonIcon, DialogCloseBtn } from "@shared/react-aria"
import { EditIcon } from "@shared/svg"
import { DialogTrigger, Modal, Dialog, Heading } from "react-aria-components"
import { PlanForm } from "../plan-form/plan-form"
import { Plan } from "@features/plans/lib"

export const PlanEditBtn = ({ plan }: { plan: Plan }) => {
  return (
    <DialogTrigger>
      <ButtonIcon><EditIcon /></ButtonIcon>
      <Modal>
        <Dialog>
          {({ close }) => (
            <>
              <DialogCloseBtn close={close} />
              <Heading slot="title">Edit plan</Heading>
              <PlanForm mode='edit' plan={plan} onSuccess={close} onCancel={close} />
            </>
          )}
        </Dialog>
      </Modal>
    </DialogTrigger>
  )
}
