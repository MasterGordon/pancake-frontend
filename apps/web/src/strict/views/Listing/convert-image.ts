import { Image } from 'image-js'

export const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

const removeBg = async (image: Image) => {
  // get top left pixel
  const topLeftPixel = image.getPixelXY(0, 0)
  if (topLeftPixel[3] === 0) {
    return
  }
  for (let i = 0; i < image.size; i++) {
    const pixelColor = image.getPixel(i)
    if (
      colorMatches(pixelColor, topLeftPixel, 25) &&
      (image.getPixel(i + 1)[3] === 0 ||
        image.getPixel(i - 1)[3] === 0 ||
        i % image.width === 0 ||
        (i + 1) % image.width === 0)
    ) {
      image.setPixel(i, [0, 0, 0, 0])
    }
  }
  for (let i = image.size; i > 0; i--) {
    const pixelColor = image.getPixel(i)
    if (
      colorMatches(pixelColor, topLeftPixel, 25) &&
      (image.getPixel(i + 1)[3] === 0 ||
        image.getPixel(i - 1)[3] === 0 ||
        i % image.width === 0 ||
        (i + 1) % image.width === 0)
    ) {
      image.setPixel(i, [0, 0, 0, 0])
    }
  }
}

function colorMatches(color1: number[], color2: number[], threshold: number) {
  for (let i = 0; i < 3; i++) {
    if (Math.abs(color1[i] - color2[i]) > threshold) {
      return false
    }
  }
  return true
}

export const convertImage = async (file: File) => {
  const image = await Image.load(await toBase64(file))
  const resized = image.resize({ width: 256, height: 256 })
  removeBg(resized)
  return resized.toBase64()
}
