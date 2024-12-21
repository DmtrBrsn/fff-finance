
import { Button, ButtonIcon } from '@shared/react-aria'
import { WarningIcon, ErrorIcon, CheckCircleIcon, Info, CloseIcon } from '@shared/svg'
import { useToasterStore } from '../toaster-store'
import { Toast } from '../lib/types'
import './toaster.css'

export const Toaster = () => {
  const { shown: toasts } = useToasterStore()
  return (
    <div className="toaster">
      {toasts.map((t) => <SingleToast key={t.time} {...t} />)}
    </div>
  )
}

const SingleToast = (
  { time, message, type, ...toast }: Toast
) => {
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
      <div className="message">{message}</div>
      {toast.action &&
        <Button variant="transparent" onPress={doAction}>{toast.actionLabel ?? 'Action'}</Button>
      }
      <ButtonIcon size="l" onPress={removeToast}><CloseIcon /></ButtonIcon>
    </div>
  )
}
