import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AudienceVariants } from './dev/AudienceVariants'
import './index.css'

const container = document.getElementById('root')
if (!container) throw new Error('Не найден #root')

createRoot(container).render(
  <StrictMode>
    <AudienceVariants />
  </StrictMode>,
)
