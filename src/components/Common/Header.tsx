'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getCategories } from '@/lib/firestore';
import type { Category } from '@/types';

export default function Header() {
  const [navigationItems, setNavigationItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNavigation = async () => {
      try {
        setLoading(true);
        const categories = await getCategories();
        setNavigationItems(categories);
      } catch (error) {
        console.error('Failed to fetch navigation categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNavigation();
  }, []);

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
          {!loading && navigationItems.length > 0 && navigationItems.map((item) => (
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
