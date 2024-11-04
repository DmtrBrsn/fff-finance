import { useToasterStore } from "./toaster-store"
import { AddToast } from "./types"

const addToast = ({ message, type = 'info', duration = 5000, action, actionLabel }: AddToast) => {
  const time = new Date().getTime()
  useToasterStore.getState().push({
    time,
    message,
    type,
    duration,
    action,
    actionLabel
  })

  if (duration > 0) {
    setTimeout(() => {
      useToasterStore.getState().remove(time)
    }, duration)
  }
}

/** Default type is 'info' */
const toast = (message: string, actionLabel?: string, action?: Function, duration?: number) => {
  addToast({ message, action, actionLabel, duration })
}
toast.error = (message: string, actionLabel?: string, action?: Function, duration?: number) => {
  addToast({ message, type: 'error', action, actionLabel, duration })
}
toast.warning = (message: string, actionLabel?: string, action?: Function, duration?: number) => {
  addToast({ message, type: 'warning', action, actionLabel, duration })
}
toast.info = (message: string, actionLabel?: string, action?: Function, duration?: number) => {
  addToast({ message, type: 'info', action, actionLabel, duration })
}
toast.success = (message: string, actionLabel?: string, action?: Function, duration?: number) => {
  addToast({ message, type: 'success', action, actionLabel, duration })
}

export { addToast, toast }
