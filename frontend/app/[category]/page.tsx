// app/[category]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { sanityFetch } from '@/sanity/lib/live'
import { postsByCategoryQuery } from '@/sanity/lib/queries'
import { defineQuery } from 'next-sanity'
import { Post } from '@/app/components/Posts'

type Props = {
  params: Promise<{ category: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  
  const { data: categoryData } = await sanityFetch({
    query: defineQuery(`*[_type == "category" && slug.current == $category][0]`),
    params: { category: params.category },
  });
  
  if (!categoryData) {
    return { title: 'Categoria não encontrada' };
  }

  return {
    title: `${categoryData.title} - Reviews e Guias | CasaReview`,
    description: categoryData.description || `Reviews completos de produtos de ${categoryData.title.toLowerCase()}.`,
  };
}

export default async function CategoryPage(props: Props) {
  const params = await props.params;
  
  const { data: categoryData } = await sanityFetch({
    query: defineQuery(`*[_type == "category" && slug.current == $category][0]`),
    params: { category: params.category },
  });

  if (!categoryData) {
    return notFound();
  }

  const { data: posts } = await sanityFetch({
    query: postsByCategoryQuery,
    params: { category: params.category },
  });

  return (
    <div className="container py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {categoryData.title}
        </h1>
        {categoryData.description && (
          <p className="text-lg text-gray-600">
            {categoryData.description}
          </p>
        )}
      </div>

      <div className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts?.map((post: any) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}