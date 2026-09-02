import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Конфиг намеренно пустой сверх двух плагинов. Точка входа одна —
// apps/web/index.html, и Vite находит её сам.
//
// `@gm/shared` подключён как workspace-пакет и лежит симлинком в
// node_modules. Vite обрабатывает такие пакеты как исходники, поэтому он
// отдаёт из них TypeScript без отдельной сборки — собственного шага
// компиляции у `packages/shared` нет и заводить его не нужно.
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
