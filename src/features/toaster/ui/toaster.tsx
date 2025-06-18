
import { Button, ButtonIcon } from '@shared/ui/react-aria'
import { WarningIcon, ErrorIcon, CheckCircleIcon, Info, CloseIcon } from '@shared/ui/svg'
import { useToasterStore } from '../toaster-store'
import { Toast } from '../lib/types'
import './toaster.css'

export const Toaster = () => {
  const { shown: toasts } = useToasterStore()
  if (toasts.length === 0) return null
  return (
    <div className="toaster" role="status" aria-live="polite">
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
      <div
        className='icon'
        role={type === 'error' ? 'alert' : 'status'}
        aria-label={`${type} notification`}
      >
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
