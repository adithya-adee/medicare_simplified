import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCategoryById } from '@/lib/category';
import { getProductsByCategory } from '@/lib/product';

interface CategoryPageProps {
  params: {
    id: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategoryById(params.id);
  
  if (!category) {
    notFound();
  }
  
  const products = await getProductsByCategory(category.id);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600">{category.description}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link 
            key={product.id} 
            href={`/products/${product.id}`}
            className="group"
          >
            <div className="border rounded-lg overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md">
              <div className="relative h-48 w-full bg-gray-100">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-1 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h2>
                
                <div className="flex items-center gap-2 mb-2">
                  {product.discount ? (
                    <>
                      <span className="font-bold">
                        ${(product.price - (product.price * product.discount / 100)).toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded-full">
                        {product.discount}% OFF
                      </span>
                    </>
                  ) : (
                    <span className="font-bold">${product.price.toFixed(2)}</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                  <span className="text-xs text-gray-500">
                    View Details →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No products found in this category.</p>
        </div>
      )}
    </div>
  );
} 