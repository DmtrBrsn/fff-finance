import { useToasterStore } from "../toaster-store"
import { AddToast } from "./types"
import { toastDefaultDuration } from "./toaster-constants"

const addToast = ({ message, type = 'info', duration = toastDefaultDuration, action, actionLabel }: AddToast) => {
  const time = new Date().getTime()
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

export { addToast, toast }
