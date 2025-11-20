import React from 'react';

export const PrivacyPolicyPage: React.FC = () => (
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
    {/* FIX: Replaced hardcoded dark theme styles with theme variables for consistency. */}
    <div className="max-w-4xl mx-auto bg-[--bg-secondary] p-8 rounded-lg shadow-xl">
      <h1 className="text-4xl font-cinzel font-bold text-[--accent] mb-6">Privacy Policy</h1>
      <div className="space-y-4 text-[--text-secondary] leading-relaxed">
        <p>Your privacy is of utmost importance to us. This policy outlines how House of Spells collects, uses, and protects your personal information.</p>
        <h2 className="text-2xl font-cinzel text-[--text-primary] pt-4">Information We Collect</h2>
        <p>We may collect personal identification information from Users in a variety of ways, including, but not to, when Users visit our site, register on the site, place an order, and in connection with other activities, services, features or resources we make available on our Site.</p>
        <h2 className="text-2xl font-cinzel text-[--text-primary] pt-4">How We Use Collected Information</h2>
        <p>House of Spells may collect and use Users personal information for the following purposes: To improve customer service, to personalize user experience, to process payments, and to send periodic emails.</p>
        <p>[This is a placeholder document. In a real application, this would be a comprehensive legal document.]</p>
      </div>
    </div>
  </div>
);
