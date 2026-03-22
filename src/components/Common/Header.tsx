'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { X, Menu } from 'lucide-react';
import { getSiteSettings } from '@/lib/settings';
import type { Category } from '@/types';

export default function Header() {
  const [logoUrl, setLogoUrl] = useState('/th-logo.png');
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fixed navigation order matching Figma design
  const navigationItems: Category[] = [
    { id: '1', name: 'Travel + Living', slug: 'travel-living' },
    { id: '2', name: 'Adventure + Wildlife', slug: 'adventure-wildlife' },
    { id: '3', name: 'Food + Drinks', slug: 'food-drinks' },
    { id: '4', name: 'Retreats', slug: 'retreats' },
    { id: '5', name: 'Wellness', slug: 'wellness' },
    { id: '6', name: 'Changemaker', slug: 'changemaker' },
    { id: '7', name: 'Traveller', slug: 'traveller' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const settings = await getSiteSettings();
        if (settings?.logoUrl) {
          setLogoUrl(settings.logoUrl);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <header className="bg-black text-white sticky top-0 z-50 max-h-67">
      <nav className="max-w-full px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-5 flex items-center justify-between h-auto max-h-67">
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
        <div className="hidden lg:flex gap-6 xl:gap-12 items-center justify-end flex-1">
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
