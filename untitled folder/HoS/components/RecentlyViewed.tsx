import React, { useRef, useMemo } from 'react';
import { ProductWithTotalStock } from '../types';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './skeletons/ProductCardSkeleton';
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';

interface RecentlyViewedProps {
    products: ProductWithTotalStock[];
    isLoading: boolean;
}

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ products, isLoading }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { recentlyViewedIds } = useRecentlyViewed();

    const recentlyViewedProducts = useMemo(() => {
        if (!products.length) return [];
        // Map IDs to products, maintaining the order from recentlyViewedIds
        return recentlyViewedIds
            .map(id => products.find(product => product.id === id))
            .filter((p): p is ProductWithTotalStock => !!p);
    }, [recentlyViewedIds, products]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (!isLoading && recentlyViewedProducts.length === 0) {
        return null;
    }
    
    return (
        <section>
            <h2 className="text-3xl font-bold font-cinzel text-center text-[--accent] mb-8">Recently Viewed Items</h2>
            <div className="relative">
                <button 
                    onClick={() => scroll('left')} 
                    className="absolute top-1/2 -left-4 -translate-y-1/2 z-10 bg-[--bg-secondary]/80 text-[--text-primary] rounded-full p-2 hover:bg-[--accent] hover:text-[--accent-foreground] transition-all hidden md:block"
                    aria-label="Scroll left"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                
                <div ref={scrollContainerRef} className="overflow-x-auto scroll-smooth py-4 no-scrollbar">
                   <div className="flex justify-center">
                        <div className="inline-flex gap-6 px-4 sm:px-0">
                            {isLoading && recentlyViewedProducts.length === 0
                                ? Array.from({ length: 5 }).map((_, index) => (
                                    <div key={index} className="shrink-0 w-72">
                                        <ProductCardSkeleton />
                                    </div>
                                ))
                                : recentlyViewedProducts.map(product => (
                                    <div key={product.id} className="shrink-0 w-72">
                                        <ProductCard product={product} />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                
                 <button 
                    onClick={() => scroll('right')} 
                    className="absolute top-1/2 -right-4 -translate-y-1/2 z-10 bg-[--bg-secondary]/80 text-[--text-primary] rounded-full p-2 hover:bg-[--accent] hover:text-[--accent-foreground] transition-all hidden md:block"
                    aria-label="Scroll right"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7-7" /></svg>
                </button>
            </div>
        </section>
    );
};