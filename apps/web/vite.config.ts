import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import { jsonLdScripts } from './src/seo/jsonLd'

const SITE_URL = (process.env.VITE_SITE_URL ?? 'https://gm-dusky.vercel.app').replace(/\/$/, '')

const NL = String.fromCharCode(10)

function siteUrlPlugin(): Plugin {
  return {
    name: 'gm-site-url',
    transformIndexHtml(html) {
      return html.replaceAll('%SITE_URL%', SITE_URL)
    },
  }
}

function jsonLdPlugin(): Plugin {
  return {
    name: 'gm-json-ld',
    transformIndexHtml(html) {
      return html.replace('</head>', jsonLdScripts(SITE_URL) + NL + '  </head>')
    },
  }
}

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

export default defineConfig({
  plugins: [react(), tailwindcss(), siteUrlPlugin(), jsonLdPlugin(), robotsPlugin()],

  build: {
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL('./index.html', import.meta.url)),
        light: fileURLToPath(new URL('./light.html', import.meta.url)),
      },
    },
  },
})
