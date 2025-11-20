import React from 'react';

export const TermsPage: React.FC = () => (
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
    {/* FIX: Replaced hardcoded dark theme styles with theme variables for consistency. */}
    <div className="max-w-4xl mx-auto bg-[--bg-secondary] p-8 rounded-lg shadow-xl">
      <h1 className="text-4xl font-cinzel font-bold text-[--accent] mb-6">Terms of Service</h1>
      <div className="space-y-4 text-[--text-secondary] leading-relaxed">
        <h2 className="text-2xl font-cinzel text-[--text-primary] pt-4">1. Agreement to Terms</h2>
        <p>By using our services, you agree to be bound by these Terms. If you don’t agree to be bound by these Terms, do not use the Services.</p>
        <h2 className="text-2xl font-cinzel text-[--text-primary] pt-4">2. Your Account</h2>
        <p>You may be required to create an account to access some of our services. You are responsible for safeguarding your account, so use a strong password and limit its use to this account. We cannot and will not be liable for any loss or damage arising from your failure to comply with the above.</p>
        <h2 className="text-2xl font-cinzel text-[--text-primary] pt-4">3. Content on the Services</h2>
        <p>You are responsible for your use of the Services and for any Content you provide, including compliance with applicable laws, rules, and regulations.</p>
        <p>[This is a placeholder document. In a real application, this would be a comprehensive legal document.]</p>
      </div>
    </div>
  </div>
);
