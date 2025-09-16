import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { sanityFetch } from '@/sanity/lib/live'
import { postsByCategoryQuery } from '@/sanity/lib/queries'
import { Post } from '@/app/components/Posts'

type Props = {
  params: Promise<{ category: string }>
}

// Lista de categorias válidas
const VALID_CATEGORIES = ['eletrodomesticos', 'cozinha', 'casa', 'reviews'];

const CATEGORY_TITLES = {
  eletrodomesticos: 'Eletrodomésticos',
  cozinha: 'Cozinha', 
  casa: 'Casa',
  reviews: 'Reviews'
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const categoryTitle = CATEGORY_TITLES[params.category as keyof typeof CATEGORY_TITLES];
  
  if (!categoryTitle) {
    return { title: 'Categoria não encontrada' };
  }

  return {
    title: `${categoryTitle} - Reviews e Guias | CasaReview`,
    description: `Reviews completos de produtos de ${categoryTitle.toLowerCase()}. Análises detalhadas, comparativos e recomendações de compra.`,
  };
}

export default async function CategoryPage(props: Props) {
  const params = await props.params;
  
  if (!VALID_CATEGORIES.includes(params.category)) {
    return notFound();
  }

  const { data: posts } = await sanityFetch({
    query: postsByCategoryQuery,
    params: { category: params.category },
  });

  const categoryTitle = CATEGORY_TITLES[params.category as keyof typeof CATEGORY_TITLES];

  return (
    <div className="container py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {categoryTitle}
        </h1>
        <p className="text-lg text-gray-600">
          Reviews e análises completas de produtos para {categoryTitle.toLowerCase()}
        </p>
      </div>

      <div className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts?.map((post: any) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}