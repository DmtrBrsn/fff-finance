import { IconX } from '@tabler/icons-react'
import { ButtonIcon } from "../button-icon/button-icon"

export const DialogCloseBtn = ({ close }: { close: () => void }) => {
  return (
    <span className="close-btn-wrapper"><ButtonIcon size='l' onPress={close}><IconX /></ButtonIcon></span>
  )
}
