import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[--bg-secondary] rounded-lg overflow-hidden shadow-lg animate-pulse flex flex-col h-full">
      <div className="relative overflow-hidden">
        <div className="w-full h-56 bg-[--bg-tertiary]"></div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="h-6 bg-[--bg-tertiary] rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-[--bg-tertiary] rounded w-full mb-1"></div>
        <div className="h-4 bg-[--bg-tertiary] rounded w-5/6"></div>
        <div className="mt-4 flex items-center justify-between">
          <div className="h-8 bg-[--bg-tertiary] rounded w-1/3"></div>
          <div className="h-10 bg-[--bg-tertiary] rounded-full w-28"></div>
        </div>
      </div>
    </div>
  );
};