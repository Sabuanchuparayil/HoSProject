import React from "react";

export const EnchantedHomepageLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-purple-700 via-purple-500 to-purple-300 text-white">
      {/* Hero Section */}
      <section className="text-center py-16 px-4">
        <h1 className="text-5xl font-extrabold mb-4">Enchanted Homepage</h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          A magical layout experience crafted for immersive product storytelling.
        </p>
      </section>

      {/* Dynamic Content */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        {children}
      </div>
    </div>
  );
};

export default EnchantedHomepageLayout;
