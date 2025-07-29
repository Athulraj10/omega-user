const Category = require('../models/category');

const sampleCategories = [
  {
    name: 'Fruits',
    description: 'Fresh and dried fruits',
    icon: 'fi fi-tr-peach',
    image: '/images/categories/fruits.jpg',
    isMainCategory: true,
    sortOrder: 1,
    status: '1',
    slug: 'fruits'
  },
  {
    name: 'Bakery',
    description: 'Fresh baked goods',
    icon: 'fi fi-tr-bread',
    image: '/images/categories/bakery.jpg',
    isMainCategory: true,
    sortOrder: 2,
    status: '1',
    slug: 'bakery'
  },
  {
    name: 'Vegetables',
    description: 'Fresh vegetables',
    icon: 'fi fi-tr-corn',
    image: '/images/categories/vegetables.jpg',
    isMainCategory: true,
    sortOrder: 3,
    status: '1',
    slug: 'vegetables'
  },
  {
    name: 'Dairy & Milk',
    description: 'Dairy products and milk',
    icon: 'fi fi-tr-coffee-pot',
    image: '/images/categories/dairy.jpg',
    isMainCategory: true,
    sortOrder: 4,
    status: '1',
    slug: 'dairy-milk'
  },
  {
    name: 'Snack & Spice',
    description: 'Snacks and spices',
    icon: 'fi fi-tr-french-fries',
    image: '/images/categories/snacks.jpg',
    isMainCategory: true,
    sortOrder: 5,
    status: '1',
    slug: 'snack-spice'
  },
  {
    name: 'Juice & Drinks',
    description: 'Beverages and juices',
    icon: 'fi fi-tr-hamburger-soda',
    image: '/images/categories/drinks.jpg',
    isMainCategory: true,
    sortOrder: 6,
    status: '1',
    slug: 'juice-drinks'
  },
  {
    name: 'Seafood',
    description: 'Fresh seafood',
    icon: 'fi fi-tr-shrimp',
    image: '/images/categories/seafood.jpg',
    isMainCategory: true,
    sortOrder: 7,
    status: '1',
    slug: 'seafood'
  },
  {
    name: 'Fast Food',
    description: 'Quick meals',
    icon: 'fi fi-tr-popcorn',
    image: '/images/categories/fast-food.jpg',
    isMainCategory: true,
    sortOrder: 8,
    status: '1',
    slug: 'fast-food'
  },
  {
    name: 'Eggs',
    description: 'Fresh eggs',
    icon: 'fi fi-tr-egg',
    image: '/images/categories/eggs.jpg',
    isMainCategory: true,
    sortOrder: 9,
    status: '1',
    slug: 'eggs'
  }
];

const seedCategories = async () => {
  try {
    console.log('Starting category seeding...');
    
    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');
    
    // Insert main categories
    const createdCategories = await Category.insertMany(sampleCategories);
    console.log(`Created ${createdCategories.length} main categories`);
    
    // Create some subcategories
    const fruitsCategory = createdCategories.find(cat => cat.slug === 'fruits');
    const vegetablesCategory = createdCategories.find(cat => cat.slug === 'vegetables');
    const dairyCategory = createdCategories.find(cat => cat.slug === 'dairy-milk');
    
    const subcategories = [
      {
        name: 'Tropical Fruits',
        description: 'Exotic tropical fruits',
        icon: 'fi fi-tr-peach',
        image: '/images/categories/tropical-fruits.jpg',
        parentCategory: fruitsCategory._id,
        isMainCategory: false,
        sortOrder: 1,
        status: '1',
        slug: 'tropical-fruits'
      },
      {
        name: 'Citrus Fruits',
        description: 'Citrus fruits',
        icon: 'fi fi-tr-peach',
        image: '/images/categories/citrus-fruits.jpg',
        parentCategory: fruitsCategory._id,
        isMainCategory: false,
        sortOrder: 2,
        status: '1',
        slug: 'citrus-fruits'
      },
      {
        name: 'Leafy Greens',
        description: 'Fresh leafy greens',
        icon: 'fi fi-tr-corn',
        image: '/images/categories/leafy-greens.jpg',
        parentCategory: vegetablesCategory._id,
        isMainCategory: false,
        sortOrder: 1,
        status: '1',
        slug: 'leafy-greens'
      },
      {
        name: 'Root Vegetables',
        description: 'Root vegetables',
        icon: 'fi fi-tr-corn',
        image: '/images/categories/root-vegetables.jpg',
        parentCategory: vegetablesCategory._id,
        isMainCategory: false,
        sortOrder: 2,
        status: '1',
        slug: 'root-vegetables'
      },
      {
        name: 'Cheese',
        description: 'Various types of cheese',
        icon: 'fi fi-tr-coffee-pot',
        image: '/images/categories/cheese.jpg',
        parentCategory: dairyCategory._id,
        isMainCategory: false,
        sortOrder: 1,
        status: '1',
        slug: 'cheese'
      },
      {
        name: 'Yogurt',
        description: 'Fresh yogurt products',
        icon: 'fi fi-tr-coffee-pot',
        image: '/images/categories/yogurt.jpg',
        parentCategory: dairyCategory._id,
        isMainCategory: false,
        sortOrder: 2,
        status: '1',
        slug: 'yogurt'
      }
    ];
    
    await Category.insertMany(subcategories);
    console.log(`Created ${subcategories.length} subcategories`);
    
    console.log('Category seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding categories:', error);
    throw error;
  }
};

module.exports = { seedCategories };