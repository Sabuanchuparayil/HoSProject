import React from 'react';

export const AboutPage: React.FC = () => (
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
    {/* FIX: Replaced hardcoded dark theme styles with theme variables for consistency. */}
    <div className="max-w-4xl mx-auto bg-[--bg-secondary] p-8 rounded-lg shadow-xl">
      <h1 className="text-4xl font-cinzel font-bold text-[--accent] mb-6 text-center">About House of Spells</h1>
      <div className="space-y-4 text-[--text-secondary] leading-relaxed">
        <p>
          Welcome to House of Spells, the ultimate global marketplace for fans of every realm, universe, and story. Our journey began from a simple, powerful idea: to create a single, trusted portal where fans could find authentic, high-quality, licensed merchandise from the worlds they love.
        </p>
        <p>
          We are more than just a store; we are a community built by fans, for fans. We understand the passion that drives you to collect, to cosplay, to represent the stories that have shaped you. That's why we partner directly with licensed creators and sellers from around the world to bring you a curated collection of magical artifacts, from enchanted wands and house apparel to rare collectibles and mystical jewelry.
        </p>
        <p>
          Our platform supports both direct-to-consumer (B2C) and business-to-business (B2B) models, enabling individual collectors and small businesses alike to thrive. With multi-language and multi-currency support, the magic of fandom knows no borders at House of Spells.
        </p>
        <p>
          Thank you for joining our adventure. We solemnly swear we are up to some good.
        </p>
      </div>
    </div>
  </div>
);
