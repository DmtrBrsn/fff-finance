import { useToasterStore } from "../toaster-store"
import { AddToast, type Toast } from "./types"
import { toastDefaultDuration } from "./toaster-constants"
import { Dates } from '../../../shared/lib/utils'

const addToast = ({ message, type = 'info', duration = toastDefaultDuration, action, actionLabel }: AddToast) => {
  const time = Dates.nowNum()
  useToasterStore.getState().add({
    time,
    message,
    type,
    duration,
    action,
    actionLabel
  })
  return time
}

/** Default type is 'info' */
const toast = (message: string, actionLabel?: string, action?: Function, duration?: number) =>
  addToast({ message, action, actionLabel, duration })
toast.error = (message: string, actionLabel?: string, action?: Function, duration?: number) =>
  addToast({ message, type: 'error', action, actionLabel, duration })
toast.warning = (message: string, actionLabel?: string, action?: Function, duration?: number) =>
  addToast({ message, type: 'warning', action, actionLabel, duration })
toast.info = (message: string, actionLabel?: string, action?: Function, duration?: number) =>
  addToast({ message, type: 'info', action, actionLabel, duration })
toast.success = (message: string, actionLabel?: string, action?: Function, duration?: number) =>
  addToast({ message, type: 'success', action, actionLabel, duration })

const removeOnTimeout = (toast: Toast) => {
  if (toast.duration > 0) {
    const timer = setTimeout(() => {
      useToasterStore.getState().remove(toast.time)
    }, toast.duration)
    return () => clearTimeout(timer)
  }
}

export { addToast, toast, removeOnTimeout }
