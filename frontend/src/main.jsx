import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

// Idini-deliver ng main.jsx lahat ng laman ng App.jsx sa loob ng id="root" na nasa index.html

createRoot(document.getElementById('root')).render( 
  <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
  </StrictMode>,
)
