import { ButtonIcon, DialogCloseBtn } from "@shared/react-aria"
import { CreateIcon } from "@shared/svg"
import { Dialog, DialogTrigger, Heading, Modal } from "react-aria-components"
import { NewOperationForm } from "./operation-form/new-operation-form"

export const OpAddBtn = ({ size = 'regular' }: {
  size?: 'regular' | 'large'
  
}) => {
  return (
    <DialogTrigger>
      <ButtonIcon size={size==='regular' ? 'm' : 'xl'}><CreateIcon /></ButtonIcon>
      <Modal>
        <Dialog>
          {({ close }) => (
            <>
              <DialogCloseBtn close={close} />
              <Heading slot="title">New operation</Heading>
              <NewOperationForm onSuccess={close} onCancel={close} />
            </>
          )}
        </Dialog>
      </Modal>
    </DialogTrigger>
  )
}
