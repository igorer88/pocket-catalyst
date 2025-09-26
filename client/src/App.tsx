import { useTheme } from './hooks/useTheme'
import AppRouter from './router/AppRouter'

import './App.css'

function App() {
  useTheme()

  return <AppRouter />
}

export default App
