import { Slide, ToastContainer } from 'react-toastify'
import { BtnIcon } from './btn-icon'
import { CloseIcon } from './svg'
import 'react-toastify/dist/ReactToastify.css'

const CloseBtn = ({ closeToast }: { closeToast: (e: React.MouseEvent<HTMLElement>) => void }) => {
  return <BtnIcon onClick={closeToast} content={<CloseIcon />}/>
}

export const ToastContainerDefault = () => <ToastContainer
  position='bottom-right'
  hideProgressBar={true}
  transition={Slide}
  theme="light"
  closeButton={CloseBtn}
/>
