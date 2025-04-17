import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedProducts() {
  console.log('Starting product seeding...');

  // Check if we already have any categories
  const categoryCount = await prisma.category.count();
  
  // Add a sample category if none exist
  let categoryId: string;
  
  if (categoryCount === 0) {
    console.log('Creating sample category...');
    const category = await prisma.category.create({
      data: {
        name: 'General Medication',
        description: 'Common medical products and medications',
        image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      }
    });
    categoryId = category.id;
    console.log(`Created category with ID: ${categoryId}`);
  } else {
    // Get the first category ID
    const category = await prisma.category.findFirst();
    categoryId = category!.id;
    console.log(`Using existing category with ID: ${categoryId}`);
  }

  // Check if we have any products
  const productCount = await prisma.product.count();
  
  if (productCount > 0) {
    console.log(`${productCount} products already exist. Skipping seed.`);
    return;
  }

  // Sample products data
  const sampleProducts = [
    {
      name: 'Acetaminophen 500mg',
      description: 'Pain reliever and fever reducer',
      price: 6.99,
      stock: 100,
      images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'],
      featured: true,
      discount: 5,
      categoryId,
    },
    {
      name: 'Ibuprofen 200mg',
      description: 'Anti-inflammatory pain reliever',
      price: 8.99,
      stock: 85,
      images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'],
      featured: false,
      discount: null,
      categoryId,
    },
    {
      name: 'Digital Thermometer',
      description: 'Accurate temperature measurement',
      price: 12.50,
      stock: 30,
      images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'],
      featured: true,
      discount: 10,
      categoryId,
    },
    {
      name: 'First Aid Kit',
      description: 'Complete emergency kit with bandages and antiseptics',
      price: 24.99,
      stock: 20,
      images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'],
      featured: true,
      discount: null,
      categoryId,
    },
    {
      name: 'Blood Pressure Monitor',
      description: 'Digital device for measuring blood pressure',
      price: 49.99,
      stock: 15,
      images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'],
      featured: false,
      discount: 15,
      categoryId,
    },
  ];

  // Create products
  console.log('Creating sample products...');
  for (const product of sampleProducts) {
    await prisma.product.create({ data: product });
    console.log(`Created product: ${product.name}`);
  }

  console.log('Product seeding completed!');
}

async function main() {
  try {
    await seedProducts();
  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script immediately if called directly
if (require.main === module) {
  main();
}

// Export for importing elsewhere
export { seedProducts }; 