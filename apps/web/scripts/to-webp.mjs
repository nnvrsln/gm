import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ASSETS = path.resolve(import.meta.dirname, '../src/assets')
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
