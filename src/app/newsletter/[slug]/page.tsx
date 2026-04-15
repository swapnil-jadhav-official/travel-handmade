'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getNewsletterBySlug } from '@/lib/firestore';
import type { NewsletterIssue } from '@/data/newsletters';

// ── Shared text styles ──────────────────────────────────────────────────────
const bodyStyle: React.CSSProperties = {
  fontFamily: 'var(--font-work-sans)',
  fontSize: '16px',
  lineHeight: '1.61',
  letterSpacing: '-0.05em',
  color: 'black',
};

export default function NewsletterDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [issue, setIssue] = useState<NewsletterIssue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getNewsletterBySlug(slug)
      .then(setIssue)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p style={{ fontFamily: 'var(--font-work-sans)', fontSize: '14px', color: '#888' }}>
          Loading…
        </p>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p style={{ fontFamily: 'var(--font-work-sans)', fontSize: '14px', color: '#888' }}>
          Issue not found.
        </p>
      </div>
    );
  }

  // Split editor letter paragraphs around the pull quote insertion point
  const splitAt = issue.pullQuoteAfterIndex ?? issue.editorLetterParagraphs.length;
  const firstParas = issue.editorLetterParagraphs.slice(0, splitAt);
  const secondParas = issue.editorLetterParagraphs.slice(splitAt);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1">
        {/*
         * The entire page content sits in a centred #f7f7f9 column — 765 px wide
         */}
        <div
          className="mx-auto bg-[#f7f7f9]"
          style={{ maxWidth: '765px' }}
        >
          {/* ── Cover ──────────────────────────────────────────────── */}
          <div
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: '152 / 190',
              background: issue.accentColor,
            }}
          >
            {/* TH logo */}
            <div
              className="absolute overflow-hidden"
              style={{
                left: '4.6%',
                top: '3.7%',
                width: '9.9%',
                height: '3.2%',
              }}
            >
              <img
                src="/th-logo-new.png"
                alt="Travel Handmade"
                className="w-full h-full object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>

            {/* Issue label — top-right */}
            <div
              className="absolute text-right"
              style={{ right: '5.9%', top: '3.7%' }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-work-sans)',
                  fontWeight: 600,
                  fontSize: 'clamp(6px, 1.3vw, 10px)',
                  letterSpacing: '0.15px',
                  lineHeight: 1,
                  color: 'white',
                }}
              >
                ISSUE {String(issue.issueNumber).padStart(2, '0')}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-work-sans)',
                  fontWeight: 600,
                  fontSize: 'clamp(6px, 1.3vw, 10px)',
                  letterSpacing: '0.15px',
                  lineHeight: 1.4,
                  textTransform: 'uppercase',
                  color: 'white',
                }}
              >
                {issue.title}
              </p>
            </div>

            {/* DEPARTURES */}
            <h1
              className="absolute w-full text-center text-white"
              style={{
                top: '22.1%',
                fontFamily: 'var(--font-unbounded)',
                fontWeight: 200,
                fontSize: 'clamp(32px, 12.5vw, 99px)',
                letterSpacing: '-0.04em',
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >
              Departures
            </h1>

            {/* Photo */}
            <div
              className="absolute overflow-hidden"
              style={{
                left: '5.3%',
                right: '5.3%',
                top: '33.2%',
                bottom: '3.7%',
              }}
            >
              <img
                src={issue.heroImage}
                alt={`Departures — Issue ${issue.issueNumber}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* ── Content ──────────────────────────────────────────── */}
          <div
            className="py-12 sm:py-16"
            style={{ paddingLeft: 'clamp(24px, 10%, 75px)', paddingRight: 'clamp(24px, 10%, 79px)' }}
          >
            {/* EDITOR'S LETTER label */}
            <p className="mb-6" style={bodyStyle}>
              EDITOR&apos;S LETTER
            </p>

            {/* First batch of paragraphs */}
            {firstParas.map((para, i) => (
              <p key={i} className="mb-4" style={bodyStyle}>
                {para}
              </p>
            ))}

            {/* Pull quote */}
            <blockquote
              className="text-center my-10"
              style={{
                fontFamily: 'var(--font-unbounded)',
                fontWeight: 400,
                fontSize: 'clamp(13px, 2vw, 16px)',
                lineHeight: '1.61',
                letterSpacing: '-0.05em',
                color: '#7b7b7b',
              }}
            >
              {issue.pullQuote}
            </blockquote>

            {/* Second batch of paragraphs */}
            {secondParas.map((para, i) => (
              <p key={i} className="mb-4" style={bodyStyle}>
                {para}
              </p>
            ))}

            {/* Signature — Florestta Opheralio */}
            <p
              className="mt-6 text-center"
              style={{
                fontFamily: 'var(--font-florestta), cursive',
                fontSize: 'clamp(36px, 8vw, 64px)',
                lineHeight: '1.61',
                color: 'black',
                fontStyle: 'normal',
              }}
            >
              -{issue.editorName}
            </p>

            {/* Editor title */}
            <p
              className="text-center mt-1 mb-12"
              style={{
                fontFamily: 'var(--font-work-sans)',
                fontWeight: 500,
                fontSize: '10px',
                letterSpacing: '-0.5px',
                color: '#858585',
              }}
            >
              {issue.editorTitle}
            </p>

            {/* Divider */}
            <div className="border-t border-[#d0d0d0] mb-10" />

            {/* IN THIS ISSUE label */}
            <p className="mb-8" style={bodyStyle}>
              IN THIS ISSUE
            </p>

            {/* 2×2 article grid */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2"
              style={{ gap: '40px 40px' }}
            >
              {issue.articles.map((article) => (
                <div key={article.id} className="flex flex-col gap-2">
                  <div className="overflow-hidden" style={{ aspectRatio: '268 / 246' }}>
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p
                    className="mt-2"
                    style={{
                      fontFamily: 'var(--font-unbounded)',
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '1.1',
                      letterSpacing: '0.03em',
                      color: 'black',
                    }}
                  >
                    {article.title}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-work-sans)',
                      fontSize: '10px',
                      letterSpacing: '0.03em',
                      color: 'black',
                    }}
                  >
                    {article.category}&nbsp;&nbsp;|&nbsp;&nbsp;
                    <span className="uppercase">{article.author}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom divider */}
            <div className="border-t border-[#d0d0d0] mt-12 mb-8" />

            {/* READ MORE / FOLLOW ALONG / PASS IT ON */}
            <div className="grid grid-cols-3 text-center pb-8">
              {[
                { label: 'Read More', href: '/blog' },
                { label: 'Follow  Along', href: '#' },
                { label: 'Pass  It  On', href: '#' },
              ].map(({ label, href }) => (
                <div key={label}>
                  <Link
                    href={href}
                    style={{
                      fontFamily: 'var(--font-unbounded)',
                      fontWeight: 300,
                      fontSize: '10px',
                      letterSpacing: '-0.5px',
                      textDecoration: 'underline',
                      textTransform: 'uppercase',
                      color: '#7b7b7b',
                    }}
                  >
                    {label}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
