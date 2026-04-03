import { Metadata } from 'next';
import NewsletterForm from '@/components/community/NewsletterForm';
import ContactForm from '@/components/community/ContactForm';
import SocialLinks from '@/components/community/SocialLinks';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Community — Routure',
  description: 'Join the Routure community. Subscribe, follow, and get in touch.',
};

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-white text-black" style={{ marginTop: '-88px', paddingTop: '88px' }}>
      {/* Hero */}
      <section className="px-6 pt-32 pb-20 md:px-12 lg:px-24">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-[-0.03em] mb-6">
            Community
          </h1>
          <p className="text-gray-700 text-lg md:text-xl max-w-2xl leading-relaxed">
            Stay connected with Routure. Get notified when new issues drop,
            submit your questions, and follow us across platforms.
          </p>
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
