import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Target, Coffee, Search, Mail, ArrowRight } from 'lucide-react';

export default function AboutUs() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-[#FAFAF7]">
      <div className="max-w-5xl mx-auto px-6">
        {/* Editorial Header */}
        <header className="mb-20 text-center animate-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C4A265]/10 rounded-full mb-6">
             <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#C4A265]">Our Mission</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black text-[#1A1A1A] mb-8 leading-[0.95] tracking-tight">
            Curating the <span className="italic text-[#C4A265]">Aura</span> of your best workday.
          </h1>
          <p className="text-xl md:text-2xl text-[#6B6B6B] font-light leading-relaxed max-w-3xl mx-auto">
            We help you bypass the "looks good on camera, fails in person" gear trap by providing deep-tissue reviews of modern workspace artifacts.
          </p>
        </header>

        {/* Story Section */}
        <section className="grid lg:grid-cols-2 gap-16 mb-24 items-center">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-luxury">
            <img 
              src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200" 
              alt="Workspace curation" 
              className="object-cover h-full w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          <div className="space-y-8">
            <h2 className="text-3xl font-display font-bold text-[#1A1A1A]">The Aura Origin</h2>
            <div className="space-y-6 text-[#4A4A4A] leading-[1.8] font-light text-lg">
              <p>
                Aura Home Office began with a realization: the modern professional spends more time at their desk than in their bed, yet most office gear is chosen based on a 30-second scroll.
              </p>
              <p>
                Founded by <strong className="text-[#1A1A1A] font-semibold">Thuy Nguyen</strong>, Aura was born from the wreckage of wobbly "budget" desks and ergonomic chairs that caused more pain than they solved. We decided to stop guessing and start measuring.
              </p>
              <p>
                Today, Aura is a definitive guide for those who view their office not just as a place to work, but as a sanctuary for productivity and focus.
              </p>
            </div>
            <div className="pt-4">
              <Link href="/category/reviews" className="btn-premium btn-dark">
                Explore The Archive <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* Methodology Grid */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#C4A265] mb-4">Our Methodology</h2>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-[#1A1A1A]">How We Filter the Noise</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="text-[#C4A265]" size={24} />,
                title: "Deep Context",
                desc: "We analyze 50+ real owner reviews from Reddit and specialized forums before we even touch the product."
              },
              {
                icon: <Target className="text-[#C4A265]" size={24} />,
                title: "Rigorous Testing",
                desc: "Motor speeds, lux levels, and seat depth aren't just numbers—we test them in real-world professional environments."
              },
              {
                icon: <ShieldCheck className="text-[#C4A265]" size={24} />,
                title: "Unbiased Verdicts",
                desc: "If a product has flaws, we lead with them. Our priority is your posture, not the brand's feelings."
              }
            ].map((item, i) => (
              <div key={i} className="p-10 bg-white border border-black/[0.04] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#F5F4F0] flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h4 className="text-lg font-display font-bold text-[#1A1A1A] mb-3">{item.title}</h4>
                <p className="text-sm text-[#6B6B6B] leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Transparency Box */}
        <section className="p-12 md:p-16 bg-[#1A1A1A] rounded-3xl relative overflow-hidden text-center mb-24">
          <div className="aura-blob w-[400px] h-[400px] bg-[#C4A265]/20 top-0 right-0"></div>
          <div className="relative z-10">
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#C4A265] mb-6">Transparency</h2>
            <p className="text-2xl md:text-3xl font-display italic text-white/90 leading-relaxed max-w-3xl mx-auto mb-10">
              "We are reader-supported. When you buy through our links, we may earn a commission—but our reviews are never for sale."
            </p>
            <Link href="/disclosure" className="text-[11px] font-bold uppercase tracking-widest text-[#C4A265] hover:text-white transition-colors">
              Read our full Affiliate Disclosure
            </Link>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center">
          <Coffee className="mx-auto text-[#C4A265] mb-6" size={32} />
          <h2 className="text-2xl font-display font-bold text-[#1A1A1A] mb-4">Have a setup we should see?</h2>
          <p className="text-[#6B6B6B] mb-8 font-light max-w-md mx-auto">
            Your real-world experience helps the whole community. Reach out for collaborations or feedback.
          </p>
          <a 
            href="mailto:hello@aurahomeoffice.com" 
            className="text-lg font-bold text-[#1A1A1A] border-b-2 border-[#C4A265] hover:border-[#1A1A1A] transition-all"
          >
            hello@aurahomeoffice.com
          </a>
        </section>
      </div>
    </main>
  );
}
