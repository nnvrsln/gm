import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LearningLayouts } from './dev/LearningLayouts'
import './index.css'

const container = document.getElementById('root')
if (!container) throw new Error('Не найден #root')

createRoot(container).render(
  <StrictMode>
    <LearningLayouts />
  </StrictMode>,
)
