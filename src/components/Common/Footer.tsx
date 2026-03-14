'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Twitter, Linkedin, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCategories } from '@/lib/firestore';
import { getSiteSettings } from '@/lib/settings';
import type { Category } from '@/types';

export default function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [logoUrl, setLogoUrl] = useState('/th-logo.png');

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
      }
    };

    fetchData();
  }, []);

  return (
    <footer className="bg-black text-white mt-16 w-full">
      <div className="w-full px-12 py-16">
        {/* Main Footer Content */}
        <div className="flex gap-24 mb-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            {logoUrl.startsWith('http') ? (
              <img
                src={logoUrl}
                alt="Travel Handmade"
                className="h-12 object-contain mb-6"
              />
            ) : (
              <Image
                src={logoUrl}
                alt="Travel Handmade"
                width={120}
                height={50}
                className="h-auto w-auto mb-6"
              />
            )}
            <p className="text-xs text-gray-400">© 2026 Travel Handmade.</p>
          </div>

          {/* Links Columns */}
          <div className="flex-1 grid grid-cols-3 gap-16">
            {/* Column 1: Main Links */}
            <div>
              <ul className="space-y-3 text-xs tracking-wide">
                <li><Link href="/" className="text-white hover:opacity-70 transition">HOME</Link></li>
                <li><Link href="#" className="text-white hover:opacity-70 transition">ABOUT US</Link></li>
                <li><Link href="#" className="text-white hover:opacity-70 transition">NEWSLETTER</Link></li>
                <li><Link href="#" className="text-white hover:opacity-70 transition">CONTACT US</Link></li>
                <li><Link href="#" className="text-white hover:opacity-70 transition">PRIVACY</Link></li>
              </ul>
            </div>

            {/* Column 2: Categories */}
            <div>
              <ul className="space-y-3 text-xs tracking-wide">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/category/${cat.slug}`} className="text-white hover:opacity-70 transition uppercase">
                      {cat.name}
                    </Link>
                  </li>
                ))}
                <li><Link href="#" className="text-white hover:opacity-70 transition">TRAVELLER</Link></li>
              </ul>
            </div>

            {/* Column 3: Social Links */}
            <div>
              <div className="text-xs font-semibold mb-6 tracking-wider">OUR SOCIALS</div>
              <div className="flex gap-6">
                <a href="#" className="text-white hover:opacity-70 transition">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-white hover:opacity-70 transition">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-white hover:opacity-70 transition">
                  <Heart className="h-5 w-5" />
                </a>
                <a href="#" className="text-white hover:opacity-70 transition">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700"></div>

        {/* Copyright Text */}
        <div className="pt-8 text-center text-xs text-gray-400">
          <p>All rights reserved. The material on this site may not be reproduced, distributed, transmitted, modified, republished, or used in any form, except with the prior written permission of Travel Handmade</p>
        </div>
      </div>
    </footer>
  );
}
