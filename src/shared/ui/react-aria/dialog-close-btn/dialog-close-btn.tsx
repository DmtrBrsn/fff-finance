import { CloseIcon } from "@shared/ui/svg"
import { ButtonIcon } from "../button-icon/button-icon"

export const DialogCloseBtn = ({close}: {close: () => void}) => {
  return (
    <span className="close-btn-wrapper"><ButtonIcon onPress={close}><CloseIcon /></ButtonIcon></span>
  )
}
