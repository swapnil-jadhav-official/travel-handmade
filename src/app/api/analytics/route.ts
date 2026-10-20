import { NextResponse } from 'next/server';

const PROPERTY_ID = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
const SERVICE_ACCOUNT_JSON = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

export async function GET() {
  if (!PROPERTY_ID || !SERVICE_ACCOUNT_JSON) {
    return NextResponse.json({ connected: false });
  }

  try {
    const { GoogleAuth } = await import('google-auth-library');

    const credentials = JSON.parse(SERVICE_ACCOUNT_JSON);
    const auth = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });

    const client = await auth.getClient();
    const token = await client.getAccessToken();

    const headers = {
      Authorization: `Bearer ${token.token}`,
      'Content-Type': 'application/json',
    };

    const baseUrl = `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}`;

    // Run all reports in parallel
    const [overviewRes, topPagesRes, sourcesRes] = await Promise.all([
      // Overview: sessions, users, pageviews
      fetch(`${baseUrl}:runReport`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          metrics: [
            { name: 'sessions' },
            { name: 'totalUsers' },
            { name: 'screenPageViews' },
            { name: 'averageSessionDuration' },
          ],
        }),
      }),

      // Top pages by views
      fetch(`${baseUrl}:runReport`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
          metrics: [{ name: 'screenPageViews' }, { name: 'averageSessionDuration' }],
          orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
          limit: 10,
        }),
      }),

      // Traffic sources
      fetch(`${baseUrl}:runReport`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          dimensions: [{ name: 'sessionDefaultChannelGroup' }],
          metrics: [{ name: 'sessions' }],
          orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
          limit: 6,
        }),
      }),
    ]);

    const [overview, topPages, sources] = await Promise.all([
      overviewRes.json(),
      topPagesRes.json(),
      sourcesRes.json(),
    ]);

    const metrics = overview.rows?.[0]?.metricValues || [];

    return NextResponse.json({
      connected: true,
      overview: {
        sessions: parseInt(metrics[0]?.value || '0'),
        users: parseInt(metrics[1]?.value || '0'),
        pageViews: parseInt(metrics[2]?.value || '0'),
        avgDuration: Math.round(parseFloat(metrics[3]?.value || '0')),
      },
      topPages: (topPages.rows || []).map((row: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => ({
        path: row.dimensionValues[0]?.value,
        title: row.dimensionValues[1]?.value,
        views: parseInt(row.metricValues[0]?.value || '0'),
        avgDuration: Math.round(parseFloat(row.metricValues[1]?.value || '0')),
      })),
      sources: (sources.rows || []).map((row: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => ({
        channel: row.dimensionValues[0]?.value,
        sessions: parseInt(row.metricValues[0]?.value || '0'),
      })),
    });
  } catch (error) {
    console.error('GA4 API error:', error);
    return NextResponse.json({ connected: false, error: 'Failed to fetch analytics' });
  }
}
