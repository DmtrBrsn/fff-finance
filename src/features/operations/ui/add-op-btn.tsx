import { ButtonIcon, DialogCloseBtn } from "@shared/ui/react-aria"
import { CreateIcon } from "@shared/ui/svg"
import { Dialog, DialogTrigger, Heading, Modal } from "react-aria-components"
import { NewOperationForm } from "./operation-form/new-operation-form"

export const OpAddBtn = () => {
  return (
    <DialogTrigger>
      <ButtonIcon tooltip="Create operation"><CreateIcon /></ButtonIcon>
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
