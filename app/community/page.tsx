import { Metadata } from 'next';
import NewsletterForm from '@/components/community/NewsletterForm';
import ContactForm from '@/components/community/ContactForm';
import SocialLinks from '@/components/community/SocialLinks';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Community — Routure',
  description: 'Join the Routure community. Apply for castings and editorial opportunities, subscribe, and get in touch.',
};

const applications = [
  {
    issue: 'After Life · Main Issue 26′',
    title: 'Models, Makeup & Stylists',
    description: 'Be part of After Life. Apply for model, makeup, and stylist castings.',
    href: 'https://docs.google.com/forms/d/e/1FAIpQLScPVTDjbmQrBgVq6dvWN8OSh35Pf0MvWeJdWDcH_Ghhrk-KOg/viewform',
  },
  {
    issue: 'After Life · Main Issue Fall 26′',
    title: 'Photographers Only',
    description: 'Bring your perspective to After Life. Apply through the dedicated photographer casting form.',
    href: 'https://docs.google.com/forms/d/e/1FAIpQLSdv7KpHcGuiY-fAoGqKbTF804lgE36vy_YrpjF1LefWbzcPuA/viewform',
  },
  {
    issue: 'Recess · Main Issue 26′',
    title: 'Journalists',
    description: 'Contribute your voice to Recess. Apply for the main issue as a journalist.',
    href: 'https://docs.google.com/forms/d/e/1FAIpQLScE1Vt1BbtGrIP-K9RdJ1WY-rj0NdEdyMLlge6MTKKkVALlHA/viewform',
  },
];

export default function CommunityPage() {
  return (
    <main className="min-h-screen text-black">
      {/* Hero */}
      <section className="px-6 pt-32 pb-20 md:px-12 lg:px-24">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-[-0.03em] mb-6 animate-slide-up">
            Community
          </h1>
          <p className="text-gray-700 text-lg md:text-xl max-w-2xl leading-relaxed animate-fade-in">
            Stay connected with Routure. Find your place in our next issue, get notified when new issues drop,
            submit your questions, and follow us across platforms.
          </p>
        </div>
      </section>

      <section id="apply" aria-labelledby="apply-heading" className="scroll-mt-24 px-6 pb-20 md:px-12 lg:px-24">
        <div className="max-w-[1400px] mx-auto border-t border-[#E0E0E0] pt-12 md:pt-16">
          <p className="text-[11px] tracking-[2.5px] uppercase text-gray-700 mb-4">Castings & Editorial</p>
          <div className="mb-10 md:mb-12">
            <h2 id="apply-heading" className="text-[clamp(1.8rem,4vw,3rem)] leading-[1] tracking-[-0.02em] mb-4">
              Create with Routure
            </h2>
            <p className="text-gray-700 text-base leading-relaxed max-w-2xl">
              Choose your role below to apply. Each application opens in Google Forms in a new tab.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {applications.map((application, index) => (
              <a
                key={application.href}
                href={application.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col border border-[#E0E0E0] bg-white p-6 md:p-8 hover:border-black transition-colors focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4"
              >
                <div className="flex items-start justify-between gap-4 mb-8">
                  <p className="text-[10px] tracking-[2px] uppercase text-gray-700 leading-relaxed">{application.issue}</p>
                  <span aria-hidden="true" className="text-[11px] text-gray-500">0{index + 1}</span>
                </div>
                <h3 className="text-[28px] leading-[1.15] mb-4">{application.title}</h3>
                <p className="text-sm text-gray-700 leading-relaxed mb-10">{application.description}</p>
                <span className="mt-auto flex items-center justify-between border-t border-[#E0E0E0] pt-5 text-[11px] tracking-[2px] uppercase">
                  Apply now
                  <span aria-hidden="true" className="text-lg group-hover:translate-x-1 motion-reduce:transform-none transition-transform">↗</span>
                </span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter - black bg */}
      <section className="px-6 py-20 md:px-12 lg:px-24 bg-black text-white">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div>
            <h2 className="text-[clamp(1.8rem,4vw,3rem)] leading-[1] tracking-[-0.02em] mb-4"
    >
              Never miss an issue
            </h2>
            <p className="text-gray-400 text-base leading-relaxed max-w-md">
              Subscribe to get notified when we publish new issues,
              behind-the-scenes content, and exclusive updates.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </section>

      {/* Social Links */}
      <section className="px-6 py-20 md:px-12 lg:px-24">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-[clamp(1.8rem,4vw,3rem)] leading-[1] tracking-[-0.02em] mb-12"
  >
            Follow us
          </h2>
          <SocialLinks />
        </div>
      </section>

      {/* Contact Form */}
      <section className="px-6 py-20 md:px-12 lg:px-24" style={{ borderTop: '1px solid #E0E0E0' }}>
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div>
            <h2 className="text-[clamp(1.8rem,4vw,3rem)] leading-[1] tracking-[-0.02em] mb-4"
    >
              Get in touch
            </h2>
            <p className="text-gray-600 text-base leading-relaxed max-w-md">
              Have a question, want to collaborate, or interested in submitting work?
              Drop us a message.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
