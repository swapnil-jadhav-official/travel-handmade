import { BlogPost, Category } from '@/types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Travel + Living',
    slug: 'travel-living',
    description: 'Explore destinations and lifestyle',
    color: '#C55626',
  },
  {
    id: '2',
    name: 'Adventure + Wildlife',
    slug: 'adventure-wildlife',
    description: 'Thrilling experiences and nature',
    color: '#8B7355',
  },
  {
    id: '3',
    name: 'Food + Drinks',
    slug: 'food-drinks',
    description: 'Culinary adventures',
    color: '#D4A574',
  },
  {
    id: '4',
    name: 'Wellness',
    slug: 'wellness',
    description: 'Health and mindfulness',
    color: '#A67C52',
  },
  {
    id: '5',
    name: 'Retreats',
    slug: 'retreats',
    description: 'Peaceful getaways',
    color: '#B8956A',
  },
  {
    id: '6',
    name: 'Changemaker',
    slug: 'changemaker',
    description: 'Sustainable travel',
    color: '#9D7E6B',
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'A New Era Of Conscious Travel',
    excerpt: 'Discover how mindful travel is transforming the way we explore our world.',
    category: 'Travel + Living',
    author: 'Sarah Anderson',
    date: '2024-03-15',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=500&fit=crop',
    slug: 'conscious-travel-era',
    featured: true,
    views: 2543,
  },
  {
    id: '2',
    title: 'Essential Tips for Hassle-Free Journeys',
    excerpt: 'Master the art of traveling smart with our comprehensive guide to planning.',
    category: 'Travel + Living',
    author: 'Mike Chen',
    date: '2024-03-12',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=500&fit=crop',
    slug: 'hassle-free-travel-tips',
    featured: true,
    views: 1876,
  },
  {
    id: '3',
    title: 'Wildlife Photography: Capturing the Untamed',
    excerpt: 'Learn professional techniques for photographing animals in their natural habitat.',
    category: 'Adventure + Wildlife',
    author: 'Jessica Lee',
    date: '2024-03-10',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=500&fit=crop',
    slug: 'wildlife-photography-guide',
    featured: true,
    views: 1542,
  },
  {
    id: '4',
    title: 'The Ultimate Street Food Adventure',
    excerpt: 'Explore the world through its most delicious street food scenes.',
    category: 'Food + Drinks',
    author: 'Marco Rossi',
    date: '2024-03-08',
    image: 'https://images.unsplash.com/photo-1504674900967-9585226a3d79?w=800&h=500&fit=crop',
    slug: 'street-food-adventure',
    views: 1234,
  },
  {
    id: '5',
    title: 'Yoga Retreats: Finding Your Inner Peace',
    excerpt: 'Discover the best yoga retreat destinations for relaxation and renewal.',
    category: 'Wellness',
    author: 'Emma Wilson',
    date: '2024-03-05',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=500&fit=crop',
    slug: 'yoga-retreat-guide',
    views: 987,
  },
  {
    id: '6',
    title: 'Sustainable Tourism Practices',
    excerpt: 'How you can make a positive impact through responsible travel choices.',
    category: 'Changemaker',
    author: 'David Green',
    date: '2024-03-01',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=500&fit=crop',
    slug: 'sustainable-tourism',
    views: 765,
  },
  {
    id: '7',
    title: 'Mountain Hiking: Conquering Peaks',
    excerpt: 'Essential gear and techniques for safe and enjoyable mountain adventures.',
    category: 'Adventure + Wildlife',
    author: 'Tom Bradley',
    date: '2024-02-28',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop',
    slug: 'mountain-hiking-guide',
    views: 652,
  },
  {
    id: '8',
    title: 'Coffee Culture Around the World',
    excerpt: 'Experience the rich traditions of coffee from different cultures.',
    category: 'Food + Drinks',
    author: 'Lisa Kumar',
    date: '2024-02-25',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=500&fit=crop',
    slug: 'coffee-culture',
    views: 543,
  },
];

export const heroImages = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop',
    title: 'Explore World Culture',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=600&fit=crop',
    title: 'Adventure Awaits',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop',
    title: 'Nature\'s Beauty',
  },
];

