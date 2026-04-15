'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Common/Header';
import Footer from '@/components/Common/Footer';
import { getNewsletters } from '@/lib/firestore';
import type { NewsletterIssue } from '@/data/newsletters';

// ── Mini magazine cover card (152×190 px — exact Figma dimensions)
function CoverCard({
  issueNumber,
  title,
  accentColor,
  thumbnail,
}: {
  issueNumber: number;
  title: string;
  accentColor: string;
  thumbnail: string;
}) {
  return (
    <div
      className="flex-shrink-0 relative overflow-hidden"
      style={{ width: '152px', height: '190px', background: accentColor }}
    >
      {/* TH logo — top-left, 7px from edges, 15×6 px */}
      <div
        className="absolute overflow-hidden"
        style={{ left: '7px', top: '7px', width: '15px', height: '6px' }}
      >
        <img
          src="/th-logo-new.png"
          alt="TH"
          className="w-full h-full object-contain"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
      </div>

      {/* Issue number + title — top-right, 3 px font */}
      <div
        className="absolute text-right"
        style={{ right: '9px', top: '7px' }}
      >
        <p
          style={{
            fontFamily: 'var(--font-work-sans)',
            fontWeight: 600,
            fontSize: '3px',
            letterSpacing: '0.15px',
            lineHeight: 1,
            color: 'white',
          }}
        >
          ISSUE {String(issueNumber).padStart(2, '0')}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-work-sans)',
            fontWeight: 600,
            fontSize: '3px',
            letterSpacing: '0.15px',
            lineHeight: 1.4,
            textTransform: 'uppercase',
            color: 'white',
          }}
        >
          {title}
        </p>
      </div>

      {/* DEPARTURES — centred, 19 px Unbounded ExtraLight, 42 px from card top */}
      <p
        className="absolute text-center text-white w-full"
        style={{
          top: '42px',
          fontFamily: 'var(--font-unbounded)',
          fontWeight: 200,
          fontSize: '19px',
          letterSpacing: '-0.04em',
          textTransform: 'uppercase',
          lineHeight: 1,
        }}
      >
        DEPARTURES
      </p>

      {/* Photo — 136×120 px, 8 px left margin, 63 px from top */}
      <div
        className="absolute overflow-hidden"
        style={{ left: '8px', top: '63px', width: '136px', height: '120px' }}
      >
        <img
          src={thumbnail}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

const PAGE_SIZE = 5;

// ── Page ────────────────────────────────────────────────────────────────────
export default function NewsletterPage() {
  const [newsletters, setNewsletters] = useState<NewsletterIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getNewsletters()
      .then(setNewsletters)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.max(1, Math.ceil(newsletters.length / PAGE_SIZE));
  const pageIssues = newsletters.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1">
        {/* ── Hero Title ─────────────────────────────────────────── */}
        <section className="px-6 sm:px-8 lg:px-12 pt-10 sm:pt-14 lg:pt-16 pb-6 text-center">
          <h1
            style={{
              fontFamily: 'var(--font-unbounded)',
              fontWeight: 200,
              fontSize: 'clamp(40px, 7vw, 70px)',
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              lineHeight: 1,
              color: 'black',
            }}
          >
            Departures
          </h1>
          <p
            className="mt-4"
            style={{
              fontFamily: 'var(--font-work-sans)',
              fontSize: '10px',
              letterSpacing: '0.1em',
              color: 'black',
            }}
          >
            A Travel Handmade Newsletter For The Traveller Within
          </p>
        </section>

        {/* ── Full-width divider ─────────────────────────────────── */}
        <div className="mx-6 sm:mx-8 lg:mx-12 border-t border-black" />

        {/* ── Intro text ─────────────────────────────────────────── */}
        <section className="px-6 sm:px-8 lg:px-12 py-8 sm:py-10">
          <div className="max-w-[1183px] mx-auto">
            <p
              style={{
                fontFamily: 'var(--font-work-sans)',
                fontSize: '16px',
                lineHeight: '1.61',
                letterSpacing: '-0.05em',
              }}
            >
              Some departures are, in fact, a return, a quiet coming back to
              oneself, to rediscover the &apos;traveller&apos; within. Departures
              open out as an editor&apos;s letter, a curated collection of
              journeys, conversations, and moments that capture the spirit of
              wanderlust.
            </p>
            <p
              className="mt-4"
              style={{
                fontFamily: 'var(--font-work-sans)',
                fontSize: '16px',
                lineHeight: '1.61',
                letterSpacing: '-0.05em',
              }}
            >
              Stay tuned to our monthly newsletter, an evolving collection of
              travel perspectives, exclusive insights, and long reads that traces
              narratives that emerge when the dust settles on the road less
              travelled. This is travel that begins where the guidebooks end.
            </p>
          </div>
        </section>

        {/* ── Issue List ─────────────────────────────────────────── */}
        <section className="px-6 sm:px-8 lg:px-12 pb-12">
          <div className="max-w-[1350px] mx-auto">
            {loading ? (
              <p
                className="py-16 text-center"
                style={{ fontFamily: 'var(--font-work-sans)', fontSize: '14px', color: '#888' }}
              >
                Loading issues…
              </p>
            ) : (
              pageIssues.map((issue, idx) => (
                <div key={issue.id}>
                  <div className="border-t border-[#e0e0e0]" />
                  <Link
                    href={`/newsletter/${issue.slug}`}
                    className="flex gap-6 sm:gap-8 lg:gap-10 py-6 sm:py-8 hover:opacity-80 transition group"
                  >
                    {/* Mini cover card */}
                    <CoverCard
                      issueNumber={issue.issueNumber}
                      title={issue.title}
                      accentColor={issue.accentColor}
                      thumbnail={issue.coverThumbnail}
                    />

                    {/* Text */}
                    <div className="flex-1 flex flex-col justify-center gap-2">
                      <p
                        style={{
                          fontFamily: 'var(--font-unbounded)',
                          fontWeight: 400,
                          fontSize: 'clamp(13px, 1.5vw, 16px)',
                          lineHeight: '1.61',
                          letterSpacing: '0.03em',
                          color: 'black',
                        }}
                      >
                        Issue {String(issue.issueNumber).padStart(2, '0')} :{' '}
                        {issue.title}
                      </p>
                      <p
                        style={{
                          fontFamily: 'var(--font-work-sans)',
                          fontSize: 'clamp(12px, 1.2vw, 16px)',
                          lineHeight: '1.61',
                          letterSpacing: '-0.05em',
                          color: 'black',
                        }}
                      >
                        {issue.description}
                      </p>
                    </div>
                  </Link>
                  {idx === pageIssues.length - 1 && (
                    <div className="border-t border-[#e0e0e0]" />
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* ── Pagination ─────────────────────────────────────────── */}
        {totalPages > 1 && (
          <section className="py-8 flex items-center justify-center gap-4">
            <button
              onClick={() => goTo(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-5 h-5 transition"
              style={{ opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              aria-label="Previous page"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goTo(page)}
                style={{
                  fontFamily: 'var(--font-unbounded)',
                  fontSize: '13px',
                  letterSpacing: '0.75em',
                  color: page === currentPage ? 'black' : '#909090',
                  fontWeight: page === currentPage ? 600 : 400,
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                }}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goTo(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center w-5 h-5 transition"
              style={{ opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
              aria-label="Next page"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
