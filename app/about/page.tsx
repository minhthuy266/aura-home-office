import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="ab-wrap">
      {/* Hero Section */}
      <section className="ab-hero">
        <p className="ab-eyebrow">About Aura Home Office</p>
        <h1 className="ab-h1">We spend the money<br />so you don't have to</h1>
        <p className="ab-lead">Aura Home Office is a small team of remote workers, designers, and desk obsessives who got tired of vague "best of" lists. So we built something better.</p>
      </section>

      {/* Story Section */}
      <section className="ab-section">
        <p className="ab-label">Our story</p>
        <div className="prose-premium">
          <p>It started in 2020 when most of us were suddenly working from kitchen tables and spare bedrooms — squinting at laptop screens and nursing sore backs by noon. We started researching ergonomic gear obsessively, reading hundreds of reviews, comparing specs, and talking to people who actually owned this stuff.</p>
          <p>What we kept running into was the same problem: every "best ergonomic chair" article read like it was written by someone who had never sat in one. Affiliate lists stuffed with Amazon bestsellers, zero context, zero honesty.</p>
          <p>Aura Home Office exists to fix that. We combine hands-on testing (when possible), deep research, user feedback from thousands of real owners, and direct conversations with manufacturers. When we recommend something, it's because the data and the experience back it up — not because it pays well.</p>
        </div>
      </section>

      <hr className="ab-divider" />

      {/* Methodology Section */}
      <section className="ab-section">
        <p className="ab-label">How we work</p>
        <ul className="ab-rules">
          <li>
            <strong>Hands-on when possible</strong>
            We test products ourselves whenever we can. Sometimes that means buying it. Sometimes manufacturers send us review units. Sometimes we borrow from friends or visit showrooms. We're transparent about how we evaluated each product.
          </li>
          <li>
            <strong>Research the hell out of everything</strong>
            If we haven't physically tested something, we say so. Then we dive deep: spec sheets, warranty terms, verified owner reviews, forum discussions, and expert opinions. No surface-level summaries.
          </li>
          <li>
            <strong>We track updates</strong>
            A product that was great in 2022 might have a better version now, or the quality might have dropped. We monitor changes and update our reviews accordingly.
          </li>
          <li>
            <strong>Affiliate links fund our work</strong>
            Some links on this site are affiliate links. We earn a small commission if you buy — at no extra cost to you. This keeps the lights on and lets us stay independent. It never influences our recommendations.
          </li>
          <li>
            <strong>We call out disappointments</strong>
            If a product doesn't live up to the hype, we say that too. No paid placements. No sponsored picks dressed up as editorial. If a brand wants a positive review, they need to make a good product — not write us a check.
          </li>
        </ul>
      </section>

      <hr className="ab-divider" />

      {/* Team Section */}
      <section className="ab-section">
        <p className="ab-label">The team</p>
        <div className="ab-team">
          {/* Jamie */}
          <div className="ab-card">
            <div className="ab-avatar" style={{ background: '#F5F4F0', color: '#C4A265' }}>JM</div>
            <p className="ab-name">Jamie M.</p>
            <p className="ab-role">Founder & Editor</p>
            <p className="ab-bio">Full-time remote since 2019. Spent way too many hours researching ergonomic gear before finally buying the right chair. Writes about desks, chairs, and the eternal monitor arm debate.</p>
          </div>
          
          {/* Sara */}
          <div className="ab-card">
            <div className="ab-avatar" style={{ background: '#F5F4F0', color: '#1A1A1A' }}>SL</div>
            <p className="ab-name">Sara L.</p>
            <p className="ab-role">Lighting & Aesthetics</p>
            <p className="ab-bio">Interior designer by training, remote worker by necessity. Covers desk lighting, cable management, and making your setup look intentional — not just functional. Tests products in real home offices.</p>
          </div>
          
          {/* Ryan */}
          <div className="ab-card">
            <div className="ab-avatar" style={{ background: '#F5F4F0', color: '#6B6B6B' }}>RK</div>
            <p className="ab-name">Ryan K.</p>
            <p className="ab-role">Research & Analysis</p>
            <p className="ab-bio">IT background, data nerd. Breaks down spec sheets, warranty terms, and long-term owner feedback. If there's a detailed comparison table, Ryan probably built it.</p>
          </div>
        </div>
      </section>

      {/* Contact Footer */}
      <section className="ab-section ab-contact animate-in delay-200">
        <p>Got a question or a product you think we should review? We actually read our emails.</p>
        <a href="mailto:hello@aurahomeoffice.com" className="ab-cta-btn">
          Get in touch <ArrowRight size={14} />
        </a>
      </section>
    </main>
  );
}
