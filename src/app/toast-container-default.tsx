import { Slide, ToastContainer } from 'react-toastify'
import { CloseIcon } from '../shared/svg'
import 'react-toastify/dist/ReactToastify.css'
import { ButtonIcon } from '../shared/react-aria'
import { PressEvent } from 'react-aria-components'

const CloseBtn = ({ closeToast }: { closeToast: (e: PressEvent) => void }) => {
  return <ButtonIcon onPress={closeToast} ><CloseIcon /></ButtonIcon>
}

export const ToastContainerDefault = () => <ToastContainer
  position='bottom-right'
  hideProgressBar={true}
  transition={Slide}
  theme="light"
  //@ts-ignore
  closeButton={CloseBtn}
/>
