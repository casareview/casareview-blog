import {stegaClean} from '@sanity/client/stega'
import {Image} from 'next-sanity/image'
import {getImageDimensions} from '@sanity/asset-utils'
import {urlForImage} from '@/sanity/lib/utils'

interface CoverImageProps {
  image: any
  priority?: boolean
}

export default function CoverImage(props: CoverImageProps) {
  const {image: source, priority} = props
  const image = source?.asset?._ref ? (
    <Image
      className="object-cover rounded-3xl h-[300px] lg:h-[400px]"
      width={getImageDimensions(source).width}
      height={getImageDimensions(source).height}
      alt={stegaClean(source?.alt) || ''}
      src={urlForImage(source)?.url() as string}
      priority={priority}
    />
  ) : null

  return <div className="relative ">{image}</div>
}
