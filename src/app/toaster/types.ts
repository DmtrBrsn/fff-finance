export type Toast = {
  time: number
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  action?: Function
  actionLabel?: string
}

export type AddToast = Omit<Toast, 'time'>
