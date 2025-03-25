import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Tester from './tester.jsx'
import Trial from './trial.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Trial />
  </StrictMode>,
)
