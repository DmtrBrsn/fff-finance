import { ButtonIcon, DialogCloseBtn } from "@shared/ui/react-aria"
import { IconPlus } from '@tabler/icons-react'
import { Dialog, DialogTrigger, Heading, Modal } from "react-aria-components"
import { NewOperationForm } from "./operation-form/new-operation-form"

export const OpAddBtn = () => {
  return (
    <DialogTrigger>
      <ButtonIcon tooltip="Create operation"><IconPlus /></ButtonIcon>
      <Modal>
        <Dialog>
          {({ close }) => (
            <>
              <DialogCloseBtn close={close} />
              <Heading slot="title">New Operation</Heading>
              <NewOperationForm onSuccess={close} onCancel={close} />
            </>
          )}
        </Dialog>
      </Modal>
    </DialogTrigger>
  )
}
