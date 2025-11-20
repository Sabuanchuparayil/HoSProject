import React from 'react';

// FIX: Defined a dedicated props interface and used React.PropsWithChildren to correctly type the component.
// This is a robust way to ensure components expecting children are correctly typed,
// resolving the error where the 'children' prop was not being recognized.
type FAQItemProps = React.PropsWithChildren<{
    question: string;
}>;

const FAQItem = ({ question, children }: FAQItemProps) => (
    // FIX: Replaced hardcoded dark theme styles with theme variables.
    <div className="border-b border-[--border-color] py-4">
        <h3 className="text-xl font-semibold text-[--accent] font-cinzel">{question}</h3>
        <div className="mt-2 text-[--text-secondary]">
            {children}
        </div>
    </div>
);

export const FAQPage: React.FC = () => (
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div className="max-w-4xl mx-auto">
      {/* FIX: Replaced hardcoded dark theme styles with theme variables. */}
      <h1 className="text-4xl font-cinzel font-bold text-[--accent] mb-8 text-center">Frequently Asked Questions</h1>
      <div className="bg-[--bg-secondary] p-8 rounded-lg shadow-xl space-y-4">
        <FAQItem question="Are your products officially licensed?">
            <p>Yes! We pride ourselves on offering only authentic, officially licensed merchandise. We work directly with brands and certified distributors to ensure the quality and authenticity of every item in our store.</p>
        </FAQItem>
        <FAQItem question="Do you ship internationally?">
            <p>Absolutely. The magic of fandom is global, and so are we. We offer international shipping to most countries. Shipping costs and times will vary depending on your location.</p>
        </FAQItem>
        <FAQItem question="What is your return policy?">
            <p>We want you to be thrilled with your purchase. If you're not completely satisfied, we accept returns on most items within 30 days of receipt. Please see our full Returns Policy for details and exceptions.</p>
        </FAQItem>
        <FAQItem question="How can I become a seller on House of Spells?">
            <p>We are always looking for passionate sellers with high-quality, licensed products to join our marketplace. Please visit our "Seller Portal" and fill out an application to be considered.</p>
        </FAQItem>
      </div>
    </div>
  </div>
);
