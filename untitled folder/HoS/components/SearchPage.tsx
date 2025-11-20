import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ProductWithTotalStock } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';
import { useLanguage } from '../contexts/LanguageContext';
import { fuzzyMatch } from '../services/searchService';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './skeletons/ProductCardSkeleton';
import { StarRating } from './StarRating';
import { TAXONOMY_DATA } from '../data/taxonomy';

interface SearchPageProps {
    products: ProductWithTotalStock[];
}

const allFandoms = Object.keys(TAXONOMY_DATA);

const SearchFilterSidebar: React.FC<{
    availableFandoms: string[],
    selectedFandom: string,
    onFandomChange: (fandom: string) => void,
    selectedSubCategory: string,
    onSubCategoryChange: (subCategory: string) => void,
    availableSubCategories: string[],
    priceLimit: number,
    onPriceChange: (price: number) => void,
    maxPrice: number,
    selectedRating: number,
    onRatingChange: (rating: number) => void,
    formatPrice: (price: number, currency: string) => string,
    currency: string
}> = ({ 
    availableFandoms, 
    selectedFandom, 
    onFandomChange, 
    selectedSubCategory,
    onSubCategoryChange,
    availableSubCategories,
    priceLimit, 
    onPriceChange, 
    maxPrice, 
    selectedRating, 
    onRatingChange, 
    formatPrice, 
    currency 
}) => {
    return (
        <aside className="space-y-6">
            {/* Category Filter */}
            <div>
                <h3 className="font-semibold text-[--accent] mb-3">Category</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="fandom-filter" className="block text-sm font-medium text-[--text-muted] mb-2">Fandom</label>
                        <select id="fandom-filter" value={selectedFandom} onChange={(e) => onFandomChange(e.target.value)} className="w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3 text-[--text-primary] focus:ring-[--accent] focus:border-[--accent]">
                            <option value="All">All Fandoms</option>
                            {availableFandoms.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="subcategory-filter" className="block text-sm font-medium text-[--text-muted] mb-2">Sub-Category</label>
                        <select id="subcategory-filter" value={selectedSubCategory} onChange={(e) => onSubCategoryChange(e.target.value)} disabled={selectedFandom === 'All'} className="w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3 text-[--text-primary] focus:ring-[--accent] focus:border-[--accent] disabled:bg-gray-700/50 disabled:cursor-not-allowed">
                             {availableSubCategories.map(sc => <option key={sc} value={sc}>{sc}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Price Filter */}
            <div className="border-t border-[--border-color] pt-6">
                <h3 className="font-semibold text-[--accent] mb-3">Max Price</h3>
                <input
                    type="range"
                    min={0}
                    max={maxPrice}
                    value={priceLimit}
                    onChange={(e) => onPriceChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                />
                <div className="text-sm text-right mt-1 text-[--text-muted]">
                    Up to {formatPrice(priceLimit, currency)}
                </div>
            </div>
            
             {/* Rating Filter */}
            <div className="border-t border-[--border-color] pt-6">
                 <h3 className="font-semibold text-[--accent] mb-3">Rating</h3>
                 <div className="space-y-2">
                    {[4, 3, 2, 1].map(rating => (
                        <button key={rating} onClick={() => onRatingChange(rating)} className={`flex items-center gap-2 text-left w-full p-1 rounded ${selectedRating === rating ? 'bg-[--accent]/20' : ''}`}>
                            <StarRating rating={rating} />
                            <span className="text-sm text-[--text-muted]">& up</span>
                        </button>
                    ))}
                 </div>
            </div>
        </aside>
    );
}


export const SearchPage: React.FC<SearchPageProps> = ({ products }) => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    
    const { currency, formatPrice } = useCurrency();
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(true);

    // Filter states
    const [selectedFandom, setSelectedFandom] = useState('All');
    const [selectedSubCategory, setSelectedSubCategory] = useState('All');
    const [selectedRating, setSelectedRating] = useState(0);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const maxPrice = useMemo(() => {
        if (products.length === 0) return 1000;
        const max = Math.ceil(Math.max(...products.map(p => p.pricing[currency] || 0)));
        return max > 0 ? max : 1000;
    }, [products, currency]);
    
    const [priceLimit, setPriceLimit] = useState(maxPrice);
    
    // Reset price limit when maxPrice changes
    useEffect(() => {
        setPriceLimit(maxPrice);
    }, [maxPrice]);
    
    // Simulate loading
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, [query]);

    // Initial search based on query param
    const initialResults = useMemo(() => {
        if (!query) return products;
        return products.filter(p => fuzzyMatch(query, t(p.name)));
    }, [query, products, t]);
    
    const availableFandomsInResults = useMemo(() => {
        return [...new Set(initialResults.map(p => p.taxonomy.fandom))];
    }, [initialResults]);

    const availableSubCategories = useMemo(() => {
        if (selectedFandom === 'All' || !TAXONOMY_DATA[selectedFandom]) {
          return [];
        }
        return ['All', ...TAXONOMY_DATA[selectedFandom]];
    }, [selectedFandom]);

    useEffect(() => {
        setSelectedSubCategory('All');
    }, [selectedFandom]);

    const filteredResults = useMemo(() => {
        return initialResults
            .filter(p => selectedFandom === 'All' || p.taxonomy.fandom === selectedFandom)
            .filter(p => selectedSubCategory === 'All' || p.taxonomy.subCategory === selectedSubCategory)
            .filter(p => (p.pricing[currency] || 0) <= priceLimit)
            .filter(p => p.averageRating >= selectedRating);
    }, [initialResults, selectedFandom, selectedSubCategory, priceLimit, selectedRating, currency]);

    const handleClearFilters = () => {
        setSelectedFandom('All');
        setSelectedSubCategory('All');
        setSelectedRating(0);
        setPriceLimit(maxPrice);
    }
    
    const filterSidebarProps = {
        availableFandoms: availableFandomsInResults,
        selectedFandom,
        onFandomChange: setSelectedFandom,
        selectedSubCategory,
        onSubCategoryChange: setSelectedSubCategory,
        availableSubCategories,
        priceLimit,
        onPriceChange: setPriceLimit,
        maxPrice,
        selectedRating,
        onRatingChange: setSelectedRating,
        formatPrice,
        currency
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link to="/" className="text-sm font-semibold text-[--accent] hover:text-[--accent-hover] mb-6 inline-block transition-colors">
                &larr; Back to Homepage
            </Link>
            <h1 className="text-3xl font-cinzel font-bold text-[--text-primary] mb-2">
                Search Results
            </h1>
            <p className="text-[--text-muted] mb-8">
                {isLoading ? 'Searching for treasures...' : `${filteredResults.length} items found for "${query}"`}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Filters - Mobile Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsFiltersOpen(!isFiltersOpen)} className="w-full flex justify-between items-center p-3 bg-[--bg-secondary] rounded-md border border-[--border-color]">
                        <span className="font-semibold">Filters</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                    {isFiltersOpen && (
                        <div className="bg-[--bg-secondary] p-4 mt-2 rounded-md border border-[--border-color]">
                             <SearchFilterSidebar {...filterSidebarProps} />
                             <button onClick={handleClearFilters} className="w-full mt-4 text-sm text-[--text-muted] hover:text-[--accent]">Clear All Filters</button>
                        </div>
                    )}
                </div>

                {/* Filters - Desktop Sidebar */}
                <div className="hidden md:block md:col-span-1">
                     <SearchFilterSidebar {...filterSidebarProps} />
                     <button onClick={handleClearFilters} className="w-full mt-6 text-sm text-[--text-muted] hover:text-[--accent]">Clear All Filters</button>
                </div>
                
                {/* Results */}
                <main className="md:col-span-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoading
                            ? Array.from({ length: 9 }).map((_, i) => <ProductCardSkeleton key={i} />)
                            : filteredResults.length > 0
                                ? filteredResults.map(product => <ProductCard key={product.id} product={product} />)
                                : (
                                    <div className="col-span-full text-center py-16 bg-[--bg-secondary] rounded-lg">
                                        <h3 className="text-2xl font-cinzel text-[--text-primary]">No matching items found</h3>
                                        <p className="text-[--text-muted] mt-2">Try clearing some filters or searching for something else.</p>
                                    </div>
                                )
                        }
                    </div>
                    {/* Pagination would go here */}
                </main>
            </div>
        </div>
    );
};