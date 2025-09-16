import type {Metadata, ResolvingMetadata} from 'next'
import {notFound} from 'next/navigation'
import {type PortableTextBlock} from 'next-sanity'
import {Suspense} from 'react'

import Avatar from '@/app/components/Avatar'
import CoverImage from '@/app/components/CoverImage'
import {MorePosts} from '@/app/components/Posts'
import PortableText from '@/app/components/PortableText'
import {sanityFetch} from '@/sanity/lib/live'

import {resolveOpenGraphImage} from '@/sanity/lib/utils'
import {generateBlogPostSchema} from '@/lib/schema'
import Breadcrumbs from '@/app/components/Breadcrumbs'
import {postPagesCategorySlugs, postByCategoryQuery} from '@/sanity/lib/queries'

interface PostWithSEO {
  _id: string
  title: string
  slug: string
  excerpt?: string
  metaTitle?: string
  metaDescription?: string
  category?: string
  tags?: string[]
  coverImage?: {
    asset?: {url?: string}
    alt?: string
  }
  author?: {
    firstName?: string
    lastName?: string
  }
  date?: string
  content?: any[]
}

type Props = {
  params: Promise<{category: string; slug: string}>
}

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: postPagesCategorySlugs, // Mudança aqui
    perspective: 'published',
    stega: false,
  })
  return data
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params
  const {data: post} = await sanityFetch({
    query: postByCategoryQuery, // Mudança aqui
    params,
    stega: false,
  })

  if (!post) {
    return {
      title: 'Post não encontrado',
      description: 'O post que você procura não foi encontrado.',
    }
  }

  const previousImages = (await parent).openGraph?.images || []
  const ogImage = resolveOpenGraphImage(post?.coverImage)
  const authorName =
    post?.author?.firstName && post?.author?.lastName
      ? `${post.author.firstName} ${post.author.lastName}`
      : ''

  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.excerpt || ''

  return {
    title,
    description,
    keywords: post.tags,
    authors: authorName ? [{name: authorName}] : [],
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.date,
      authors: authorName ? [authorName] : undefined,
      section: post.category,
      tags: post.tags,
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: authorName ? `@${authorName.replace(' ', '')}` : undefined,
      images: ogImage ? [ogImage] : [],
    },
    alternates: {
      canonical: `/${params.category}/${post.slug}`,
    },
  } satisfies Metadata
}

export default async function PostPage(props: Props) {
  
  const params = await props.params
  const [{data: post}] = await Promise.all([sanityFetch({query: postByCategoryQuery, params})])

  if (!post?._id) {
    return notFound()
  }

  
const schema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: post.excerpt || '',
  author: {
    '@type': 'Person',
    name: post.author?.firstName && post.author?.lastName 
      ? `${post.author.firstName} ${post.author.lastName}` 
      : 'CasaReview',
  },
  publisher: {
    '@type': 'Organization',
    name: 'CasaReview'
  },
  datePublished: post.date,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://www.casareview.com.br/${params.category}/${post.slug}`
  }
};
  const breadcrumbItems = [
    {label: 'Home', href: '/'},
    {
      label: params.category.charAt(0).toUpperCase() + params.category.slice(1),
      href: `/${params.category}`,
    },
    {label: post.title, href: `/${params.category}/${post.slug}`},
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}}
      />

      <div className="">
        <div className="container my-12 lg:my-24 flex justify-center  gap-12">
          <div>
            <div className="pb-6 grid lg:flex lg:flex-col lg:justify-center items-center gap-6 mb-6 border-b border-gray-100">
              <Breadcrumbs items={breadcrumbItems} />
              <div className="max-w-3xl flex flex-col gap-6">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-5xl lg:text-center">
                  {post.title}
                </h1>
              </div>
              <div className="max-w-3xl flex gap-4 items-center">
                {post.author && post.author.firstName && post.author.lastName && (
                  <Avatar person={post.author} date={post.date} />
                )}
              </div>
            </div>
            <article className="gap-6 grid max-w-4xl rounded-3xl">
              <div className="rounded-[3rem]">
                {post?.coverImage && <CoverImage image={post.coverImage} priority />}
              </div>
              {post.content?.length && (
                <PortableText className="max-w-2xl" value={post.content as PortableTextBlock[]} />
              )}
            </article>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="container py-12 lg:py-24 grid gap-12">
          <aside>
            <Suspense>{await MorePosts({skip: post._id, limit: 2})}</Suspense>
          </aside>
        </div>
      </div>
    </>
  )
}
