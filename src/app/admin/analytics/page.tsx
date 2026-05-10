'use client';

import { useEffect, useState } from 'react';
import { BarChart2, Users, Eye, Clock, TrendingUp, Globe } from 'lucide-react';

interface OverviewData {
  sessions: number;
  users: number;
  pageViews: number;
  avgDuration: number;
}

interface PageData {
  path: string;
  title: string;
  views: number;
  avgDuration: number;
}

interface SourceData {
  channel: string;
  sessions: number;
}

interface AnalyticsData {
  connected: boolean;
  overview?: OverviewData;
  topPages?: PageData[];
  sources?: SourceData[];
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ connected: false }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex-1 overflow-auto p-8">
        <div className="text-gray-500 text-sm">Loading analytics...</div>
      </div>
    );
  }

  if (!data?.connected) {
    return (
      <div className="flex-1 overflow-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Last 30 days — powered by Google Analytics 4</p>
        </div>
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <BarChart2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-700 mb-2">GA4 Not Connected</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            To enable analytics, add the following environment variables in Vercel and redeploy:
          </p>
          <div className="inline-block text-left bg-white border border-gray-200 rounded-lg px-6 py-4 text-sm font-mono text-gray-700 space-y-1">
            <p>GOOGLE_ANALYTICS_PROPERTY_ID=<span className="text-gray-400">your-property-id</span></p>
            <p>GOOGLE_SERVICE_ACCOUNT_JSON=<span className="text-gray-400">{'{"type":"service_account",...}'}</span></p>
          </div>
        </div>
      </div>
    );
  }

  const { overview, topPages = [], sources = [] } = data;
  const totalSessions = sources.reduce((sum, s) => sum + s.sessions, 0);

  const statCards = [
    { label: 'Page Views', value: formatNumber(overview!.pageViews), icon: Eye, color: 'bg-blue-50 text-blue-600' },
    { label: 'Users', value: formatNumber(overview!.users), icon: Users, color: 'bg-green-50 text-green-600' },
    { label: 'Sessions', value: formatNumber(overview!.sessions), icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
    { label: 'Avg. Duration', value: formatDuration(overview!.avgDuration), icon: Clock, color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div className="flex-1 overflow-auto p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Last 30 days — powered by Google Analytics 4</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-lg border border-gray-200 bg-white p-6">
            <div className={`mb-4 inline-block rounded-lg p-3 ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{card.value}</div>
            <div className="text-sm text-gray-500 mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Pages */}
        <div className="lg:col-span-2 rounded-lg border border-gray-200 bg-white">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Top Pages</h2>
            <p className="text-xs text-gray-400 mt-0.5">By page views — last 30 days</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-6 py-3 text-left">Page</th>
                  <th className="px-6 py-3 text-right">Views</th>
                  <th className="px-6 py-3 text-right">Avg. Time</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((page, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[280px]">
                        {page.title || page.path}
                      </p>
                      <p className="text-xs text-gray-400 truncate max-w-[280px]">{page.path}</p>
                    </td>
                    <td className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      {formatNumber(page.views)}
                    </td>
                    <td className="px-6 py-3 text-right text-sm text-gray-500">
                      {formatDuration(page.avgDuration)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Traffic Sources</h2>
            <p className="text-xs text-gray-400 mt-0.5">By channel — last 30 days</p>
          </div>
          <div className="p-6 space-y-4">
            {sources.map((source, i) => {
              const pct = totalSessions > 0 ? Math.round((source.sessions / totalSessions) * 100) : 0;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-sm text-gray-700">{source.channel}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{formatNumber(source.sessions)} sessions</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
