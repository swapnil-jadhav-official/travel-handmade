'use client';

import Link from 'next/link';
import Image from 'next/image';
import { InstagramIcon, LinkedinIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCategories } from '@/lib/firestore';
import { getSiteSettings } from '@/lib/settings';
import { optimizeCloudinaryUrl } from '@/lib/cloudinary';
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
    <footer className="bg-black text-white w-full">
      <div className="w-full px-6 sm:px-8 lg:px-12 py-10 sm:py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="flex flex-col sm:flex-row gap-8 md:gap-12 lg:gap-24 mb-10 sm:mb-12 md:mb-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            {!loading && (logoUrl.startsWith('http') ? (
              <img
                src={optimizeCloudinaryUrl(logoUrl, 300)}
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
                <li><Link href="/about-us" className="heading-nav text-white hover:opacity-70 transition">ABOUT US</Link></li>
                <li><Link href="/newsletter" className="heading-nav text-white hover:opacity-70 transition">NEWSLETTER</Link></li>
                <li><Link href="/contact-us" className="heading-nav text-white hover:opacity-70 transition">CONTACT US</Link></li>
                <li><Link href="/privacy" className="heading-nav text-white hover:opacity-70 transition">PRIVACY</Link></li>
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
              </ul>
            </div>

            {/* Column 3: Social Links */}
            <div className="col-span-2 sm:col-span-1">
              <div className="heading-nav text-white mb-4 sm:mb-6">OUR SOCIALS</div>
              <div className="flex gap-4 sm:gap-6">
                <a href="https://www.instagram.com/travelhandmade_mag/" target="_blank" rel="noopener noreferrer" className="text-white hover:opacity-70 transition">
                  <InstagramIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
                {/* YouTube */}
                <a href="https://www.youtube.com/@TravelHandmade" target="_blank" rel="noopener noreferrer" className="text-white hover:opacity-70 transition">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                {/* Pinterest */}
                <a href="https://in.pinterest.com/business/hub/" target="_blank" rel="noopener noreferrer" className="text-white hover:opacity-70 transition">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                  </svg>
                </a>
                <a href="https://www.linkedin.com/company/travel-handmade/about/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="text-white hover:opacity-70 transition">
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
          <p className="text-subcategory text-gray-400 leading-relaxed text-center" style={{ textTransform: 'none' }}>
            © 2026 Travel Handmade. All rights reserved. The material on this site may not be reproduced, distributed, transmitted, modified, republished, or used in any form, except with the prior written permission of Travel Handmade
          </p>
        </div>
      </div>
    </footer>
  );
}
