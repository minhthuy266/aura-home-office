import React from 'react';

export default function AboutUs() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-zinc-900 mb-6">About Aura Home Office</h1>
          <p className="text-xl text-zinc-500 font-light leading-relaxed">
            Helping you save 3-5 hours of research and avoid the "looks good on camera, fails in person" gear trap.
          </p>
        </header>

        <section className="prose prose-premium max-w-none">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-zinc-100 shadow-sm mb-12">
            <h2 className="!mt-0">Our Story</h2>
            <p>
              I'm Thuy Nguyen, the founder of Aura Home Office. Like many of you, I've spent thousands of hours in a home office—and many of those hours were spent in pain. I've bought the "viral" chairs that caused backaches and the "budget" desks that wobbled during every Zoom call.
            </p>
            <p>
              Aura Home Office was born from a simple need: **unbiased, deeply-researched, and aesthetically-minded workspace reviews.** We started this platform to document the journey of finding the perfect setup, helping you avoid the mistakes I and many others have made.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h3>Our Curator Approach</h3>
              <p>
                We don't just skim the surface. Before recommending a single product, we:
              </p>
              <ul className="space-y-2">
                <li>Analyze 50+ real owner reviews from Reddit, Amazon, and specialized forums.</li>
                <li>Compare technical specs side-by-side (motor speed, seat depth, lux levels).</li>
                <li>Check warranty policies and long-term durability feedback.</li>
                <li>Verify if the aesthetic claims hold up in real natural lighting.</li>
              </ul>
            </div>
            <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100">
              <h3 className="text-amber-900">Our Transparency</h3>
              <p className="text-amber-800/80">
                Aura Home Office is reader-supported. When you buy through links on our site, we may earn an affiliate commission from Amazon and other partners—at no additional cost to you. 
              </p>
              <p className="text-amber-800/80">
                We are honest: **if a product has flaws, we say so.** Our loyalty is to your comfort, not the brands.
              </p>
            </div>
          </div>

          <div className="border-t border-zinc-100 pt-16">
            <h2>Call to Feedback</h2>
            <p>
              Have you tried a product we reviewed? Your real-world experience helps the whole community. Send us your feedback or your own setup photos at <a href="mailto:hello@aurahomeoffice.com">hello@aurahomeoffice.com</a>.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
