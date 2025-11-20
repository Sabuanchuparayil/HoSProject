import React from 'react';

export const ContactPage: React.FC = () => (
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
    {/* FIX: Replaced hardcoded dark theme styles with theme variables for consistency. */}
    <div className="max-w-2xl mx-auto bg-[--bg-secondary] p-8 rounded-lg shadow-xl">
      <h1 className="text-4xl font-cinzel font-bold text-[--accent] mb-6 text-center">Contact Us</h1>
      <p className="text-center text-[--text-muted] mb-8">Have a question, a comment, or need to send an owl? Reach out to us!</p>
      <form className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[--text-muted]">Your Name</label>
          <input type="text" name="name" id="name" required className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]"/>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[--text-muted]">Your Email</label>
          <input type="email" name="email" id="email" required className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]"/>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-[--text-muted]">Message</label>
          <textarea name="message" id="message" required rows={5} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]"></textarea>
        </div>
        <div className="text-center">
          <button type="submit" className="px-8 py-3 bg-[--accent] text-[--bg-primary] font-bold text-lg rounded-full hover:bg-[--accent-hover] transition duration-300 transform hover:scale-105 shadow-lg shadow-[--accent]/20">
            Send Message
          </button>
        </div>
      </form>
    </div>
  </div>
);
