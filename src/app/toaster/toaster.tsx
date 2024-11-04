import { Button, ButtonIcon } from "@shared/react-aria"
import { useToasterStore } from "./toaster-store"
import { CheckCircleIcon, CloseIcon, ErrorIcon, Info, WarningIcon } from "@shared/svg"
import { Toast } from "./types"
import './toaster.css'

export const Toaster = () => {
  const { toasts } = useToasterStore()
  return (
    <div className="toaster">
      {toasts.map((t) => <SingleToast key={t.time} {...t} />)}
    </div>
  )
}

const SingleToast = (
  { time, message, type, ...toast }: Toast) => {
  const { remove } = useToasterStore()

  const removeToast = () => remove(time)

  const doAction = () => {
    toast.action && toast.action()
    removeToast()
  }

  return (
    <div key={time} className={'toast' + (type ? ' ' + type : '')}>
      <div className='icon'>
        {type === 'warning' ?
          <WarningIcon /> :
          type === 'error' ?
            <ErrorIcon /> :
            type === 'success' ?
              <CheckCircleIcon /> :
              <Info />}
      </div>
      <div className="message">
        {message}
      </div>
      {toast.action && <>
        <Button variant="transparent" onPress={() => toast.action && doAction()}>{toast.actionLabel ?? 'Action'}</Button>
      </>}
      <ButtonIcon size="l" onPress={() => remove(time)}><CloseIcon /></ButtonIcon>
    </div>
  )
}
