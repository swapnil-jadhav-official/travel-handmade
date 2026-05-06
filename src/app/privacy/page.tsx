'use client';

import Header from '@/components/Common/Header';
import Footer from '@/components/Common/Footer';

const bodyStyle = {
  fontFamily: 'var(--font-work-sans)',
  fontSize: '16px',
  lineHeight: '1.61',
  letterSpacing: '-0.05em',
} as const;

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Privacy Header Section */}
        <section className="px-6 sm:px-8 lg:px-12 pb-8">
          <h1 className="static-page-title">
            Privacy Policy
            <span className="block">and Terms of Use</span>
          </h1>
          <div className="privacy-divider" />
        </section>

        {/* Privacy Policy Content */}
        <article className="max-w-3xl mx-auto px-6 py-12 lg:px-8">
          {/* Privacy Policy Section */}
          <section className="mb-16">
            <p
              style={{
                fontFamily: 'var(--font-unbounded)',
                fontWeight: 500,
                fontSize: '15px',
                lineHeight: '138%',
                color: '#000000',
              }}
              className="mb-10"
            >
              How We Handle Your Information
            </p>

            {/* Section 1 */}
            <div className="mb-10">
              <p style={bodyStyle} className="text-black mb-4">
1. Who We Are
              </p>
              <div style={bodyStyle} className="text-black space-y-4">
                <p>
                  Welcome to Travel Handmade ("we", "us" or "our") operates and manages the website, and mobile or tablet applications accessible at <a href="https://travelhandmade.com/" className="text-blue-600 hover:underline">https://travelhandmade.com/</a> (hereinafter referred to as, "Website"), through which it, inter alia, facilitates access to curated and hand-picked digital content and publications in connection with modern living, travel, adventure, lifestyle, etc. ("Services") to the users of the Website.
                </p>
                <p>
                  We are a registered MSME under UDYAM-MH-19-0419052
                </p>
                <p>
                  We are committed to protecting your privacy and ensuring transparency in how your personal information is collected, used, and shared.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="mb-10">
              <p style={bodyStyle} className="text-black mb-4">
2. Information We Collect
              </p>
              <div style={bodyStyle} className="text-black space-y-3">
                <p>
                  We may collect the following types of information:
                </p>
                <div className="ml-4">
                  <p className="mb-3">
                    a. Personal Information
                    <ul className="list-disc ml-5 mt-2 space-y-1">
                      <li>Name</li>
                      <li>Email address</li>
                      <li>Phone number (if provided)</li>
                      <li>Any details you submit via forms, subscriptions, or correspondence</li>
                    </ul>
                  </p>
                  <p className="mb-3">
                    b. Usage Data
                    <ul className="list-disc ml-5 mt-2 space-y-1">
                      <li>Pages visited</li>
                      <li>Time spent on the site</li>
                      <li>Click behavior and navigation paths</li>
                    </ul>
                  </p>
                  <p className="mb-3">
                    c. Device & Technical Information
                    <ul className="list-disc ml-5 mt-2 space-y-1">
                      <li>IP address</li>
                      <li>Browser type and version</li>
                      <li>Device type and operating system</li>
                    </ul>
                  </p>
                  <p>
                    d. User-Generated Content
                    <ul className="list-disc ml-5 mt-2 space-y-1">
                      <li>Comments, reviews, or other content you submit</li>
                    </ul>
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="mb-10">
              <p style={bodyStyle} className="text-black mb-4">
3. How We Use Your Information
              </p>
              <div style={bodyStyle} className="text-black">
                <p className="mb-3">
                  We use your information to:
                </p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>Deliver and personalize content and editorial recommendations</li>
                  <li>Send newsletters, updates, and curated travel inspiration</li>
                  <li>Improve website functionality, design, and user experience</li>
                  <li>Analyze audience engagement and trends</li>
                  <li>Support marketing, partnerships, and promotional campaigns</li>
                  <li>Respond to inquiries or requests</li>
                </ul>
              </div>
            </div>

            {/* Section 4 */}
            <div className="mb-10">
              <p style={bodyStyle} className="text-black mb-4">
