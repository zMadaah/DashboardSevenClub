import { BrowserRouter } from 'react-router-dom'

import { AuthProvider } from './features/auth/AuthContext'
import { AppRouter } from './router'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuthProvider>
  )
}