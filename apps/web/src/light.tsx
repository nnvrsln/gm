import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import './theme-light.css'

/**
 * Примерка белой версии сайта. http://localhost:5173/light.html
 *
 * Заказчик попросил посмотреть страницу в белом. Здесь рендерится **тот же
 * `App`**, без единой копии секции: тема целиком лежит в `theme-light.css` и
 * включается атрибутом на обёртке. Значит примерка не разъедется с сайтом —
 * любая правка контента видна тут же в обоих вариантах.
 *
 * В прод-сборку страница не попадает: Vite берёт единственной точкой входа
 * `index.html`.
 */

const container = document.getElementById('root')
if (!container) throw new Error('Не найден #root')

createRoot(container).render(
  <StrictMode>
    <div data-theme="light">
      <App />
    </div>
  </StrictMode>,
)
