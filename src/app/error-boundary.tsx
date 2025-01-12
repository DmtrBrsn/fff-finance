import { toast } from "@features/toaster"
import React, { ErrorInfo } from "react"

interface ErrorBoundaryProps {
  fallback: React.ReactNode
  children: React.ReactNode
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean }> {
  state = {hasError: false}

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.log(error, info)
    toast.error(error.message)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}
