import React from 'react';

export default function DisclosurePage() {
  return (
    <main className="ds-wrap">
      <header className="ds-header">
        <h1 className="ds-title">Affiliate Disclosure</h1>
        <p className="ds-subtitle">Transparency and trust are the foundation of Aura Home Office.</p>
      </header>

      <div className="ds-content">
        <p>
          At Aura Home Office, we believe in being 100% transparent with our readers. Our mission is to help you build the perfect workspace, and to keep our research independent and high-quality, we participate in various affiliate marketing programs.
        </p>

        <div className="ds-box">
          <strong>Official Amazon Statement:</strong> Aura Home Office (AffiliateCMS.com) is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. As an Amazon Associate, we earn from qualifying purchases.
        </div>

        <h2>What does this mean for you?</h2>
        <p>
          Whenever you click on a link to a product we recommend and make a purchase, we may receive a small commission from the retailer. <strong>This comes at no absolute extra cost to you.</strong> In fact, sometimes our partnerships allow us to share exclusive deals or discounts with our community.
        </p>

        <h2>Our Editorial Integrity</h2>
        <p>
          Our recommendations are always based on one thing: <strong>Quality.</strong> We spend hundreds of hours researching, testing, and comparing gear so you don't have to. A product's affiliate status never influences our decision to recommend it. If we don't like a product, we'll tell you — regardless of whether it pays a commission or not.
        </p>

        <h2>Price & Availability Notice</h2>
        <p>
          We use the Amazon Product Advertising API to provide you with the most accurate information possible, including images, titles, and highlights. However, please note that Amazon.com prices and availability change frequently. We recommend checking the final price on the retailer's site before completing your purchase.
        </p>

        <h2>Social Media Transparency</h2>
        <p>
          When you see us sharing gear on Instagram, Twitter, or other social platforms, we maintain the same level of honesty. Any post containing affiliate links will be clearly marked with indicators like <strong>#ad</strong> or <strong>#commissionsearned</strong>. 
        </p>

        <p style={{ marginTop: '60px', fontSize: '0.9rem', color: '#9A9A9A' }}>
          Last updated: April 17, 2026
        </p>
      </div>
    </main>
  );
}
