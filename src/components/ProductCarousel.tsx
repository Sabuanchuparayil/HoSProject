import React, { useRef } from 'react';
import { ProductWithTotalStock } from '../types';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './skeletons/ProductCardSkeleton';

interface ProductCarouselProps {
    title: string;
    products: ProductWithTotalStock[];
    isLoading: boolean;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({ title, products, isLoading }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };
    
    return (
        <section>
            <h2 className="text-3xl font-bold font-cinzel text-center text-[--accent] mb-8">{title}</h2>
            <div className="relative">
                <button 
                    onClick={() => scroll('left')} 
                    className="absolute top-1/2 -left-4 -translate-y-1/2 z-10 bg-[--bg-secondary]/80 text-[--text-primary] rounded-full p-2 hover:bg-[--accent] hover:text-[--accent-foreground] transition-all hidden md:block"
                    aria-label="Scroll left"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                
                <div ref={scrollContainerRef} className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-6 py-4 no-scrollbar">
                    {isLoading
                        ? Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="snap-start shrink-0 w-72">
                                <ProductCardSkeleton />
                            </div>
                          ))
                        : products.map(product => (
                            <div key={product.id} className="snap-start shrink-0 w-72">
                                <ProductCard product={product} />
                            </div>
                        ))
                    }
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
