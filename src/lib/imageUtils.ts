const WEB_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml']

const isHeic = (file: File) =>
  file.type === 'image/heic' ||
  file.type === 'image/heif' ||
  /\.heic$/i.test(file.name) ||
  /\.heif$/i.test(file.name)

export async function toWebImage(file: File): Promise<File> {
  if (WEB_IMAGE_TYPES.includes(file.type)) return file
  if (!isHeic(file)) return file

  const heic2any = (await import('heic2any')).default
  const blob = (await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 })) as Blob
  const baseName = file.name.replace(/\.(heic|heif)$/i, '')
  return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' })
}
