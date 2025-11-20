
import React from 'react';
import { Hero } from '../Hero';
import { ProductCard } from '../ProductCard';
import { ProductCardSkeleton } from '../skeletons/ProductCardSkeleton';
import { ProductWithTotalStock, HomePageContent, Order } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { HomePageSearchBar } from '../HomePageSearchBar';

interface LayoutProps {
    products: ProductWithTotalStock[];
    isLoading: boolean;
    filterControls: React.ReactNode;
    paginationControls: React.ReactNode;
    homePageContent: HomePageContent | null;
    allOrders: Order[]; // Added for consistency, not used here
}

export const StandardHeroLayout: React.FC<LayoutProps> = ({ products, isLoading, filterControls, paginationControls, homePageContent }) => {
    const { activeThemeConfig } = useTheme();

    // Use CMS hero if available, otherwise fall back to the active theme's hero.
    const heroContent = homePageContent?.hero?.image && homePageContent?.hero.title.en
        ? homePageContent.hero 
        : activeThemeConfig.hero;

    return (
        <>
            <Hero {...heroContent} />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <HomePageSearchBar />
                {filterControls}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {isLoading
                        ? Array.from({ length: 12 }).map((_, index) => <ProductCardSkeleton key={index} />)
                        : products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    }
                </div>
                 {!isLoading && products.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <h3 className="text-2xl font-cinzel text-[--text-primary]">No Magical Items Found</h3>
                        <p className="text-[--text-muted] mt-2">Try adjusting your filters to find what you're looking for.</p>
                    </div>
                )}
                {paginationControls}
            </main>
        </>
    );
};
