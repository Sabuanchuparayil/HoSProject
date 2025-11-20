
import React from 'react';
import { Hero } from '../Hero';
import { ProductCard } from '../ProductCard';
import { ProductCardSkeleton } from '../skeletons/ProductCardSkeleton';
import { ProductWithTotalStock, HomePageContent, Order } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { HomePageSearchBar } from '../HomePageSearchBar';

interface LayoutProps {
    products: ProductWithTotalStock[];
    isLoading: boolean;
    filterControls: React.ReactNode;
    paginationControls: React.ReactNode;
    homePageContent: HomePageContent | null;
    allOrders: Order[]; // Added for consistency, not used here
}

// In a real app, this would be fetched or dynamically determined.
// For this demo, we'll feature the Golden Snitch (ID 5).
const FEATURED_PRODUCT_ID = 5;

export const FeaturedProductLayout: React.FC<LayoutProps> = ({ products, isLoading, filterControls, paginationControls, homePageContent }) => {
    const { activeThemeConfig } = useTheme();
    const { t } = useLanguage();

    const allProducts = products; // Assuming filters might be applied later
    const featuredProduct = allProducts.find(p => p.id === FEATURED_PRODUCT_ID);

    const heroContent = homePageContent?.hero?.image && homePageContent?.hero?.title?.en
        ? homePageContent.hero
        : activeThemeConfig.hero;

    return (
        <>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                    {/* Smaller Hero */}
                    <div className="lg:col-span-2">
                         <div 
                            className="relative bg-cover bg-center h-full min-h-[400px] flex items-center justify-center text-center rounded-lg overflow-hidden"
                            style={{ backgroundImage: `url('${heroContent.image}')` }}
                        >
                            <div className="absolute inset-0 bg-black opacity-60"></div>
                            <div className="relative z-10 px-4">
                                <h1 className="text-4xl font-cinzel font-extrabold text-white">
                                    {t(heroContent.title)}
                                </h1>
                                <p className="mt-2 text-lg text-gray-300">
                                    {t(heroContent.subtitle)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Featured Product */}
                    <div className="lg:col-span-3">
                        <h2 className="text-3xl font-cinzel font-bold text-[--accent] mb-4 text-center lg:text-left">Product of the Day</h2>
                        {featuredProduct ? (
                            <Link to={`/product/${featuredProduct.id}`} className="bg-[--bg-secondary] rounded-lg overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[--accent]/20 transform hover:-translate-y-1 transition-all duration-300 group flex flex-col md:flex-row h-full">
                                <div className="relative overflow-hidden md:w-1/2">
                                    <img src={featuredProduct.media[0]?.url} alt={t(featuredProduct.name)} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="p-6 flex flex-col justify-center md:w-1/2">
                                    <h3 className="text-2xl font-bold font-cinzel text-[--accent]">{t(featuredProduct.name)}</h3>
                                    <p className="text-[--text-muted] text-sm mt-2 flex-grow line-clamp-3">{t(featuredProduct.description)}</p>
                                    <button className="mt-4 px-6 py-2 bg-[--accent] text-[--bg-primary] text-base font-bold rounded-full hover:bg-[--accent-hover] transition-all duration-300 self-start">
                                        View Details
                                    </button>
                                </div>
                            </Link>
                        ) : (
                            <div className="bg-[--bg-secondary] p-6 rounded-lg text-center">
                                <p className="text-[--text-muted]">Featured product not available.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                        <p className="text-[--text-muted] mt-2">Try adjusting your filters.</p>
                    </div>
                )}
                {paginationControls}
            </main>
        </>
    );
};
