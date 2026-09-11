import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import { jsonLdScripts } from './src/seo/jsonLd'

/**
 * Адрес сайта. Нужен абсолютным: canonical и Open Graph относительных
 * ссылок не понимают. Домена от заказчика пока нет (см. `07-NEXT.md`, п. 6),
 * поэтому по умолчанию стоит адрес деплоя на Vercel — придёт свой, меняется
 * одной переменной `VITE_SITE_URL`.
 *
 * Префикс `VITE_` здесь безопасен: это публичный адрес страницы, а не
 * секрет. Правило «секреты не помечать VITE_» из CLAUDE.md к нему не
 * относится.
 */
const SITE_URL = (process.env.VITE_SITE_URL ?? 'https://gm-dusky.vercel.app').replace(/\/$/, '')

const NL = String.fromCharCode(10)

/**
 * Абсолютные адреса в canonical и Open Graph. В самом `index.html` они
 * записаны плейсхолдером `%SITE_URL%`, чтобы файл не зависел от домена.
 */
function siteUrlPlugin(): Plugin {
  return {
    name: 'gm-site-url',
    transformIndexHtml(html) {
      return html.replaceAll('%SITE_URL%', SITE_URL)
    },
  }
}

/**
 * Микроразметка Schema.org вставляется в HTML на сборке, а не рисуется
 * React'ом: страница — SPA, и разметка из JS видна не всем роботам.
 * Содержимое собирается из тех же данных, что кормят страницу, — см.
 * `src/seo/jsonLd.ts`.
 */
function jsonLdPlugin(): Plugin {
  return {
    name: 'gm-json-ld',
    transformIndexHtml(html) {
      return html.replace('</head>', jsonLdScripts(SITE_URL) + NL + '  </head>')
    },
  }
}

/**
 * robots.txt и sitemap.xml генерируются, а не лежат в `public/`: в обоих
 * стоит абсолютный адрес сайта, и с файлами в public его пришлось бы
 * править при каждой смене домена. Здесь источник один — SITE_URL.
 */
function robotsPlugin(): Plugin {
  return {
    name: 'gm-robots',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: ['User-agent: *', 'Allow: /', '', 'Sitemap: ' + SITE_URL + '/sitemap.xml', ''].join(NL),
      })
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          '  <url>',
          '    <loc>' + SITE_URL + '/</loc>',
          '    <changefreq>weekly</changefreq>',
          '    <priority>1.0</priority>',
          '  </url>',
          '</urlset>',
          '',
        ].join(NL),
      })
    },
  }
}

// Точка входа одна — apps/web/index.html, Vite находит её сам. Макетные
// страницы (`имя.html` + `src/имя.tsx`) в прод-сборку не попадают.
//
// `@gm/shared` подключён как workspace-пакет и лежит симлинком в
// node_modules. Vite обрабатывает такие пакеты как исходники, поэтому он
// отдаёт из них TypeScript без отдельной сборки — собственного шага
// компиляции у `packages/shared` нет и заводить его не нужно.
export default defineConfig({
  plugins: [react(), tailwindcss(), siteUrlPlugin(), jsonLdPlugin(), robotsPlugin()],

  // Второй точкой входа временно добавлена примерка белой темы: заказчик
  // попросил посмотреть сайт в белом, а с локального адреса ссылку ему не
  // отправить. Живёт по /light.html рядом с основной страницей.
  //
  // Это отступление от правила «макетные страницы в прод-сборку не
  // попадают». Когда по цвету решат, строку `light` отсюда убрать вместе с
  // `light.html`, `src/light.tsx` и `src/theme-light.css` — на основную
  // страницу они не влияют, светлая тема подключается только своей точкой
  // входа.
  build: {
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL('./index.html', import.meta.url)),
        light: fileURLToPath(new URL('./light.html', import.meta.url)),
      },
    },
  },
})
