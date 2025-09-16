import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

import {sanityFetch} from '@/sanity/lib/live'
import {morePostsQuery, allPostsQuery} from '@/sanity/lib/queries'
import {Post as PostType, AllPostsQueryResult} from '@/sanity.types'
import DateComponent from '@/app/components/Date'
import OnBoarding from '@/app/components/Onboarding'
import Avatar from '@/app/components/Avatar'
import {createDataAttribute} from 'next-sanity'

const Post = ({post}: {post: AllPostsQueryResult[number]}) => {
  const {_id, title, slug, excerpt, date, author, coverImage} = post

  const attr = createDataAttribute({
    id: _id,
    type: 'post',
    path: 'title',
  })

  return (
    <article
      data-sanity={attr()}
      key={_id}
      className="group col-span-1 rounded-2xl p-6 bg-[#F5F5F5] flex flex-col justify-between transition-colors hover:bg-white relative overflow-hidden"
    >
      <Link className="hover:text-brand underline transition-colors" href={`/${post.category}/${post.slug}`}>
        <span className="absolute inset-0 z-10" />
      </Link>
      
      {/* Imagem destaque no topo do card */}
      {coverImage && (
        <div className="relative w-full h-48 ">
          <Image
            src={urlFor(coverImage).width(600).height(300).url()}
            alt={coverImage.alt || title || ''}
            fill
            className="object-cover rounded-2xl"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      
      <div className="pt-6 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-2xl font-bold mb-4 leading-tight">{title}</h3>
          <p className="line-clamp-3 text-sm leading-6 text-gray-600 max-w-[70ch]">{excerpt}</p>
        </div>
        
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          {author && author.firstName && author.lastName && (
            <div className="flex items-center">
              <Avatar person={author} small={true} />
            </div>
          )}
          <time className="text-gray-500 text-xs font-mono" dateTime={date}>
            <DateComponent dateString={date} />
          </time>
        </div>
      </div>
    </article>
  )
}

const Posts = ({
  children,
  heading,
  subHeading,
}: {
  children: React.ReactNode
  heading?: string
  subHeading?: string
}) => (
  <div>
    {heading && (
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
        {heading}
      </h2>
    )}
    {subHeading && <p className="mt-2 text-lg leading-8 text-gray-600">{subHeading}</p>}
    <div className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{children}</div>
  </div>
)

export const MorePosts = async ({skip, limit}: {skip: string; limit: number}) => {
  const {data} = await sanityFetch({
    query: morePostsQuery,
    params: {skip, limit},
  })

  if (!data || data.length === 0) {
    return null
  }

  return (
    <Posts heading={`Recent Posts (${data?.length})`}>
      {data?.map((post: any) => (
        <Post key={post._id} post={post} />
      ))}
    </Posts>
  )
}

export const AllPosts = async () => {
  const {data} = await sanityFetch({query: allPostsQuery})

  if (!data || data.length === 0) {
    return <OnBoarding />
  }

  return (
    <Posts
      heading="Veja todos os Reviews"
      subHeading={`${data.length === 1 ? 'Os melhores reviews!' : `${data.length} posts`} `}
    >
      {data.map((post: any) => (
        <Post key={post._id} post={post} />
      ))}
    </Posts>
  )
}

export { Post };