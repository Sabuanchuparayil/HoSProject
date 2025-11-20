import React from 'react';

export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="h-6 bg-gray-700 rounded w-48 mb-8"></div>
      <div className="bg-[--bg-secondary] rounded-lg shadow-xl overflow-hidden md:flex">
        <div className="md:w-1/2">
          <div className="w-full h-full bg-gray-700 min-h-[400px]"></div>
        </div>
        <div className="p-8 md:w-1/2 flex flex-col">
          <div className="h-5 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-10 bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="flex justify-between items-center mb-4">
            <div className="h-8 bg-gray-700 rounded-full w-24"></div>
            <div className="h-5 bg-gray-700 rounded w-20"></div>
          </div>
          
          <div className="space-y-3 mb-6 flex-grow">
            <div className="h-5 bg-gray-700 rounded"></div>
            <div className="h-5 bg-gray-700 rounded w-5/6"></div>
            <div className="h-5 bg-gray-700 rounded w-4/6"></div>
          </div>

          <div className="bg-[--bg-primary] p-4 rounded-lg border border-[--border-color] mb-6 space-y-2">
              <div className="h-6 bg-gray-700 rounded w-1/4 mb-3"></div>
              <div className="flex justify-between"><div className="h-4 bg-gray-700 rounded w-1/3"></div><div className="h-4 bg-gray-700 rounded w-1/4"></div></div>
              <div className="flex justify-between"><div className="h-4 bg-gray-700 rounded w-1/3"></div><div className="h-4 bg-gray-700 rounded w-1/4"></div></div>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="h-9 bg-gray-700 rounded w-1/3"></div>
            <div className="h-7 bg-gray-700 rounded w-1/4"></div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-20 h-12 bg-gray-700 rounded-md"></div>
            <div className="flex-grow h-12 bg-gray-700 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};