4. Cookies & Tracking Technologies
              </p>
              <div style={bodyStyle} className="text-black space-y-4">
                <p>
                  We use cookies and similar technologies to enhance your experience. These may include:
                </p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>Essential Cookies: Required for site functionality</li>
                  <li>Analytics Cookies: Help us understand how users interact with our content</li>
                  <li>Advertising Cookies: Used to deliver relevant ads (if applicable)</li>
                </ul>
                <p>
                  You can manage or disable cookies through your browser settings.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div className="mb-10">
              <p style={bodyStyle} className="text-black mb-4">
5. Advertising & Affiliate Links
              </p>
              <div style={bodyStyle} className="text-black space-y-4">
                <p>
                  Our website may include:
                </p>
                <ul className="list-disc ml-5 space-y-2 mb-4">
                  <li>Sponsored content and advertisements</li>
                  <li>Affiliate links to hotels, products, or services</li>
                </ul>
                <p>
                  If you click on an affiliate link and make a purchase, we may earn a commission at no additional cost to you. These partnerships help support our editorial work.
                </p>
              </div>
            </div>

            {/* Section 6 */}
            <div className="mb-10">
              <p style={bodyStyle} className="text-black mb-4">
6. Sharing of Information
              </p>
              <div style={bodyStyle} className="text-black space-y-4">
                <p>
                  We may share your information with:
                </p>
                <ul className="list-disc ml-5 space-y-2 mb-4">
                  <li>Trusted service providers (hosting, analytics, email platforms)</li>
                  <li>Advertising and marketing partners (where applicable)</li>
                  <li>Authorities when required by law or legal process</li>
                  <li>Third parties in the event of a business transfer or restructuring</li>
                </ul>
                <p>
                  We do not sell your personal data to third parties.
                </p>
              </div>
            </div>

            {/* Section 7 */}
            <div className="mb-10">
              <p style={bodyStyle} className="text-black mb-4">
7. Third-Party Links
              </p>
              <div style={bodyStyle} className="text-black">
                <p>
                  Our content may include links to external websites (such as hotels, airlines, or booking platforms). We are not responsible for the privacy practices or content of those sites.
                </p>
              </div>
            </div>

            {/* Section 8 */}
            <div className="mb-10">
              <p style={bodyStyle} className="text-black mb-4">
8. Data Retention
              </p>
              <div style={bodyStyle} className="text-black space-y-4">
                <p>
                  We retain your personal information only for as long as necessary to:
                </p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>Fulfill the purposes outlined in this policy</li>
                  <li>Comply with legal and regulatory obligations</li>
                  <li>Resolve disputes and enforce agreements</li>
                </ul>
              </div>
            </div>

            {/* Section 9 */}
            <div className="mb-10">
              <p style={bodyStyle} className="text-black mb-4">
9. Your Rights
              </p>
              <div style={bodyStyle} className="text-black space-y-4">
                <p>
                  Depending on your location, you may have the right to:
                </p>
                <ul className="list-disc ml-5 space-y-2 mb-4">
                  <li>Access the personal data we hold about you</li>
                  <li>Request correction or deletion of your data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Withdraw consent at any time</li>
                  <li>Request a copy of your data (data portability)</li>
                </ul>
                <p>
                  To exercise these rights, please contact us at the details below.
                </p>
              </div>
            </div>

            {/* Section 10 */}
            <div className="mb-10">
              <p style={bodyStyle} className="text-black mb-4">
10. Data Security
              </p>
              <div style={bodyStyle} className="text-black">
                <p>
                  We implement appropriate technical and organizational measures to protect your information from unauthorized access, misuse, or disclosure. However, no digital platform can guarantee absolute security.
                </p>
              </div>
            </div>

            {/* Section 11 */}
            <div className="mb-10">
              <p style={bodyStyle} className="text-black mb-4">
11. Children's Privacy
              </p>
              <div style={bodyStyle} className="text-black">
                <p>
                  Our website is not intended for children under the age of 13 (or applicable age in your jurisdiction). We do not knowingly collect personal data from children.
                </p>
              </div>
            </div>

            {/* Section 12 */}
            <div className="mb-10">
              <p style={bodyStyle} className="text-black mb-4">
