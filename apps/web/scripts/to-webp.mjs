// Перегоняет PNG из src/assets в WebP. Исходные снимки приходят от заказчика
// по 1.5–2.8 МБ, а макет мобильный — три кадра секции «Для кого» тянули
// около 5 МБ трафика. Скрипт разовый, не часть сборки: гоняем руками, когда
// заказчик приносит новые ассеты, и коммитим результат.
//
//   node scripts/to-webp.mjs            # все PNG из src/assets
//   node scripts/to-webp.mjs a.png b.png
//
// Исходные PNG не удаляет — решение об удалении за владельцем.
import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ASSETS = path.resolve(import.meta.dirname, '../src/assets')
// 82 — потолок, за которым на этих снимках уже не видно разницы даже при
// сравнении в упор, а вес растёт вдвое.
const QUALITY = 82

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} КБ`

const args = process.argv.slice(2)
const files = args.length ? args.map((f) => path.basename(f)) : (await readdir(ASSETS)).filter((f) => f.endsWith('.png'))

let before = 0
let after = 0

for (const file of files) {
  const src = path.join(ASSETS, file)
  const out = src.replace(/\.png$/i, '.webp')

  const { size: srcSize } = await stat(src)
  const { size: outSize } = await sharp(src).webp({ quality: QUALITY, effort: 6 }).toFile(out)

  before += srcSize
  after += outSize
  console.log(`${file.padEnd(28)} ${kb(srcSize).padStart(9)} → ${kb(outSize).padStart(8)}  (-${Math.round((1 - outSize / srcSize) * 100)}%)`)
}

console.log(`\nИтого: ${kb(before)} → ${kb(after)} (-${Math.round((1 - after / before) * 100)}%)`)
