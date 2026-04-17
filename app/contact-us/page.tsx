import React from 'react';

export default function ContactUs() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 font-sans">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-zinc-900 mb-10 text-center">Get in Touch</h1>
        
        <div className="bg-white rounded-[40px] p-8 md:p-16 border border-zinc-100 shadow-xl shadow-zinc-200/50">
          <p className="text-zinc-500 mb-10 text-center text-lg font-light leading-relaxed">
            Have a question about a specific desk or chair? Found a great piece of gear we should review? Or just want to say hi? We'd love to hear from you.
          </p>

          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 ml-1">Name</label>
                <input type="text" className="w-full px-6 py-4 rounded-2xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-amber-100 outline-none transition-all" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 ml-1">Email</label>
                <input type="email" className="w-full px-6 py-4 rounded-2xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-amber-100 outline-none transition-all" placeholder="hello@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 ml-1">Message</label>
              <textarea rows={6} className="w-full px-6 py-4 rounded-2xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-amber-100 outline-none transition-all resize-none" placeholder="How can we help?"></textarea>
            </div>
            <button className="w-full py-5 bg-zinc-900 text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200">
              Send Message
            </button>
          </form>

          <div className="mt-12 pt-12 border-t border-zinc-50 text-center">
             <p className="text-sm text-zinc-400 mb-2">Direct Email</p>
             <a href="mailto:hello@aurahomeoffice.com" className="text-xl font-medium text-zinc-900 border-b-2 border-amber-100 hover:border-amber-400 transition-all">hello@aurahomeoffice.com</a>
             <p className="text-xs text-zinc-400 mt-4">We usually reply within 24-48 hours.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
