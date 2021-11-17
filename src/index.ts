import compressImages from './images-compressor'
import path from 'path'

const src = path.join(__dirname, '../images')
const sizes = new Array(10)
  .fill(null)
  .map((e, i) => 200 + i * 200)
const qualities = sizes
  .map(size => 50 + 50 * (size - 200) / 1800)
  .map(qual => Math.floor(qual))
compressImages(src, '.comp', sizes, qualities)
