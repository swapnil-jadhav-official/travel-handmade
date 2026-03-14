'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getCategories } from '@/lib/firestore';
import { getSiteSettings } from '@/lib/settings';
import type { Category } from '@/types';

export default function Header() {
  const [navigationItems, setNavigationItems] = useState<Category[]>([]);
  const [logoUrl, setLogoUrl] = useState('/th-logo.png');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categories, settings] = await Promise.all([
          getCategories(),
          getSiteSettings(),
        ]);
        setNavigationItems(categories);
        if (settings?.logoUrl) {
          setLogoUrl(settings.logoUrl);
        }
      } catch (error) {
        console.error('Failed to fetch navigation data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <header className="bg-black text-white sticky top-0 z-50">
      <nav className="max-w-full px-12 py-5 flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          {logoUrl.startsWith('http') ? (
            <img
              src={logoUrl}
              alt="Travel Handmade"
              className="h-12 w-auto"
            />
          ) : (
            <Image
              src={logoUrl}
              alt="Travel Handmade"
              width={120}
              height={50}
              priority
              className="h-auto w-auto"
            />
          )}
        </Link>

        {/* Navigation Items */}
        <div className="hidden xl:flex gap-12 items-center justify-center flex-1 ml-20">
          {!loading && navigationItems.length > 0 && navigationItems.map((item) => (
            <Link
              key={item.slug}
              href={`/category/${item.slug}`}
              className="text-sm font-normal tracking-wider uppercase hover:opacity-70 transition whitespace-nowrap"
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
