'use client';

import Link from 'next/link';
import Image from 'next/image';
import { InstagramIcon, XIcon, LinkedinIcon, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCategories } from '@/lib/firestore';
import { getSiteSettings } from '@/lib/settings';
import type { Category } from '@/types';

export default function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [logoUrl, setLogoUrl] = useState('/th-logo-new.png');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, settingsData] = await Promise.all([
          getCategories(),
          getSiteSettings(),
        ]);
        setCategories(categoriesData);
        if (settingsData?.logoUrl) {
          setLogoUrl(settingsData.logoUrl);
        }
      } catch (error) {
        console.error('Failed to fetch footer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <footer className="bg-black text-white mt-8 sm:mt-12 md:mt-16 w-full">
      <div className="w-full px-6 sm:px-8 lg:px-12 py-10 sm:py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="flex flex-col sm:flex-row gap-8 md:gap-12 lg:gap-24 mb-10 sm:mb-12 md:mb-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            {!loading && (logoUrl.startsWith('http') ? (
              <img
                src={logoUrl}
                alt="Travel Handmade"
                className="h-8 sm:h-10 md:h-12 object-contain mb-4 sm:mb-6"
              />
            ) : (
              <Image
                src={logoUrl}
                alt="Travel Handmade"
                width={120}
                height={50}
                className="h-8 sm:h-10 md:h-12 w-auto mb-4 sm:mb-6"
              />
            ))}
          </div>

          {/* Links Columns */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-12 lg:gap-16">
            {/* Column 1: Main Links */}
            <div>
              <ul className="space-y-3 sm:space-y-4">
                <li><Link href="/" className="heading-nav text-white hover:opacity-70 transition">HOME</Link></li>
                <li><Link href="#" className="heading-nav text-white hover:opacity-70 transition">ABOUT US</Link></li>
                <li><Link href="#" className="heading-nav text-white hover:opacity-70 transition">NEWSLETTER</Link></li>
                <li><Link href="#" className="heading-nav text-white hover:opacity-70 transition">CONTACT US</Link></li>
                <li><Link href="#" className="heading-nav text-white hover:opacity-70 transition">PRIVACY</Link></li>
              </ul>
            </div>

            {/* Column 2: Categories */}
            <div>
              <ul className="space-y-3 sm:space-y-4">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/category/${cat.slug}`} className="heading-nav text-white hover:opacity-70 transition uppercase">
                      {cat.name}
                    </Link>
                  </li>
                ))}
                <li><Link href="#" className="heading-nav text-white hover:opacity-70 transition">TRAVELLER</Link></li>
              </ul>
            </div>

            {/* Column 3: Social Links */}
            <div className="col-span-2 sm:col-span-1">
              <div className="heading-nav text-white mb-4 sm:mb-6">OUR SOCIALS</div>
              <div className="flex gap-4 sm:gap-6">
                <a href="#" className="text-white hover:opacity-70 transition">
                  <InstagramIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
                <a href="#" className="text-white hover:opacity-70 transition">
                  <XIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
                <a href="#" className="text-white hover:opacity-70 transition">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
                <a href="#" className="text-white hover:opacity-70 transition">
                  <LinkedinIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700" />

        {/* Copyright */}
        <div className="pt-6 sm:pt-8">
          <p className="text-subcategory text-gray-400 leading-relaxed text-center">
            © 2026 Travel Handmade. All rights reserved. The material on this site may not be reproduced, distributed, transmitted, modified, republished, or used in any form, except with the prior written permission of Travel Handmade
          </p>
        </div>
      </div>
    </footer>
  );
}
