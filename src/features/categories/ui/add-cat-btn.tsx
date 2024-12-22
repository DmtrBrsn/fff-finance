import { Button, DialogCloseBtn } from "@shared/react-aria"
import { CreateIcon } from "@shared/svg"
import { Dialog, DialogTrigger, Heading, Modal } from "react-aria-components"
import { CatForm } from "./categories-form"

export const CatAddBtn = () => {
  return (
    <DialogTrigger>
      <Button><CreateIcon />Add category</Button>
      <Modal>
        <Dialog>
          {({ close }) => (
            <>
              <DialogCloseBtn close={close} />
              <Heading slot="title">New category</Heading>
              <CatForm mode="add" onSuccess={close} onCancel={close} />
            </>
          )}
        </Dialog>
      </Modal>
    </DialogTrigger>
  )
}
