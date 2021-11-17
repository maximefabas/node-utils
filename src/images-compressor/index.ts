import path from 'path'
import fse from 'fs-extra'
import sharp from 'sharp'

const jpgExtensions = ['.jpg', '.jpeg']
const pngExtensions = ['.png']
const webpExtensions = ['.wepb']
const avifExtensions = ['.avif', '.avifs']
const heifExtensions = ['.heif', '.heifs', '.hif']
const allowedExtensions = [
  ...jpgExtensions,
  ...pngExtensions,
  ...webpExtensions,
  ...avifExtensions,
  ...heifExtensions
]

async function compressImages (
  src: string,
  preExtension: string,
  sizes: number[] = [],
  qualities: number[]|number = 100
) {
  
  if (!path.isAbsolute(src)) throw new Error('Source path must be absolute.')
  const files = await fse.readdir(src)
  
  for (const file of files) {
    const filePath = path.join(src, file)
    const isDirectory = (await fse.stat(filePath)).isDirectory()
    if (isDirectory) continue
    
    const ext = path.extname(file)
    const extIsAllowed = allowedExtensions.includes(ext.toLowerCase())
    if (!extIsAllowed) continue

    const nameWithPreExt = file.replace(new RegExp(`${ext}$`), '')
    let matchedPreExt = nameWithPreExt.split('.').slice(1).slice(-1)[0] ?? ''
    const preExt = matchedPreExt === '' ? matchedPreExt : `.${matchedPreExt}`
    if (preExt === preExtension) continue

    const name = nameWithPreExt.replace(new RegExp(`${preExtension}$`), '')
    for (const sizePos in sizes) {
      const size = sizes[sizePos]
      const dstFile = `${name}.${size}${preExtension}${ext}`
      const dstFilePath = path.join(src, dstFile)
      
      const quality = Array.isArray(qualities)
        ? qualities[sizePos] ?? qualities.slice(-1)[0] ?? 100
        : qualities
      const resized = sharp(filePath)
        .withMetadata()
        .resize(size, size, { fit: 'inside', withoutEnlargement: true })

      if (jpgExtensions.includes(ext)) await resized.jpeg({ quality }).toFile(dstFilePath)
      if (pngExtensions.includes(ext)) await resized.png({ quality }).toFile(dstFilePath)
      if (webpExtensions.includes(ext)) await resized.webp({ quality }).toFile(dstFilePath)
      if (avifExtensions.includes(ext)) await resized.avif({ quality }).toFile(dstFilePath)
      if (heifExtensions.includes(ext)) await resized.heif({ quality }).toFile(dstFilePath)
      
      console.log(dstFilePath)
      console.log('size', size)
      console.log('quality', quality)
      console.log('poids', (await fse.stat(dstFilePath)).size)
    }
  }
}

export default compressImages
