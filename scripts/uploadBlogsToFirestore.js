const admin = require('firebase-admin');
const serviceAccount = require('../firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://travelhandmade-50fcc.firebaseio.com',
});

const db = admin.firestore();

// Sample blog data to upload
const blogs = [
  {
    title: 'Top 10 Hidden Gems in Southeast Asia',
    slug: 'hidden-gems-southeast-asia',
    excerpt: 'Discover the lesser-known destinations that will steal your heart in Southeast Asia.',
    content: '<p>Southeast Asia is home to some of the most stunning hidden destinations. From pristine beaches to ancient temples, this region offers something for every traveler.</p><p>In this comprehensive guide, we explore the top 10 hidden gems that most tourists miss.</p>',
    category: 'travel-living',
    author: 'Admin',
    tags: ['Southeast Asia', 'Travel Tips', 'Hidden Gems'],
    status: 'published',
    visibility: 'public',
    image: 'https://res.cloudinary.com/dzrabrzd4/image/upload/v1234567890/sample1.jpg',
  },
  {
    title: 'The Ultimate Guide to Street Food in Bangkok',
    slug: 'street-food-bangkok',
    excerpt: 'Explore the vibrant street food culture of Bangkok with our comprehensive guide.',
    content: '<p>Bangkok is a paradise for food lovers. The street food scene here is legendary and offers authentic Thai cuisine at its finest.</p><p>From pad thai to mango sticky rice, discover the best street food destinations in the city.</p>',
    category: 'food-drinks',
    author: 'Admin',
    tags: ['Bangkok', 'Street Food', 'Thailand'],
    status: 'published',
    visibility: 'public',
    image: 'https://res.cloudinary.com/dzrabrzd4/image/upload/v1234567890/sample2.jpg',
  },
  {
    title: 'Wellness Retreats: Finding Your Inner Peace',
    slug: 'wellness-retreats-inner-peace',
    excerpt: 'Discover the best wellness retreats around the world for relaxation and rejuvenation.',
    content: '<p>In our fast-paced world, wellness retreats have become essential for mental and physical health.</p><p>This guide explores the best retreat destinations that offer yoga, meditation, and holistic wellness programs.</p>',
    category: 'wellness',
    author: 'Admin',
    tags: ['Wellness', 'Yoga', 'Meditation'],
    status: 'published',
    visibility: 'public',
    image: 'https://res.cloudinary.com/dzrabrzd4/image/upload/v1234567890/sample3.jpg',
  },
  {
    title: 'Adventure Sports in New Zealand',
    slug: 'adventure-sports-new-zealand',
    excerpt: 'Experience the thrill of adventure sports in New Zealand\'s stunning landscapes.',
    content: '<p>New Zealand is an adventure sports paradise. From bungee jumping to skydiving, there\'s something for every adrenaline junkie.</p><p>Discover the best spots for adventure sports in this beautiful country.</p>',
    category: 'adventure-wildlife',
    author: 'Admin',
    tags: ['Adventure', 'New Zealand', 'Sports'],
    status: 'published',
    visibility: 'public',
    image: 'https://res.cloudinary.com/dzrabrzd4/image/upload/v1234567890/sample4.jpg',
  },
  {
    title: 'Sustainable Travel: How to Travel Responsibly',
    slug: 'sustainable-travel-responsible',
    excerpt: 'Learn how to minimize your environmental impact while traveling and supporting local communities.',
    content: '<p>Sustainable travel is not just a trend; it\'s a responsibility. As travelers, we have the power to make a positive impact on the destinations we visit.</p><p>This guide covers eco-friendly practices and responsible tourism.</p>',
    category: 'travel-living',
    author: 'Admin',
    tags: ['Sustainability', 'Eco-friendly', 'Travel Tips'],
    status: 'published',
    visibility: 'public',
    image: 'https://res.cloudinary.com/dzrabrzd4/image/upload/v1234567890/sample5.jpg',
  },
  {
    title: 'Change Maker: How Tourism Can Help Communities',
    slug: 'change-maker-tourism-communities',
    excerpt: 'Explore how responsible tourism can create positive change in local communities.',
    content: '<p>Tourism has the power to transform communities. When done responsibly, it creates jobs, preserves culture, and improves infrastructure.</p><p>Meet the change makers using tourism as a force for good.</p>',
    category: 'changemaker',
    author: 'Admin',
    tags: ['Social Impact', 'Community', 'Travel'],
    status: 'published',
    visibility: 'public',
    image: 'https://res.cloudinary.com/dzrabrzd4/image/upload/v1234567890/sample6.jpg',
  },
  {
    title: 'Budget Travel Guide: Exploring Europe on $50 a Day',
    slug: 'budget-travel-europe-50-day',
    excerpt: 'Discover how to explore Europe without breaking the bank with our comprehensive budget guide.',
    content: '<p>Europe doesn\'t have to be expensive. With careful planning and smart choices, you can explore this beautiful continent on a tight budget.</p><p>Learn practical tips for budget travel across Europe.</p>',
    category: 'travel-living',
    author: 'Admin',
    tags: ['Budget Travel', 'Europe', 'Travel Tips'],
    status: 'published',
    visibility: 'public',
    image: 'https://res.cloudinary.com/dzrabrzd4/image/upload/v1234567890/sample7.jpg',
  },
  {
    title: 'Mountain Trekking in the Himalayas',
    slug: 'mountain-trekking-himalayas',
    excerpt: 'Experience the majesty of the Himalayas with our complete trekking guide.',
    content: '<p>The Himalayas offer some of the most breathtaking trekking experiences in the world. From popular routes to hidden trails, there\'s something for every level.</p><p>This guide covers everything you need to know about trekking in the Himalayas.</p>',
    category: 'adventure-wildlife',
    author: 'Admin',
    tags: ['Trekking', 'Himalayas', 'Adventure'],
    status: 'published',
    visibility: 'public',
    image: 'https://res.cloudinary.com/dzrabrzd4/image/upload/v1234567890/sample8.jpg',
  },
];

async function uploadBlogs() {
  try {
    console.log('🚀 Starting blog upload to Firestore...\n');

    const batch = db.batch();
    let count = 0;

    for (const blog of blogs) {
      const docRef = db.collection('posts').doc();

      const blogData = {
        ...blog,
        views: Math.floor(Math.random() * 1000), // Random view count
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
        publishedAt: admin.firestore.Timestamp.now(),
        seoTitle: blog.title,
        seoDescription: blog.excerpt,
        password: null,
      };

      batch.set(docRef, blogData);
      count++;
      console.log(`✅ Queued: "${blog.title}"`);
    }

    await batch.commit();
    console.log(`\n🎉 Successfully uploaded ${count} blogs to Firestore!`);
  } catch (error) {
    console.error('❌ Error uploading blogs:', error);
    process.exit(1);
  } finally {
    await admin.app().delete();
  }
}

uploadBlogs();
