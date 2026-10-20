import Link from 'next/link';
import Header from '@/components/Common/Header';
import Footer from '@/components/Common/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 py-20 sm:py-28 relative overflow-hidden">

        {/* Background stamp watermark */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        >
          <span
            style={{
              fontFamily: 'var(--font-unbounded)',
              fontSize: 'clamp(160px, 30vw, 380px)',
              fontWeight: 700,
              color: 'transparent',
              WebkitTextStroke: '1px #e9e9e9',
              letterSpacing: '-0.05em',
              lineHeight: 1,
              userSelect: 'none',
            }}
          >
            404
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto gap-6">

          {/* Stamp label */}
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-black block" />
            <span className="heading-nav text-black tracking-widest">TRAVEL HANDMADE</span>
            <span className="h-px w-8 bg-black block" />
          </div>

          {/* Main heading */}
          <h1
            style={{
              fontFamily: 'var(--font-unbounded)',
              fontWeight: 500,
              fontSize: 'clamp(28px, 5vw, 52px)',
              lineHeight: '110%',
              letterSpacing: '-0.03em',
              color: '#000',
            }}
          >
            Lost in Transit
          </h1>

          {/* Divider */}
          <div className="w-12 h-px bg-black" />

          {/* Description */}
          <p
            style={{
              fontFamily: 'var(--font-work-sans)',
              fontSize: 'clamp(14px, 2vw, 16px)',
              lineHeight: '1.7',
              letterSpacing: '-0.03em',
              color: '#555',
              maxWidth: '420px',
            }}
          >
            The page you&apos;re looking for has packed its bags and moved on.
            Some routes don&apos;t appear on any map — but every wrong turn
            makes for a better story.
          </p>

          {/* Boarding pass detail row */}
          <div
            className="w-full border border-black/10 flex divide-x divide-black/10 mt-2"
            style={{ fontFamily: 'var(--font-unbounded)' }}
          >
            <div className="flex-1 px-4 py-3 text-center">
              <div className="heading-nav text-black/40 mb-1">FROM</div>
              <div className="heading-nav text-black">HERE</div>
            </div>
            <div className="flex-1 px-4 py-3 text-center">
              <div className="heading-nav text-black/40 mb-1">FLIGHT</div>
              <div className="heading-nav text-black">TH-404</div>
            </div>
            <div className="flex-1 px-4 py-3 text-center">
              <div className="heading-nav text-black/40 mb-1">TO</div>
              <div className="heading-nav text-black">HOME</div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 w-full">
            <Link
              href="/"
              className="w-full sm:w-auto flex-1 bg-black text-white text-center py-3 px-8 transition-opacity hover:opacity-70"
              style={{
                fontFamily: 'var(--font-unbounded)',
                fontSize: '10px',
                fontWeight: 400,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Return to Home
            </Link>
            <Link
              href="/#articles"
              className="w-full sm:w-auto flex-1 border border-black text-black text-center py-3 px-8 transition-opacity hover:opacity-50"
              style={{
                fontFamily: 'var(--font-unbounded)',
                fontSize: '10px',
                fontWeight: 400,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Browse Articles
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
