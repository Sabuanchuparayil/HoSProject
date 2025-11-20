
import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">
      {categories.map(category => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-4 py-2 text-sm sm:text-base font-semibold rounded-full transition-all duration-300 border-2 
            ${selectedCategory === category 
              ? 'bg-[--accent] text-[--accent-foreground] border-[--accent] scale-105 shadow-lg shadow-[--accent]/30' 
              : 'bg-[--bg-secondary] text-[--text-secondary] border-[--border-color] hover:bg-[--bg-tertiary] hover:border-[--accent]'
            }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};