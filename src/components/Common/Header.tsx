'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { X, Menu } from 'lucide-react';
import { getCategories } from '@/lib/firestore';
import { getSiteSettings } from '@/lib/settings';
import type { Category } from '@/types';

export default function Header() {
  const [navigationItems, setNavigationItems] = useState<Category[]>([]);
  const [logoUrl, setLogoUrl] = useState('/th-logo.png');
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <nav className="max-w-full px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-5 flex items-center justify-between h-auto min-h-16 sm:min-h-20">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          {logoUrl.startsWith('http') ? (
            <img
              src={logoUrl}
              alt="Travel Handmade"
              className="h-8 sm:h-10 md:h-12 w-auto"
            />
          ) : (
            <Image
              src={logoUrl}
              alt="Travel Handmade"
              width={120}
              height={50}
              priority
              className="h-8 sm:h-10 md:h-12 w-auto"
            />
          )}
        </Link>

        {/* Desktop Navigation Items */}
        <div className="hidden lg:flex gap-6 xl:gap-12 items-center justify-center flex-1 ml-8 lg:ml-16 xl:ml-20">
          {!loading && navigationItems.length > 0 && navigationItems.map((item) => (
            <Link
              key={item.slug}
              href={`/category/${item.slug}`}
              className="heading-nav hover:opacity-70 transition whitespace-nowrap"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black border-t border-gray-800 px-4 sm:px-6 py-4 sm:py-6">
          <div className="space-y-3 sm:space-y-4">
            {!loading && navigationItems.length > 0 && navigationItems.map((item) => (
              <Link
                key={item.slug}
                href={`/category/${item.slug}`}
                className="block heading-nav hover:opacity-70 transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
