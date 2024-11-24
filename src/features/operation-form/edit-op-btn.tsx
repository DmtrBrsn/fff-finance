import { Operation } from "@entities/operations"
import { ButtonIcon, DialogCloseBtn } from "@shared/react-aria"
import { EditIcon } from "@shared/svg"
import { DialogTrigger, Modal, Dialog } from "react-aria-components"
import { EditOperationForm } from "./edit-operation-form"

export const EditOpBtn = ({ op }: { op: Operation }) => {
  return (
    <DialogTrigger>
      <ButtonIcon><EditIcon /></ButtonIcon>
      <Modal>
        <Dialog>
          {({ close }) => (
            <>
              <DialogCloseBtn close={close} />
              <EditOperationForm op={op} onSuccess={close} onCancel={close} />
            </>
          )}
        </Dialog>
      </Modal>
    </DialogTrigger>
  )
}
