import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Плагин локального API и мост для DATABASE_URL отсюда убраны вместе с
// серверной частью: в этой версии проекта делается только макет, бэкенда нет.
// История — в docs/tz/05-STATE.md.
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
