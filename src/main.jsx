import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PartyApp from './components/PartyApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
