import imageUrlBuilder from '@sanity/image-url'
import {client} from './client'

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// Função auxiliar para gerar URLs otimizadas
export function getImageUrl(image: any, width?: number, height?: number) {
  if (!image) return null

  let urlBuilder = urlFor(image)

  if (width) urlBuilder = urlBuilder.width(width)
  if (height) urlBuilder = urlBuilder.height(height)

  return urlBuilder.url()
}
