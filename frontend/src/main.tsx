import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import SocketProvider from './context/socketProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SocketProvider>
    <App />
    </SocketProvider>
  </StrictMode>,
)
