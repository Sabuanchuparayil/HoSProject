
import React, { useMemo } from 'react';
import { Hero } from '../Hero';
import { ProductCard } from '../ProductCard';
import { ProductCardSkeleton } from '../skeletons/ProductCardSkeleton';
import { ProductWithTotalStock, HomePageContent, Order, HomePageCollection } from '../../types';
import { FeaturedFandoms } from '../FeaturedPhantoms';
import { ProductCarousel } from '../ProductCarousel';
import { useLanguage } from '../../contexts/LanguageContext';
import { RecentlyViewed } from '../RecentlyViewed';
import { HomePageSearchBar } from '../HomePageSearchBar';
import { useTheme } from '../../contexts/ThemeContext';

interface LayoutProps {
    products: ProductWithTotalStock[]; // paginated & filtered
    allProducts: ProductWithTotalStock[]; // all
    isLoading: boolean;
    filterControls: React.ReactNode;
    paginationControls: React.ReactNode;
    onSelectFandom: (fandom: string) => void;
    homePageContent: HomePageContent | null;
    allOrders: Order[];
}

export const EnchantedHomepageLayout: React.FC<LayoutProps> = ({ 
    products, 
    allProducts, 
    isLoading, 
    filterControls, 
    paginationControls,
    onSelectFandom,
    homePageContent,
    allOrders,
}) => {
    const { t } = useLanguage();
    const { activeThemeConfig } = useTheme();

    const getProductsForCollection = (collection: HomePageCollection): ProductWithTotalStock[] => {
        switch (collection.type) {
            case 'new-arrivals':
                return allProducts.slice().sort((a, b) => b.id - a.id).slice(0, 10);
            
            case 'bestsellers':
                const salesCount: { [productId: number]: number } = {};
                allOrders.forEach(order => {
                    order.items.forEach(item => {
                        salesCount[item.id] = (salesCount[item.id] || 0) + item.quantity;
                    });
                });
        
                const sortedBySales = Object.entries(salesCount)
                    .sort(([, countA], [, countB]) => countB - countA)
                    .map(([productId]) => parseInt(productId, 10));

                const topProductIds = sortedBySales.slice(0, 10);
                
                return topProductIds
                    .map(id => allProducts.find(p => p.id === id))
                    .filter((p): p is ProductWithTotalStock => !!p);
            
            case 'manual':
                if (!collection.productIds || collection.productIds.length === 0) return [];
                // Map over productIds to preserve the curated order from the CMS
                return collection.productIds
                    .map(id => allProducts.find(p => p.id === id))
                    .filter((p): p is ProductWithTotalStock => !!p);

            default:
                return [];
        }
    };
    
    const heroContent = (homePageContent?.hero?.image && homePageContent?.hero?.title?.en)
        ? homePageContent.hero 
        : activeThemeConfig.hero;

    return (
        <>
            <Hero {...heroContent} />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
                <section>
                    <HomePageSearchBar />
                    {filterControls}
                </section>

                {homePageContent && homePageContent.featuredFandoms && (
                    <FeaturedFandoms onSelectFandom={onSelectFandom} featuredFandoms={homePageContent.featuredFandoms} />
                )}
                
                {homePageContent && homePageContent.collections && homePageContent.collections.sort((a, b) => a.order - b.order).map(collection => (
                    <ProductCarousel 
                        key={collection.id}
                        title={t(collection.title)} 
                        products={getProductsForCollection(collection)} 
                        isLoading={isLoading} 
                    />
                ))}

                <RecentlyViewed products={allProducts} isLoading={isLoading} />
                
                <section className="pt-8">
                    <div className="scroll-mt-24">
                        <h2 className="text-4xl font-bold font-cinzel text-center text-[--text-primary] mb-12">
                           All Magical Wares
                        </h2>
                    </div>
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
                </section>
            </div>
        </>
    );
};
