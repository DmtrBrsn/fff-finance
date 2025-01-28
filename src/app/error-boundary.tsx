import { Component, createElement, FunctionComponent, ReactNode } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
  fallbackComponent: FunctionComponent<FallbackProps>
}

type FallbackProps = {
  error: Error | null
  resetErrorBoundary: () => void
}

type ErrorBoundaryState = {
  hasError: boolean
  error: Error | null
}

const initialState: ErrorBoundaryState = {
  hasError: false,
  error: null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state = initialState

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  // componentDidCatch(error: Error, info: ErrorInfo) {
  //   console.error(error, info)
  // }

  render() {
    if (this.state.hasError) {
      return createElement(this.props.fallbackComponent, {
        error: this.state.error,
        resetErrorBoundary: () => this.setState(initialState)
      })
    }
    return this.props.children
  }
}
