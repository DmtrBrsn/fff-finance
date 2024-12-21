import { Button, DialogCloseBtn } from "@shared/react-aria"
import { CreateIcon } from "@shared/svg"
import { Dialog, DialogTrigger, Heading, Modal } from "react-aria-components"
import { PlanForm } from "./plan-form"

export const PlanAddBtn = () => {
  return (
    <DialogTrigger>
      <Button><CreateIcon /> Create plan</Button>
      <Modal>
        <Dialog>
          {({ close }) => (
            <>
              <DialogCloseBtn close={close}/>
              <Heading slot="title">New plan</Heading>
              <PlanForm mode="add" onSuccess={close} onCancel={close} />
            </>
          )}
        </Dialog>
      </Modal>
    </DialogTrigger>
  )
}
