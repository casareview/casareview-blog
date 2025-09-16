interface PostSchema {
  title: string
  slug: string
  excerpt?: string | null
  coverImage?: {
    asset?: {url?: string} | null
    alt?: string | null
  } | null
  author?: {
    firstName?: string | null
    lastName?: string | null
  } | null
  date?: string | null
  category?: string | null
}

export function generateBlogPostSchema(post: PostSchema, category: string) {
  const authorName =
    post.author?.firstName && post.author?.lastName
      ? `${post.author.firstName} ${post.author.lastName}`
      : 'CasaReview'

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.excerpt || '',
    'image': post.coverImage?.asset?.url || '',
    'author': {
      '@type': 'Person',
      'name': authorName,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'CasaReview',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://www.casareview.com.br/logo.png',
      },
    },
    'datePublished': post.date,
    'dateModified': post.date,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://www.casareview.com.br/${category}/${post.slug}`,
    },
  }
}
