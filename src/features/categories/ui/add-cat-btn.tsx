import { Button, DialogCloseBtn } from "@shared/ui"
import { IconPlus } from '@tabler/icons-react'
import { Dialog, DialogTrigger, Heading, Modal } from "react-aria-components"
import { CatForm } from "./cat-form"

export const CatAddBtn = () => {
  return (
    <DialogTrigger>
      <Button><IconPlus />Create category</Button>
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
