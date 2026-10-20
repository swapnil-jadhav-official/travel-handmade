/**
 * Utility to bulk seed initial categories to Firestore
 * Usage: Open browser console on /admin and run: window.seedCategories()
 * Or import and call directly: import { seedCategories } from '@/lib/seed-categories'
 */

import { createCategory, getCategories } from './firestore';

const initialCategories = [
  {
    name: 'Travel + Living',
    slug: 'travel-living',
    description: 'Explore destinations and lifestyle',
    color: '#C55626',
  },
  {
    name: 'Adventure + Wildlife',
    slug: 'adventure-wildlife',
    description: 'Thrilling experiences and nature',
    color: '#8B7355',
  },
  {
    name: 'Food + Drinks',
    slug: 'food-drinks',
    description: 'Culinary adventures',
    color: '#D4A574',
  },
  {
    name: 'Wellness',
    slug: 'wellness',
    description: 'Health and mindfulness',
    color: '#A67C52',
  },
  {
    name: 'Retreats',
    slug: 'retreats',
    description: 'Peaceful getaways',
    color: '#B8956A',
  },
  {
    name: 'Changemaker',
    slug: 'changemaker',
    description: 'Sustainable travel',
    color: '#9D7E6B',
  },
];

export async function seedCategories(): Promise<void> {
  console.log('🌱 Starting to seed categories...\n');

  try {
    // Get existing categories
    const existing = await getCategories();
    const existingSlugs = new Set(existing.map((cat) => cat.slug));

    let created = 0;
    let skipped = 0;

    for (const category of initialCategories) {
      if (existingSlugs.has(category.slug)) {
        console.log(`⏭️  Skipping "${category.name}" - already exists`);
        skipped++;
        continue;
      }

      try {
        const newId = await createCategory(category);
        console.log(`✅ Created "${category.name}" (ID: ${newId})`);
        created++;
      } catch (error) {
        console.error(`❌ Failed to create "${category.name}":`, error);
      }
    }

    console.log(`\n✨ Done! Created: ${created}, Skipped: ${skipped}`);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  }
}

// Make it available globally in browser for easy access
if (typeof window !== 'undefined') {
  (window as any).seedCategories = seedCategories;
}
