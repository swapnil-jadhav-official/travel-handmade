import Header from '@/components/Common/Header';
import Footer from '@/components/Common/Footer';

const postalStampsImage = '/postal-stamp.png';

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1">
        {/* ── Page Title ──────────────────────────────────────────── */}
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
            The Defining Voice in Conscious Travel and Cultural Storytelling
          </h1>
          <div className="border-t border-black" />
        </section>

        {/* ── What Is Travel Handmade? ─────────────────────────────── */}
        <section className="px-6 sm:px-8 lg:px-12 py-10 sm:py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            {/* Postal Stamps image */}
            <div className="w-full lg:w-[38%] flex-shrink-0">
              <img
                src={postalStampsImage}
                alt="Travel Handmade Postal Stamps"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Right-side content */}
            <div className="flex-1 flex flex-col gap-6">
              <h2 className="heading-2">What Is Travel Handmade?</h2>

              <p
                style={{
                  fontFamily: 'var(--font-work-sans)',
                  fontSize: '16px',
                  lineHeight: '1.61',
                  letterSpacing: '-0.05em',
                }}
              >
                Travel Handmade is a digital publication dedicated to a more
                considered way of travelling. At its core is a community of
                next-generation travellers who value culture, craftsmanship, and
                lived experience over performative luxury. Moving beyond
                checklist itineraries and how-to sidebars, TH examines the
                cultural climates that shape destinations: the philosophies,
                histories, materials, and people that give them character. Our
                stories linger after the crowds disperse, tracing the narratives
                that surface when the dust settles on the road less travelled.
                This is travel that begins where the guidebooks end.
              </p>

              {/* Inline quote with vertical rule */}
              <div className="flex gap-5 py-2">
                <div className="w-px bg-black flex-shrink-0 self-stretch" />
                <blockquote
                  style={{
                    fontFamily: 'var(--font-unbounded)',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '1.61',
                    letterSpacing: '0.05em',
                  }}
                >
                  "Our stories linger after the crowds disperse, tracing the
                  narratives that surface when the dust settles on the road less
                  travelled"
                </blockquote>
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-work-sans)',
                  fontSize: '16px',
                  lineHeight: '1.61',
                  letterSpacing: '-0.05em',
                }}
              >
                We are a collective of writers, photojournalists, and
                independent creators who have reported and published across
                platforms such as Travel + Leisure, ELLE Decor India,
                Architectural Digest, and Condé Nast Traveller inter alia.
                Travel Handmade brings together some of India's most outspoken
                voices, driven by curiosity and a commitment to stories with
                depth. We have travelled widely, but we are not interested in
                ticking off destinations. What stays with us is the sense that
                much of the world remains unseen, misrepresented, or flattened
                into clichés.
              </p>
            </div>
          </div>
        </section>

        {/* ── Why Should I Read TH? ────────────────────────────────── */}
        <section className="px-6 sm:px-8 lg:px-12 py-10 sm:py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            {/* Left: section header + three items */}
            <div className="flex-1">
              <h2 className="heading-2 mb-8 sm:mb-10">Why Should I Read TH?</h2>

              {[
                {
                  label: 'Immersive Photography',
                  body: 'Through on-the-ground storytelling and photography, our journalists take you beyond the obvious, into places that resist simplification.',
                },
                {
                  label: 'The Overlooked Neighbourhood',
                  body: "We'll point you toward the close-knit communities subconsciously reshaping places. Stories that question the idea of travel as something easy or familiar.",
                },
                {
                  label: 'Stories Built to Endure',
                  body: 'These are journeys that invite you to slow down, pay attention, and rethink what it really means to get lost. Thoughtful reportage on wandering this planet.',
                },
              ].map(({ label, body }) => (
                <div
                  key={label}
                  className="border-t border-[#E9E9E9] py-6"
                >
                  <p
                    className="mb-3 uppercase"
                    style={{
                      fontFamily: 'var(--font-work-sans)',
                      fontWeight: 400,
                      fontSize: '15px',
                      letterSpacing: '0.075em',
                    }}
                  >
                    {label}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-work-sans)',
                      fontSize: '16px',
                      lineHeight: '1.61',
                      letterSpacing: '-0.05em',
                    }}
                  >
                    {body}
                  </p>
                </div>
              ))}
              <div className="border-t border-[#E9E9E9]" />
            </div>

            {/* Right: rotated quote card */}
            <div className="lg:w-[40%] flex-shrink-0 flex items-center justify-center py-8 lg:py-0">
              <div
                className="bg-[#f9f0d5] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-8 max-w-xs w-full"
                style={{ transform: 'rotate(3.3deg)' }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-unbounded)',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '2',
                    letterSpacing: '0.05em',
                  }}
                >
                  "TH is for those who find big, sprawling cities no longer hold
                  their attention. These are journeys that invite you to slow
                  down, pay attention, and rethink what it really means to get
                  lost"
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-unbounded)',
                    fontWeight: 400,
                    fontSize: '10px',
                    lineHeight: '2',
                    color: '#757171',
                    marginTop: '8px',
                  }}
                >
                  -TH Editorial Team
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Be A Part Of The Community (CTA) ────────────────────── */}
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
              Be A Part Of The Community
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
              Travel Handmade is for those who travel not to escape, but to pay
              attention. Join a small, but ever-expanding circle of wanderers,
              documentarians, and wordsmiths who are drawn to the static charge
              of unfamiliar streets and overlooked landscapes. Read us slowly.
              Subscribe to our newsletters. Sit with our stories. And if the
              road has already changed you in ways that are hard to explain,
              reach out. Wherever you are, and wherever you're headed next, TH
              will meet you there, matching your pace.
            </p>

            <a
              href="/newsletter"
              className="inline-block bg-white text-black border border-black hover:opacity-80 transition px-8 py-3"
              style={{
                fontFamily: 'var(--font-unbounded)',
                fontWeight: 500,
                fontSize: '10px',
                letterSpacing: '0.03em',
              }}
            >
              CHECK OUT OUR NEWSLETTER
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
