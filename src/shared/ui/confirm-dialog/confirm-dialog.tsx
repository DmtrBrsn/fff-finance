import { Dialog, Heading, Modal } from "react-aria-components"
import { Button, DialogCloseBtn } from "../react-aria"

type Props = {
  isOpen: boolean
  setOpen: (open: boolean) => void
  onConfirm: () => void
  title: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
  information?: string
}

export const ConfirmDialog = (
  { isOpen, setOpen, onConfirm, title, confirmText='OK', cancelText = 'Cancel', danger = false, information }: Props
) => {
  const close = () => setOpen(false)
  return (
    <Modal isOpen={isOpen} onOpenChange={setOpen}>
      <Dialog>
        <DialogCloseBtn close={close} />
        <Heading slot="title">{title}</Heading>
        {information && <p className="pad-1">{information}</p>}
        <div className="flex-row gap-2 justify-center pad-1">
          <Button
            onPress={close}
          >
            {cancelText}
          </Button>
          <Button
            autoFocus
            onPress={() => { close(); onConfirm() }}
            variant={danger ? 'danger' : "attention"}
          >
            {confirmText}
          </Button>
        </div>
      </Dialog>
    </Modal>
  )
}
