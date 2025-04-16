import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProductById } from '@/lib/product';
import AddToCartButton from '@/components/products/AddToCartButton';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }
  
  // Calculate discount price if applicable
  const discountedPrice = product.discount 
  ? product.price - (product.price * product.discount / 100)
  : null;
  
  console.log(product.images)
  console.log(product.name)
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="relative h-96 rounded-lg overflow-hidden">
          {product.images ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="mb-4">
            <span className="text-sm text-gray-500">Category: {product.category.name}</span>
          </div>
          
          <div className="mb-6">
            {product.discount ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">${discountedPrice?.toFixed(2)}</span>
                <span className="text-lg text-gray-500 line-through">${product.price.toFixed(2)}</span>
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  {product.discount}% OFF
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{product.description || 'No description available.'}</p>
          </div>
          
          <div className="mb-4">
            <span className={`${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>
          
          {product.stock > 0 && (
            <AddToCartButton productId={product.id} />
          )}
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        {product.reviews.length > 0 ? (
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="border p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment || 'No comment provided.'}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet for this product.</p>
        )}
      </div>
    </div>
  );
} 