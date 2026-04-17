import React from 'react';

export default function AffiliateDisclosure() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 font-sans">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-zinc-900 mb-10">Affiliate Disclosure</h1>
        
        <div className="prose prose-premium max-w-none">
          <p className="text-xl font-medium text-zinc-900 leading-relaxed bg-amber-50 p-6 rounded-2xl border border-amber-100 mb-8">
            <strong>Aura Home Office is reader-supported.</strong> When you buy through links on our site, we may earn an affiliate commission from Amazon and other partners.
          </p>

          <p>
            In compliance with the FTC guidelines, please assume that any and all links on this website are affiliate links of which Aura Home Office receives a small commission from sales of certain items.
          </p>

          <h3>What is an Affiliate Link?</h3>
          <p>
            When you click on an affiliate link and make a purchase, the retailer pays us a small percentage of the sale. **This does not increase the price for you.** It is a way for you to support our independent research and content creation.
          </p>

          <h3>Amazon Associates Disclosure</h3>
          <p>
            Aura Home Office is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.
          </p>

          <h3>How We Choose Products</h3>
          <p>
            Our recommendations are based solely on our editorial team's research and analysis. We prioritize products that provide genuine value, ergonomic benefits, and high-quality design. A commission has no influence on our final verdict.
          </p>

          <p className="mt-12 text-sm text-zinc-400">
            Last updated: April 16, 2026
          </p>
        </div>
      </div>
    </main>
  );
}
