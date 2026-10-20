#!/usr/bin/env node

/**
 * Bulk seed categories into Firestore
 * Run with: node scripts/seed-categories.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '../firebase-key.json');

try {
  admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath)),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
} catch (error) {
  console.error('⚠️  Firebase Admin SDK not configured. Using client SDK instead.');
  console.error('   To use this script with Admin SDK, create firebase-key.json in the project root.');
}

const db = admin.firestore();

const categories = [
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

async function seedCategories() {
  console.log('🌱 Starting to seed categories...\n');

  try {
    for (const category of categories) {
      // Check if category already exists by slug
      const existingQuery = await db
        .collection('categories')
        .where('slug', '==', category.slug)
        .limit(1)
        .get();

      if (!existingQuery.empty) {
        console.log(`⏭️  Skipping "${category.name}" - already exists`);
        continue;
      }

      // Add new category
      const docRef = await db.collection('categories').add(category);
      console.log(`✅ Created "${category.name}" (ID: ${docRef.id})`);
    }

    console.log('\n✨ Categories seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();
