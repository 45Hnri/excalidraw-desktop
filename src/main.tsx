import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TooltipProvider } from './components/ui/tooltip.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
        <TooltipProvider>
            <App/>
        </TooltipProvider>
  </React.StrictMode>,
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