12. International Users
              </p>
              <div style={bodyStyle} className="text-black">
                <p>
                  As a global publication, your information may be transferred to and processed in countries outside your own. By using our site, you consent to such transfers in accordance with this policy.
                </p>
              </div>
            </div>

            {/* Section 13 */}
            <div className="mb-10">
              <p style={bodyStyle} className="text-black mb-4">
13. Updates to This Policy
              </p>
              <div style={bodyStyle} className="text-black">
                <p>
                  We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. The updated version will always be available on this page with a revised "Last Updated" date.
                </p>
              </div>
            </div>

            {/* Section 14 */}
            <div className="mb-16">
              <p style={bodyStyle} className="text-black mb-4">
14. Contact Us
              </p>
              <div style={bodyStyle} className="text-black">
                <p>
                  For any questions, requests, or concerns regarding this Privacy Policy, please contact us at:
                </p>
                <p className="mt-4">
                  Email: <a href="mailto:editor@travelhandmade.com" className="text-blue-600 hover:underline">editor@travelhandmade.com</a>
                </p>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-gray-700 my-16" />

          {/* Copyright Policy Section */}
          <section className="mb-16">
            <p
              style={{
                fontFamily: 'var(--font-unbounded)',
                fontWeight: 500,
                fontSize: '15px',
                lineHeight: '138%',
                color: '#000000',
              }}
              className="mb-4"
            >
              Copyright Policy
            </p>
            <div
              style={{
                fontFamily: 'var(--font-work-sans)',
                fontWeight: 400,
                fontSize: '15px',
                lineHeight: '161%',
                textAlign: 'justify',
                letterSpacing: '-0.05em',
                color: '#000000',
              }}
              className="mb-8"
            >
              <p className="mb-2">
                Effective Date: 18th April, 2026
              </p>
              <p>
                Last Updated: 18th April, 2026
              </p>
            </div>

            {/* Copyright Section 1 */}
            <div className="mb-10">
              <p style={bodyStyle} className="text-black mb-4">
                1. Ownership of Content
              </p>
              <div style={bodyStyle} className="text-black">
                <p>
                  All content published on Travel Handmade platform ("we," "us," or "our")—including but not limited to articles, photographs, illustrations, videos, design elements, graphics, logos, and editorial material—is the intellectual property of Travel Handmade or its respective creators and licensors. All rights are reserved unless otherwise stated.
                </p>
              </div>
            </div>

            {/* Copyright Section 2 */}
            <div className="mb-10">
              <p style={bodyStyle} className="text-black mb-4">
                2. Copyright Protection
              </p>
              <div style={bodyStyle} className="text-black space-y-4">
                <p>
                  All materials on this website are protected under applicable copyright laws and international intellectual property treaties. This includes original editorial content as well as commissioned or licensed creative works.
                </p>
                <p>
                  Unauthorized use, reproduction, distribution, or modification of any content is strictly prohibited without prior written consent.
                </p>
              </div>
            </div>

            {/* Copyright Section 3 */}
            <div className="mb-10">
              <p style={bodyStyle} className="text-black mb-4">
                3. Permitted Use
              </p>
              <div style={bodyStyle} className="text-black space-y-4">
                <p>
                  You may:
                </p>
                <ul className="list-disc ml-5 space-y-2 mb-4">
                  <li>View and access content for personal, non-commercial use</li>
                  <li>Share links to articles on social media or other platforms</li>
                  <li>Quote short excerpts (up to 100 words) provided proper credit is given to Travel Handmade and a clear link to the original content is included</li>
                </ul>
                <p>
                  Any use beyond this requires explicit written permission.
                </p>
              </div>
            </div>

            {/* Copyright Section 4 */}
            <div className="mb-10">
              <p style={bodyStyle} className="text-black mb-4">
                4. Restrictions
              </p>
              <div style={bodyStyle} className="text-black">
                <p className="mb-3">
                  You may not:
                </p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>Reproduce full articles, features, or editorial layouts</li>
                  <li>Republish content on other websites, blogs, or platforms without permission</li>
                  <li>Use our content for commercial purposes without a licensing agreement</li>
                  <li>Alter, edit, or manipulate content in a way that misrepresents its original meaning</li>
                  <li>Remove copyright notices or attribution credits</li>
                </ul>
              </div>
            </div>

            {/* Copyright Section 5 */}
            <div className="mb-10">
              <p style={bodyStyle} className="text-black mb-4">
                5. User-Generated Content
              </p>
              <div style={bodyStyle} className="text-black space-y-4">
                <p>
                  If you submit content (including comments, images, or contributions), you grant Travel Handmade a non-exclusive, worldwide, royalty-free license to use, reproduce, edit, publish, and distribute such content across our platforms. You confirm that:
                </p>
                <ul className="list-disc ml-5 space-y-2 mb-4">
                  <li>You own or have rights to the content you submit</li>
                  <li>Your submission does not infringe on third-party rights</li>
                </ul>
                <p>
                  We reserve the right to remove user content at our discretion.
                </p>
              </div>
            </div>

            {/* Copyright Section 6 */}
            <div className="mb-10">
              <p style={bodyStyle} className="text-black mb-4">
                6. Third-Party Content
              </p>
              <div style={bodyStyle} className="text-black">
                <p>
                  Some content may include materials provided by third parties, including photographers, writers, designers, or partners. Such content remains the property of its respective owners and is used under license or permission. If you believe any third-party content infringes your copyright, please contact us immediately.
                </p>
              </div>
            </div>

            {/* Copyright Section 7 */}
            <div className="mb-10">
              <p style={bodyStyle} className="text-black mb-4">
                7. Affiliate & Partner Content
              </p>
              <div style={bodyStyle} className="text-black">
                <p>
                  Certain content may include affiliate links or branded partnerships. These do not affect copyright ownership. All editorial content remains independently produced unless clearly stated otherwise.
                </p>
              </div>
            </div>

            {/* Copyright Section 8 */}
            <div className="mb-10">
              <p style={bodyStyle} className="text-black mb-4">
                8. Intellectual Property Infringement (DMCA or Equivalent Notice)
              </p>
              <div style={bodyStyle} className="text-black space-y-4">
                <p>
                  We respect the intellectual property rights of others. If you believe that your copyrighted work has been used or reproduced on our platform without authorization, please notify us with the following details:
                </p>
                <ul className="list-disc ml-5 space-y-2 mb-4">
                  <li>Your name and contact information</li>
                  <li>Description of the copyrighted work</li>
                  <li>URL or location of the infringing material</li>
                  <li>A statement of good faith belief that the use is unauthorized</li>
                  <li>A statement confirming the accuracy of your claim</li>
                </ul>
                <p>
                  Send notices to: <a href="mailto:satarupa.datta@travelhandmade.com" className="text-blue-600 hover:underline">satarupa.datta@travelhandmade.com</a>
                </p>
                <p>
                  We will review and take appropriate action in accordance with applicable laws.
                </p>
              </div>
            </div>

            {/* Copyright Section 9 */}
            <div className="mb-10">
              <p style={bodyStyle} className="text-black mb-4">
                9. Enforcement
              </p>
              <div style={bodyStyle} className="text-black">
                <p className="mb-3">
                  We reserve the right to:
                </p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>Remove infringing content</li>
                  <li>Suspend or block access to repeat infringers</li>
                  <li>Pursue legal remedies where necessary</li>
                </ul>
              </div>
            </div>

            {/* Copyright Section 10 */}
            <div className="mb-10">
              <p style={bodyStyle} className="text-black mb-4">
                10. Updates to This Policy
              </p>
              <div style={bodyStyle} className="text-black">
                <p>
                  We may update this Copyright Policy periodically. Any changes will be posted on this page with an updated "Last Updated" date.
                </p>
              </div>
            </div>

            {/* Copyright Section 11 */}
            <div>
              <p style={bodyStyle} className="text-black mb-4">
                11. Contact
              </p>
              <div style={bodyStyle} className="text-black">
                <p>
                  For copyright permissions, licensing requests, or concerns, please contact:
                </p>
                <p className="mt-4">
                  Email: <a href="mailto:satarupa.datta@travelhandmade.com" className="text-blue-600 hover:underline">satarupa.datta@travelhandmade.com</a>
                </p>
              </div>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
