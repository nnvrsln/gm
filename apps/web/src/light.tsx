import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import './theme-light.css'

const container = document.getElementById('root')
if (!container) throw new Error('Не найден #root')

createRoot(container).render(
  <StrictMode>
    <div data-theme="light">
      <App />
    </div>
  </StrictMode>,
)
