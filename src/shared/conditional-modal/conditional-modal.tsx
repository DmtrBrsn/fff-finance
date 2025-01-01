import { BottomSheet } from "@shared/bottom-sheet"
import { Button, ButtonProps, DialogCloseBtn } from "@shared/react-aria"
import { isTouchDevice } from "@shared/utils"
import React, { useMemo, useState } from "react"
import { Dialog, DialogTrigger, Heading, Modal } from "react-aria-components"

type BaseProps = {
  children: React.ReactNode
  title?: string
}

export const ConditionalModalBtn = ({ children, title, buttonProps }: BaseProps & { buttonProps: ButtonProps }) => {
  const [isOpen, setOpen] = useState(false)
  const isTouch = useMemo(() => isTouchDevice(), [])

  return isTouch ? (
    <>
      <Button {...buttonProps} onPress={() => setOpen(true)}>{buttonProps.children}</Button>
      <BottomSheet title={title} isOpen={isOpen} setOpen={setOpen}>
        {//@ts-ignore 
          React.cloneElement(children, { onSuccess: () => setOpen(false), onCancel: () => setOpen(false) })
        }
      </BottomSheet>
    </>
  )
    : (
      <DialogTrigger>
        <Button {...buttonProps}>{buttonProps.children}</Button>
        <Modal>
          <Dialog>
            {({ close }) => (
              <>
                <DialogCloseBtn close={close} />
                <Heading slot="title">{title ?? ''}</Heading>
                {//@ts-ignore 
                  React.cloneElement(children, { onSuccess: close, onCancel: close })
                }
              </>
            )}
          </Dialog>
        </Modal>
      </DialogTrigger>
    )
}

export const ConditionalModal = (
  { title, isOpen, setOpen, children }:
    BaseProps & { isOpen: boolean, setOpen: (open: boolean) => void }
) => {
  const close = () => setOpen(false)
  const isTouch = useMemo(() => isTouchDevice(), [])

  return isTouch ? (
    <BottomSheet title={title} isOpen={isOpen} setOpen={setOpen}>
      {//@ts-ignore 
        React.cloneElement(children, { onSuccess: close, onCancel: close })
      }
    </BottomSheet>
  )
    : (
      <Modal isOpen={isOpen} onOpenChange={setOpen}>
        <Dialog>
          <DialogCloseBtn close={close} />
          <Heading slot="title">{title ?? ''}</Heading>
          {//@ts-ignore 
            React.cloneElement(children, { onSuccess: close, onCancel: close })
          }
        </Dialog>
      </Modal>
    )
}
