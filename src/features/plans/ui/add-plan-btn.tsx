import { ButtonIcon, DialogCloseBtn } from "@shared/ui/react-aria"
import { IconPlus } from '@tabler/icons-react'
import { Dialog, DialogTrigger, Heading, Modal } from "react-aria-components"
import { PlanForm } from "./plan-form"

export const PlanAddBtn = () => {
  return (
    <DialogTrigger>
      <ButtonIcon tooltip="Create plan"><IconPlus /></ButtonIcon>
      <Modal>
        <Dialog>
          {({ close }) => (
            <>
              <DialogCloseBtn close={close} />
              <Heading slot="title">New plan</Heading>
              <PlanForm mode="add" onSuccess={close} onCancel={close} />
            </>
          )}
        </Dialog>
      </Modal>
    </DialogTrigger>
  )
}
