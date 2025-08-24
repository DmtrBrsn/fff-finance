
import { Button, ButtonIcon } from '@shared/ui/react-aria'
import { IconAlertTriangle, IconCircleCheck, IconExclamationCircle, IconInfoCircle, IconX } from '@tabler/icons-react'
import { Toast } from '../lib/types'
import { useToasterStore } from '../toaster-store'
import './toaster.css'

export const Toaster = () => {
  const toasts = useToasterStore(state => state.shown)
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
  const remove = useToasterStore(state => state.remove)
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
          <IconAlertTriangle /> :
          type === 'error' ?
            <IconExclamationCircle /> :
            type === 'success' ?
              <IconCircleCheck /> :
              <IconInfoCircle />}
      </div>
      <div className="message">{message}</div>
      {toast.action &&
        <Button variant="transparent" onPress={doAction}>{toast.actionLabel ?? 'Action'}</Button>
      }
      <ButtonIcon size="l" onPress={removeToast}><IconX /></ButtonIcon>
    </div>
  )
}
