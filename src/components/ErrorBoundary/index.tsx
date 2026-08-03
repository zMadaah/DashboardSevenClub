import { Component, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // Quando existir um serviço de monitoramento (Sentry, etc.), reportar aqui.
    console.error('Erro não tratado na aplicação:', error, info.componentStack)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-richBlack px-4 text-center">
          <p className="text-lg font-semibold text-ceilingWhite">Algo deu errado</p>
          <p className="max-w-sm text-sm text-laurelLeaf">
            Ocorreu um erro inesperado ao carregar esta tela. Tente recarregar a página.
          </p>
          <button
            onClick={this.handleReload}
            className="mt-2 rounded-lg bg-pear px-4 py-2 text-sm font-medium text-richBlack"
          >
            Recarregar
          </button>
        </div>
      )
    }

    return this.props.children
  }
}