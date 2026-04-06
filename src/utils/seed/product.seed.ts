import { db } from '../../configs/db';
import { products, categories, dealerAuthorizedProducts } from '../../db/schema';
import { logger } from '../logger';

// Updated coffee images
const COFFEE_IMAGES = [
  'https://upload.wikimedia.org/wikipedia/commons/c/c5/Roasted_coffee_beans.jpg',
  'https://goodthingsorganic.com.au/wp-content/uploads/2025/06/coffee-beans.jpg',
  'https://coffeeconnection.com.au/cdn/shop/articles/how-we-flavour-coffee-beans-behind-the-scenes-647291.png?v=1748601712&width=1100',
  'https://media01.stockfood.com/largepreviews/ODUyMzY5OA==/00274958-Coffee-beans-on-ground-coffee.jpg',
  'https://thumbs.dreamstime.com/b/coffee-beans-background-fresh-roasted-texture-arabica-bean-wallpaper-close-up-175977410.jpg',
  'https://tiimg.tistatic.com/fp/1/005/510/fresh-roasted-coffee-beans-311.jpg'
];

// Consistent Blueprint Options
const ROAST_OPTIONS = ['Light', 'Medium', 'Dark'];
const PROCESSING_OPTIONS = ['Washed', 'Natural', 'Honey'];
const BEAN_TYPE_OPTIONS = ['Whole Bean', 'Ground Espresso', 'Ground Filter'];

// Use a factory function to return a fresh object for each category, 
// preventing pass-by-reference mutation issues in the database driver.
const getSearchBlueprint = () => ({
  filters: [
    { label: 'Roast Level', options: ROAST_OPTIONS },
    { label: 'Processing Method', options: PROCESSING_OPTIONS },
    { label: 'Bean Type', options: BEAN_TYPE_OPTIONS }
  ]
});

const categoriesData = [
  {
    name: 'Uganda Coffee',
    slug: 'uganda-coffee',
    description: 'Bold, heavy-bodied coffee from the volcanic slopes.',
    imageUrl: COFFEE_IMAGES[0],
    searchBlueprint: getSearchBlueprint()
  },
  {
    name: 'Ethiopia Coffee',
    slug: 'ethiopia-coffee',
    description: 'Floral, bright, and complex coffees.',
    imageUrl: COFFEE_IMAGES[1],
    searchBlueprint: getSearchBlueprint()
  },
  {
    name: 'Rwanda Coffee',
    slug: 'rwanda-coffee',
    description: 'Sweet, syrupy, and fruit-forward coffees.',
    imageUrl: COFFEE_IMAGES[2],
    searchBlueprint: getSearchBlueprint()
  },
  {
    name: 'Kenya Coffee',
    slug: 'kenya-coffee',
    description: 'Intensely bright, wine-like coffees.',
    imageUrl: COFFEE_IMAGES[3],
    searchBlueprint: getSearchBlueprint()
  }
];

const randItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const seedProducts = async () => {
  try {
    logger.info('⏳ Seeding Categories and Products...');

    // Delete existing data to prevent ghost records
    await db.delete(dealerAuthorizedProducts);
    await db.delete(products);
    await db.delete(categories);

    const insertedCategories = await db.insert(categories).values(categoriesData).returning();
    logger.info(`✅ Inserted ${insertedCategories.length} Categories.`);

    const productsToInsert: any[] = [];
    const brands = ['Emara Roasters', 'Peak Coffee', 'Bean Foundry', 'Urban Brew'];

    // Helper function to generate products for a region
    const generateProductsForRegion = (categoryId: string, regionCode: string, estates: string[]) => {
      for (let i = 0; i < 15; i++) {
        const brand = randItem(brands);
        const estate = randItem(estates);
        const roast = randItem(ROAST_OPTIONS);
        const process = randItem(PROCESSING_OPTIONS);
        const beanType = randItem(BEAN_TYPE_OPTIONS);
        
        productsToInsert.push({
          name: `${brand} ${estate} ${roast} Roast`,
          sku: `${regionCode}-${brand.substring(0, 3).toUpperCase()}-${roast.substring(0, 3).toUpperCase()}-${i + 100}`,
          hsnCode: '09012110',
          categoryId: categoryId,
          description: `Premium ${roast.toLowerCase()} roast from the ${estate} region. Processed via the ${process.toLowerCase()} method.`,
          images: [COFFEE_IMAGES[i % COFFEE_IMAGES.length]], // Fixed: Properly mapping the images array
          basePrice: randInt(1200, 3500),
          moq: randItem([5, 10, 20]),
          stock: randInt(50, 500),
          certifications: ['Fair Trade', 'Rainforest Alliance'],
          warrantyInfo: 'Best before 12 months from roasting.',
          specifications: { Weight: '500g', Acidity: 'Medium' }, 
          compatibilities: {                                     
            'Roast Level': roast,
            'Processing Method': process,
            'Bean Type': beanType
          },
          bulkPricing: { '20': 5, '50': 10 },
          averageRating: 0,
          reviewCount: 0,
        });
      }
    };

    // Generate products mapping to the inserted category IDs
    insertedCategories.forEach(cat => {
      if (cat.slug === 'uganda-coffee') generateProductsForRegion(cat.id, 'UGN', ['Bugisu', 'Mt. Elgon', 'Rwenzori']);
      if (cat.slug === 'ethiopia-coffee') generateProductsForRegion(cat.id, 'ETH', ['Yirgacheffe', 'Sidamo', 'Guji']);
      if (cat.slug === 'rwanda-coffee') generateProductsForRegion(cat.id, 'RWA', ['Lake Kivu', 'Huye', 'Nyamagabe']);
      if (cat.slug === 'kenya-coffee') generateProductsForRegion(cat.id, 'KEN', ['Nyeri', 'Kiambu', 'Muranga']);
    });

    await db.insert(products).values(productsToInsert);
    logger.info(`✅ Inserted ${productsToInsert.length} Products.`);

  } catch (error) {
    logger.error('❌ Error seeding products:', error);
  }
};