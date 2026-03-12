'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const navigationItems = [
    { name: 'TRAVEL + LIVING', slug: 'travel-living' },
    { name: 'ADVENTURE + WILDLIFE', slug: 'adventure-wildlife' },
    { name: 'FOOD + DRINKS', slug: 'food-drinks' },
    { name: 'RETREATS', slug: 'retreats' },
    { name: 'WELLNESS', slug: 'wellness' },
    { name: 'CHANGEMAKER', slug: 'changemaker' },
    { name: 'TRAVELLER', slug: 'traveller' },
  ];

  return (
    <header className="bg-black text-white sticky top-0 z-50">
      <nav className="max-w-full px-12 py-5 flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/th-logo.png"
            alt="Travel Handmade"
            width={120}
            height={50}
            priority
            className="h-auto w-auto"
          />
        </Link>

        {/* Navigation Items */}
        <div className="hidden xl:flex gap-12 items-center justify-center flex-1 ml-20">
          {navigationItems.map((item) => (
            <Link
              key={item.slug}
              href={`/category/${item.slug}`}
              className="text-xs font-semibold tracking-wider hover:opacity-70 transition whitespace-nowrap"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <button className="xl:hidden text-white text-2xl">
          ☰
        </button>
      </nav>
    </header>
  );
}
