'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSiteSettings } from '@/lib/settings';
import {
  LayoutDashboard,
  FileText,
  Plus,
  ExternalLink,
  Tag,
  Settings,
  Users,
  UserCircle,
  LogOut,
  Tent,
} from 'lucide-react';

export default function AdminSidebar(): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const { userProfile, signOut, isSuperAdmin, canManageUsers } = useAuth();
  const [logoUrl, setLogoUrl] = useState('/th-logo.png');

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const settings = await getSiteSettings();
        if (settings?.logoUrl) {
          setLogoUrl(settings.logoUrl);
        }
      } catch (error) {
        console.error('Failed to fetch logo:', error);
      }
    };

    fetchLogo();
  }, []);

  const isActive = (path: string): boolean => {
    if (path === '/admin') return pathname === '/admin';
    return pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <aside className="w-64 border-r border-gray-200 bg-black text-white flex flex-col">
      {/* Header - Logo */}
      <div className="border-b border-gray-800 px-6 py-6 flex items-center justify-center">
        {logoUrl.startsWith('http') ? (
          <img
            src={logoUrl}
            alt="Travel Handmade"
            className="h-16 object-contain"
          />
        ) : (
          <Image
            src={logoUrl}
            alt="Travel Handmade"
            width={120}
            height={60}
            priority
            className="object-contain"
          />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-3 py-6 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <NavLink
          href="/admin"
          icon={LayoutDashboard}
          label="Dashboard"
          active={isActive('/admin') && pathname === '/admin'}
        />
        <NavLink
          href="/admin/posts"
          icon={FileText}
          label="All Posts"
          active={isActive('/admin/posts')}
        />
        <NavLink
          href="/admin/categories"
          icon={Tag}
          label="Categories"
          active={isActive('/admin/categories')}
        />
        <NavLink
          href="/admin/posts/new"
          icon={Plus}
          label="New Post"
          active={isActive('/admin/posts/new')}
        />
        <NavLink
          href="/admin/retreats"
          icon={Tent}
          label="Retreats"
          active={isActive('/admin/retreats')}
        />
        <NavLink
          href="/admin/testimonials"
          icon={FileText}
          label="Change Maker"
          active={isActive('/admin/testimonials')}
        />
        <NavLink
          href="/admin/travellers"
          icon={Users}
          label="Travellers"
          active={isActive('/admin/travellers')}
        />

        {canManageUsers() && (
          <NavLink
            href="/admin/authors"
            icon={Users}
            label="Authors"
            active={isActive('/admin/authors')}
          />
        )}

        {/* Divider */}
        <div className="my-4 border-t border-gray-800" />

        {/* User Info */}
        {userProfile && (
          <div className="px-3 py-3 bg-white/5 rounded-lg mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                {userProfile.avatarUrl ? (
                  <img
                    src={userProfile.avatarUrl}
                    alt={userProfile.displayName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  userProfile.displayName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{userProfile.displayName}</p>
                <p className="text-xs text-gray-400 capitalize">
                  {userProfile.role.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
        )}

        <NavLink
          href="/admin/profile"
          icon={UserCircle}
          label="My Profile"
          active={isActive('/admin/profile')}
        />

        {isSuperAdmin() && (
          <>
            <NavLink
              href="/admin/settings"
              icon={Settings}
              label="Site Settings"
              active={isActive('/admin/settings')}
            />
            <NavLink
              href="/admin/setup"
              icon={Settings}
              label="Setup"
              active={isActive('/admin/setup')}
            />
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-800 px-3 py-4 space-y-3">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>

        {/* View Site Link */}
        <div className="px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white"
          >
            View Site
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

interface NavLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
}

function NavLink({
  href,
  icon: Icon,
  label,
  active,
}: NavLinkProps): React.ReactElement {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
        active ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5'
      }`}
    >
      <Icon className="h-5 w-5" />
      {label}
    </Link>
  );
}
