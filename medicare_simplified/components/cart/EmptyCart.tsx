import Link from 'next/link';

export default function EmptyCart() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
      <p className="text-gray-600 mb-6">
        Looks like you haven't added any products to your cart yet.
      </p>
      <Link
        href="/categories"
        className="inline-block bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
      >
        Browse Products
      </Link>
    </div>
  );
} 