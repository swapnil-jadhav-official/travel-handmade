import Header from '@/components/Common/Header';
import Footer from '@/components/Common/Footer';

const contactImage = '/contact-image.png';
const pinImage = '/pin-image.png';

const bodyStyle = {
  fontFamily: 'var(--font-work-sans)',
  fontSize: '16px',
  lineHeight: '1.61',
  letterSpacing: '-0.05em',
} as const;

const labelStyle = {
  fontFamily: 'var(--font-work-sans)',
  fontWeight: 500,
  fontSize: '10px',
  letterSpacing: '0.05em',
  textTransform: 'uppercase' as const,
} as const;

const sectionHeadingStyle = {
  fontFamily: 'var(--font-unbounded)',
  fontWeight: 500,
  fontSize: '16px',
  lineHeight: '1.1',
  letterSpacing: '0.03em',
} as const;

export default function ContactUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1">
        {/* ── Page Title ─────────────────────────────────────────── */}
        <section className="px-6 sm:px-8 lg:px-12 pt-10 sm:pt-14 lg:pt-16 pb-8">
          <h1
            className="text-center mx-auto mb-8 sm:mb-10 lg:mb-12"
            style={{
              fontFamily: 'var(--font-unbounded)',
              fontWeight: 500,
              fontSize: 'clamp(22px, 3vw, 32px)',
              lineHeight: '110%',
              letterSpacing: '-0.05em',
              maxWidth: '660px',
            }}
          >
            Write To Us,{' '}
            <span className="block">We&apos;d Love To Hear From You</span>
          </h1>
          <div className="border-t border-black" />
        </section>

        {/* ── Contact Info: Image + Two Enquiry Types ─────────────── */}
        <section className="px-6 sm:px-8 lg:px-12 py-10 sm:py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            {/* Left: hero image */}
            <div className="w-full lg:w-[44%] flex-shrink-0">
              <img
                src={contactImage}
                alt="Contact Travel Handmade"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Right: enquiry sections */}
            <div className="flex-1 flex flex-col gap-0">
              {/* 01 | Hospitality Brands */}
              <div className="flex flex-col gap-4">
                <p style={labelStyle} className="text-black">
                  01&nbsp;&nbsp;|&nbsp;&nbsp;For Hospitality Brands
                </p>
                <h2 style={sectionHeadingStyle}>
                  Have A Brand Story Worth Telling?
                </h2>
                <p style={bodyStyle}>
                  Loved reading our stories and want to team up with us? Have a
                  hospitality brand story and looking for a platform to put it
                  out there? We&apos;d love to hear from you.
                </p>
                <a
                  href="mailto:collaborations@travelhandmade.com"
                  style={{
                    fontFamily: 'var(--font-work-sans)',
                    fontWeight: 500,
                    fontStyle: 'italic',
                    fontSize: '16px',
                    lineHeight: '1.61',
                    textDecoration: 'underline',
                    color: '#020202',
                  }}
                >
                  collaborations@travelhandmade.com
                </a>
              </div>

              {/* Divider */}
              <div className="border-t border-[#E9E9E9] my-8" />

              {/* 02 | Travellers */}
              <div className="flex flex-col gap-4">
                <p style={labelStyle} className="text-black">
                  02&nbsp;&nbsp;|&nbsp;&nbsp;For Travellers
                </p>
                <h2 style={sectionHeadingStyle}>
                  A Journey That Stayed With You?
                </h2>
                <p style={bodyStyle}>
                  We&apos;re rolling out a new section called Traveller.
                  Dedicated to real explorers and photographers sharing the
                  journeys that changed them. Photo essays and visual stories
                  especially welcome.
                </p>
                <div style={bodyStyle}>
                  <p>Stories That Inspired Us To Travel:</p>
                  <p style={{ color: '#808080' }}>
                    Ben Richards — A Craft Trail Around Japan&apos;s Saga
                    Prefecture
                    <br />
                    Andrew Macdonald — On A Photographic Safari
                  </p>
                </div>
                <a
                  href="mailto:editor@travelhandmade.com"
                  style={{
                    fontFamily: 'var(--font-work-sans)',
                    fontWeight: 500,
                    fontStyle: 'italic',
                    fontSize: '16px',
                    lineHeight: '1.61',
                    textDecoration: 'underline',
                    color: '#020202',
                  }}
                >
                  editor@travelhandmade.com
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── A Call To The Writers! ──────────────────────────────── */}
        <section className="px-6 sm:px-8 lg:px-12 pt-10 sm:pt-12 lg:pt-16 pb-4">
          <h2 style={sectionHeadingStyle}>A Call To The Writers!</h2>
        </section>

        {/* ── Sticky Notes ────────────────────────────────────────── */}
        <section className="px-6 sm:px-8 lg:px-12 py-10 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1: What We're Looking For */}
            <div className="relative">
              {/* Pin */}
              <div className="absolute -top-5 left-10 z-10">
                <img src={pinImage} alt="" className="h-14 w-auto" />
              </div>
              <div
                className="bg-[#f9f0d5] shadow-[5px_8px_3.7px_-4px_rgba(0,0,0,0.25)] p-6 pt-10 h-full"
                style={{ opacity: 0.95 }}
              >
                <p style={labelStyle} className="mb-3">
                  What We&apos;re Looking For
                </p>
                <h3
                  style={{
                    fontFamily: 'var(--font-unbounded)',
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '1.61',
                    marginBottom: '12px',
                  }}
                >
                  Got a story the road gave you?
                </h3>
                <p style={bodyStyle} className="mb-4">
                  Travel Handmade is always on the lookout for fresh travel
                  voices and original story ideas. Before sending in a pitch,
                  take a moment to look through our categories.
                </p>
                <ul
                  className="list-disc pl-5 space-y-1"
                  style={bodyStyle}
                >
                  <li>Experiential stories at the heart of a place</li>
                  <li>
                    Reported travel features — culture &amp; destination
                  </li>
                  <li>Unique places, communities, experiences</li>
                  <li>Speaks to modern travellers, 20s to 40s</li>
                  <li>Well-researched opinion pieces</li>
                  <li>Destinations from a fresh angle</li>
                </ul>
                <p
                  style={{
                    fontFamily: 'var(--font-work-sans)',
                    fontStyle: 'italic',
                    fontWeight: 300,
                    fontSize: '16px',
                    lineHeight: '1.61',
                    color: '#9c0000',
                    marginTop: '16px',
                  }}
                >
                  ...no listicles, please ✕
                </p>
              </div>
            </div>

            {/* Card 2: What We're NOT Looking For */}
            <div className="relative">
              {/* Pin */}
              <div className="absolute -top-5 left-10 z-10">
                <img src={pinImage} alt="" className="h-14 w-auto" />
              </div>
              <div
                className="bg-[#f9f0d5] shadow-[5px_8px_3.7px_-4px_rgba(0,0,0,0.25)] p-6 pt-10 h-full"
                style={{ opacity: 0.95 }}
              >
                <p style={labelStyle} className="mb-3">
                  What We&apos;re Not Looking For
                </p>
                <h3
                  style={{
                    fontFamily: 'var(--font-unbounded)',
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '1.61',
                    marginBottom: '12px',
                  }}
                >
                  Save the pitch. This isn&apos;t for us.
                </h3>
                <p style={bodyStyle} className="mb-4">
                  We want honest, experiential storytelling. Here&apos;s what
                  doesn&apos;t fit the TH voice:
                </p>
                <div className="space-y-1" style={bodyStyle}>
                  {[
                    'Promotional or advertorial content',
                    'Hotel reviews or hotel round-ups',
                    'Listicles',
                    'City guides or destination round-ups',
                    'Celebrity or influencer profiles',
                    'Diary-style trip recaps',
                  ].map((item) => (
                    <p key={item}>
                      <span>✕</span>{' '}
                      <span>{item}</span>
                    </p>
                  ))}
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-work-sans)',
                    fontStyle: 'italic',
                    fontWeight: 300,
                    fontSize: '16px',
                    lineHeight: '1.61',
                    marginTop: '16px',
                  }}
                >
                  However, if you&apos;ve been on a press trip where a retreat
                  is genuinely putting a destination on the map — we&apos;d love
                  to hear that story.
                </p>
              </div>
            </div>

            {/* Card 3: How to Pitch */}
            <div className="relative">
              {/* Pin */}
              <div className="absolute -top-5 left-10 z-10">
                <img src={pinImage} alt="" className="h-14 w-auto" />
              </div>
              <div
                className="bg-[#f9f0d5] shadow-[5px_8px_3.7px_-4px_rgba(0,0,0,0.25)] p-6 pt-10 h-full flex flex-col"
                style={{ opacity: 0.95 }}
              >
                <p style={labelStyle} className="mb-3">
                  How to Pitch
                </p>
                <h3
                  style={{
                    fontFamily: 'var(--font-unbounded)',
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '1.61',
                    marginBottom: '12px',
                  }}
                >
                  What to send us
                </h3>
                <p style={bodyStyle} className="mb-4">
                  A good pitch is specific. Tell us the story, not just the
                  topic.
                </p>
                <ul
                  className="list-disc pl-5 space-y-1 flex-1"
                  style={bodyStyle}
                >
                  <li>3–4 links to published work or portfolio</li>
                  <li>Your story pitch (the story, not just topic)</li>
                  <li>A headline idea that matches TH&apos;s voice</li>
                  <li>How you&apos;ll source images / photography links</li>
                </ul>

                {/* Highlighted email strip */}
                <div className="mt-6 relative">
                  <div className="bg-[#f4e6b2] px-5 py-4 border-l-[14px] border-[#e8daa5]">
                    <p
                      style={{
                        fontFamily: 'var(--font-work-sans)',
                        fontWeight: 500,
                        fontSize: '16px',
                        lineHeight: '1.61',
                        letterSpacing: '0.05em',
                        color: '#757575',
                        textTransform: 'uppercase',
                      }}
                    >
                      Send Editorial Queries To
                    </p>
                    <a
                      href="mailto:editor@travelhandmade.com"
                      style={{
                        fontFamily: 'var(--font-work-sans)',
                        fontWeight: 500,
                        fontStyle: 'italic',
                        fontSize: '16px',
                        lineHeight: '1.61',
                        textDecoration: 'underline',
                        color: '#020202',
                        display: 'block',
                      }}
                    >
                      editor@travelhandmade.com
                    </a>
                  </div>
                </div>

                <p
                  style={{
                    fontFamily: 'var(--font-work-sans)',
                    fontStyle: 'italic',
                    fontWeight: 300,
                    fontSize: '16px',
                    lineHeight: '1.61',
                    marginTop: '16px',
                  }}
                >
                  We look forward to your pitch ✦
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA: Become a TH Traveller ───────────────────────────── */}
        <section className="bg-black text-white py-16 sm:py-20 lg:py-24 px-6 sm:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6 sm:gap-8">
            <h2
              style={{
                fontFamily: 'var(--font-unbounded)',
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: '1.1',
                letterSpacing: '0.03em',
                color: 'white',
              }}
            >
              Become a TH Traveller
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-work-sans)',
                fontSize: '16px',
                lineHeight: '1.61',
                letterSpacing: '-0.05em',
                color: 'white',
                maxWidth: '731px',
              }}
            >
              What sets this category apart is its authenticity. Share it with
              us and become part of our growing community of storytellers and
              explorers — a global circle of readers, writers, and wanderers who
              believe in stories that move, inspire, and stay with you long after
              the journey ends. For getting featured, send original pitches to:
            </p>
            <a
              href="mailto:editor@travelhandmade.com"
              className="inline-block bg-white text-black border border-black hover:opacity-80 transition px-8 py-3"
              style={{
                fontFamily: 'var(--font-unbounded)',
                fontWeight: 500,
                fontSize: '10px',
                letterSpacing: '0.03em',
              }}
            >
              EDITOR@TRAVELHANDMADE.COM
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