export const latestArticles = [
  {
    id: '1',
    title: 'A New Era Of Conscious Travel',
    category: 'Travel + Living',
    date: 'MAR 15, 2026',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=500&fit=crop',
    slug: 'conscious-travel-era',
  },
  {
    id: '2',
    title: 'Essential Tips for Hassle-Free Journeys',
    category: 'Travel + Living',
    date: 'MAR 12, 2026',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=500&fit=crop',
    slug: 'hassle-free-travel-tips',
  },
  {
    id: '3',
    title: 'Wildlife Photography: Capturing the Untamed',
    category: 'Adventure + Wildlife',
    date: 'FEB 28, 2026',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=500&fit=crop',
    slug: 'wildlife-photography-guide',
  },
  {
    id: '4',
    title: 'Mountain Hiking: Conquering Peaks',
    category: 'Adventure + Wildlife',
    date: 'FEB 17, 2026',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop',
    slug: 'mountain-hiking-guide',
  },
];

export const travelLivingArticles = [
  {
    id: '1',
    title: 'A New Era Of Conscious Travel',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=500&fit=crop',
    slug: 'conscious-travel-era',
  },
  {
    id: '2',
    title: 'Essential Tips for Hassle-Free Journeys',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=500&fit=crop',
    slug: 'hassle-free-travel-tips',
  },
  {
    id: '3',
    title: 'Urban Exploration Guide',
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=500&fit=crop',
    slug: 'urban-exploration',
  },
  {
    id: '4',
    title: 'Island Hopping Adventures',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop',
    slug: 'island-hopping',
  },
];

export const adventureArticle = {
  id: '1',
  title: 'Wildlife Photography: Capturing the Untamed',
  image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&h=600&fit=crop',
  slug: 'wildlife-photography-guide',
};

export const foodDrinksArticles = [
  {
    id: '1',
    title: 'The Ultimate Street Food Adventure',
    image: 'https://images.unsplash.com/photo-1504674900967-9585226a3d79?w=400&h=300&fit=crop',
    slug: 'street-food-adventure',
  },
  {
    id: '2',
    title: 'Coffee Culture Around the World',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop',
    slug: 'coffee-culture',
  },
  {
    id: '3',
    title: 'Wine Tasting Guide',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2cab2707d?w=400&h=300&fit=crop',
    slug: 'wine-tasting-guide',
  },
  {
    id: '4',
    title: 'Michelin Star Dining',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    slug: 'michelin-dining',
  },
  {
    id: '5',
    title: 'Farm to Table Experiences',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    slug: 'farm-to-table',
  },
  {
    id: '6',
    title: 'Street Market Food Tours',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561681?w=400&h=300&fit=crop',
    slug: 'street-markets',
  },
];

export const retreatsArticles = [
  {
    id: '1',
    title: 'Yoga Retreats: Finding Your Inner Peace',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=500&fit=crop',
    slug: 'yoga-retreat-guide',
  },
  {
    id: '2',
    title: 'Spa and Wellness Escapes',
    image: 'https://images.unsplash.com/photo-1544161515-81e96b9b0b4d?w=800&h=500&fit=crop',
    slug: 'spa-retreats',
  },
  {
    id: '3',
    title: 'Meditation Sanctuaries',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=500&fit=crop',
    slug: 'meditation-sanctuaries',
  },
];

export const wellnessArticles = [
  {
    id: '1',
    title: 'Sustainable Tourism Practices',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=500&fit=crop',
    slug: 'sustainable-tourism',
  },
  {
    id: '2',
    title: 'Digital Detox Destinations',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=500&fit=crop',
    slug: 'digital-detox',
  },
];

export const testimonials = [
  {
    id: '1',
    quote: 'To travel consciously is to understand that you are never just passing through.',
    author: 'Sarah Anderson',
    articleTitle: 'The Art of Conscious Wandering',
    image: '/quote-img-1.png',
    videoUrl: '/videoplayback.mp4',
    videoTitle: 'Why Heritage Tourism Is the Next Luxury',
    videoSubtitle: 'In Conversation With Hotelier Evangelist Priya Paul',
  },
  {
    id: '2',
    quote: 'If your presence changes a place, make sure it changes it forward.',
    author: 'Mike Chen',
    articleTitle: 'Cultural Immersion Guide',
    image: '/quote-img-2.png',
  },
];

export const travellers = [
  {
    id: '1',
    country: 'Japan',
    traveller_name: 'Sarah Anderson',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    slug: 'sarah-anderson',
  },
  {
    id: '2',
    country: 'Italy',
    traveller_name: 'Mike Chen',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    slug: 'mike-chen',
  },
  {
    id: '3',
    country: 'Kenya',
    traveller_name: 'Jessica Lee',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    slug: 'jessica-lee',
  },
  {
    id: '4',
    country: 'Spain',
    traveller_name: 'Marco Rossi',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    slug: 'marco-rossi',
  },
];
