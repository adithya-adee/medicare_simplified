import Image from 'next/image';
import Link from 'next/link';
import { getAllCategories } from '@/lib/category';

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Product Categories</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link 
            key={category.id} 
            href={`/categories/${category.id}`}
            className="group"
          >
            <div className="border rounded-lg overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md">
              <div className="relative h-48 w-full bg-gray-200">
                { category.image  ? (
                  <Image
                    src={category.image}
                    alt={category.name}
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
                <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {category.description}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No categories found.</p>
        </div>
      )}
    </div>
  );
} 