import { Metadata } from 'next';
import { NewsletterForm } from '@/components/community/NewsletterForm';
import { ContactForm } from '@/components/community/ContactForm';
import { SocialLinks } from '@/components/community/SocialLinks';

export const metadata: Metadata = {
  title: 'Community | Routure',
  description: 'Join the Routure community. Subscribe to our newsletter, connect on social media, and get in touch with us.',
};

export default function CommunityPage() {
  return (
    <>
      {/* Hero Newsletter Section */}
      <NewsletterForm />

      {/* Social Media Links */}
      <SocialLinks />

      {/* Contact Form */}
      <ContactForm />

      {/* Submission Guidelines */}
      <section className="py-24 lg:py-32 bg-black text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-6">
                Contribute
              </p>
              <h2 className="font-serif text-4xl sm:text-5xl font-normal mb-6">
                Share Your Story
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed mb-8">
                Routure is built on the voices and perspectives of our community.
                We welcome submissions from writers, photographers, artists, and
                creators who have a unique story to tell.
              </p>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-start gap-4">
                  <span className="text-white font-serif text-xl">01</span>
                  <div>
                    <h3 className="font-medium mb-1">Written Features</h3>
                    <p className="text-sm text-gray-500">Essays, interviews, and long-form journalism</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-white font-serif text-xl">02</span>
                  <div>
                    <h3 className="font-medium mb-1">Visual Stories</h3>
                    <p className="text-sm text-gray-500">Photo essays, illustrations, and creative direction</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-white font-serif text-xl">03</span>
                  <div>
                    <h3 className="font-medium mb-1">Cultural Commentary</h3>
                    <p className="text-sm text-gray-500">Opinion pieces and critical perspectives</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 lg:p-12">
              <h3 className="font-serif text-2xl mb-6">Submission Guidelines</h3>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Original, unpublished work only</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Written pieces: 1,000-5,000 words</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Photo essays: 10-25 high-resolution images</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Include a brief bio and portfolio link</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Response within 2-4 weeks</span>
                </li>
              </ul>
              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-xs text-gray-500 mb-4">
                  Send submissions to
                </p>
                <a
                  href="mailto:submit@routure.com"
                  className="text-lg hover:text-gray-300 transition-colors"
                >
                  submit@routure.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
