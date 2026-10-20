export default function ComingSoon() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#0a0a0a', color: 'white' }}
    >
      {/* Top bar */}
      <div className="px-6 sm:px-12 lg:px-16 pt-8 sm:pt-10 flex items-center justify-between">
        <img
          src="/th-logo-new.png"
          alt="Travel Handmade"
          className="h-5 sm:h-6 w-auto object-contain"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
        <a
          href="https://www.instagram.com/travelhandmade_mag/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-work-sans)',
            fontSize: '10px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
            textDecoration: 'none',
          }}
        >
          Instagram
        </a>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center py-20">
        {/* Eyebrow */}
        <p
          className="mb-10 sm:mb-14"
          style={{
            fontFamily: 'var(--font-work-sans)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
          }}
        >
          Something new is on its way
        </p>

        {/* Headline */}
        <h1
          className="mb-8 sm:mb-10"
          style={{
            fontFamily: 'var(--font-unbounded)',
            fontWeight: 200,
            fontSize: 'clamp(36px, 8vw, 96px)',
            letterSpacing: '-0.04em',
            lineHeight: 1,
            textTransform: 'uppercase',
            color: 'white',
            maxWidth: '900px',
          }}
        >
          A New Chapter
          <br />
          <span style={{ color: '#c9b99a' }}>Is Loading</span>
        </h1>

        {/* Divider line */}
        <div
          className="mb-8 sm:mb-10"
          style={{ width: '40px', height: '1px', backgroundColor: 'rgba(255,255,255,0.25)' }}
        />

        {/* Body text */}
        <p
          style={{
            fontFamily: 'var(--font-work-sans)',
            fontSize: 'clamp(14px, 1.5vw, 16px)',
            lineHeight: '1.7',
            letterSpacing: '-0.02em',
            color: 'rgba(255,255,255,0.6)',
            maxWidth: '520px',
          }}
        >
          Travel Handmade is being reimagined. We are putting the final touches
          on a new version of the publication — one that goes deeper, looks
          sharper, and tells better stories. Check back soon.
        </p>

        {/* CTA */}
        <a
          href="https://www.instagram.com/travelhandmade_mag/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-12 sm:mt-16 inline-block"
          style={{
            fontFamily: 'var(--font-unbounded)',
            fontWeight: 500,
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#0a0a0a',
            backgroundColor: '#c9b99a',
            padding: '14px 32px',
            textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Follow Along
        </a>
      </div>

      {/* Bottom bar */}
      <div
        className="px-6 sm:px-12 lg:px-16 pb-8 sm:pb-10 flex items-center justify-between"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px' }}
      >
        <p
          style={{
            fontFamily: 'var(--font-work-sans)',
            fontSize: '10px',
            letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.25)',
          }}
        >
          © {new Date().getFullYear()} Travel Handmade
        </p>
        <a
          href="mailto:editor@travelhandmade.com"
          style={{
            fontFamily: 'var(--font-work-sans)',
            fontSize: '10px',
            letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.25)',
            textDecoration: 'none',
          }}
        >
          editor@travelhandmade.com
        </a>
      </div>
    </div>
  );
}
