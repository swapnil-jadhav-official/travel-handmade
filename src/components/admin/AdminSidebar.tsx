'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Plus,
  ExternalLink,
  Tag,
  Settings,
} from 'lucide-react';

export default function AdminSidebar(): React.ReactElement {
  const pathname = usePathname();

  const isActive = (path: string): boolean => {
    if (path === '/admin') return pathname === '/admin';
    return pathname.startsWith(path);
  };

  return (
    <aside className="w-64 border-r border-gray-200 bg-black text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-6">
        <h1 className="text-xl font-bold">Travel Handmade</h1>
        <p className="text-xs text-gray-400">Blog Admin</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-3 py-6">
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
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-800 space-y-2 px-3 py-6">
        <NavLink
          href="/admin/setup"
          icon={Settings}
          label="Setup"
          active={isActive('/admin/setup')}
        />
        <div className="px-4 pt-2">
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
