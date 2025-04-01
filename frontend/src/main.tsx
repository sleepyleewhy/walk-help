import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import SocketProvider from './context/socketProvider.tsx'
import './index.css'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SocketProvider>
    <App />
    <Toaster/>
    </SocketProvider>
  </StrictMode>,
)
