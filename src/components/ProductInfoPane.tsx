import React, { useState } from 'react';
import { ProductWithTotalStock, Seller, Order, ProductReview } from '../types';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { WishlistButton } from './WishlistButton';
import { StarRating } from './StarRating';

interface ProductInfoPaneProps {
    product: ProductWithTotalStock;
    seller: Seller | undefined;
    orders: Order[];
    onAddReview: (review: Omit<ProductReview, 'id' | 'isVerifiedPurchase' | 'userName' | 'userId'>) => void;
}

export const ProductInfoPane: React.FC<ProductInfoPaneProps> = ({ product, seller }) => {
    const { addToCart } = useCart();
    const { getDisplayPrice } = useCurrency();
    const { t } = useLanguage();
    const { isB2BMode } = useTheme();
    const [quantity, setQuantity] = useState<number | ''>(1);
    const [isAdded, setIsAdded] = useState(false);

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '') {
          setQuantity('');
          return;
        }
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue > 0) {
            setQuantity(Math.min(numValue, product.stock));
        }
    };

    const handleAddToCart = () => {
        const finalQuantity = typeof quantity === 'number' && quantity > 0 ? quantity : 1;
        addToCart(product, finalQuantity);
        setIsAdded(true);
        setTimeout(() => {
          setIsAdded(false);
        }, 2000);
    };
    
    const priceToDisplay = isB2BMode && product.tradePrice ? product.tradePrice : product.pricing;

    return (
        <>
            <p className="text-sm font-semibold text-[--text-muted] mb-2">Sold by: {seller?.name || 'House of Spells'}</p>
            <h1 className="text-4xl font-bold font-cinzel text-[--accent] mb-2">{t(product.name)}</h1>
            {product.reviewCount > 0 && (
                <div className="flex items-center gap-2 mb-4">
                    <StarRating rating={product.averageRating} />
                    <a href="#reviews" className="text-sm text-[--text-muted] hover:underline">({product.reviewCount} reviews)</a>
                </div>
            )}
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                    <span className="text-sm bg-gray-700 text-[--accent] px-3 py-1 rounded-full inline-block">{product.taxonomy.fandom}</span>
                    <span className="text-sm bg-gray-700 text-[--accent] px-3 py-1 rounded-full inline-block">{product.taxonomy.subCategory}</span>
                </div>
                <span className="text-sm text-[--text-muted]">SKU: {product.sku}</span>
            </div>

            <div className="space-y-4 text-[--text-secondary] text-lg mb-6 flex-grow">
                <blockquote className="border-l-4 border-[--accent]/50 pl-4 italic text-[--text-muted]">
                {t(product.description)}
                </blockquote>
            </div>

            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <p className="text-3xl font-bold text-[--text-primary]">{getDisplayPrice(priceToDisplay)}</p>
                    <p className={`text-lg font-bold ${product.stock > 0 ? 'text-green-400' : 'text-red-500'}`}>
                        {product.stock > 0 ? `${product.stock} total in stock` : 'Out of Stock'}
                    </p>
                </div>
                {isB2BMode && product.rrp && Object.values(product.rrp).some(p => (p as number) > 0) && (
                <p className="text-sm text-[--text-muted] mt-1">Suggested Retail Price (RRP): {getDisplayPrice(product.rrp)}</p>
                )}
            </div>

            {product.stock > 0 ? (
                <div className="flex items-center gap-4">
                    <div className="flex items-center">
                        <button
                            type="button"
                            onClick={() => setQuantity(q => Math.max(1, (Number(q) || 1) - 1))}
                            disabled={(Number(quantity) || 1) <= 1}
                            className="h-12 w-12 flex items-center justify-center bg-[--bg-tertiary] text-[--text-primary] rounded-l-full border border-r-0 border-[--border-color] hover:bg-[--border-color] disabled:opacity-50 transition-colors"
                            aria-label="Decrease quantity"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                        </button>
                        <input
                            type="text"
                            role="spinbutton"
                            value={quantity}
                            onChange={handleQuantityChange}
                            onBlur={() => { if (quantity === '' || Number(quantity) < 1) setQuantity(1); }}
                            className="h-12 w-16 bg-[--bg-primary] text-[--text-primary] text-center font-bold text-lg border-t border-b border-[--border-color] focus:ring-2 focus:ring-inset focus:ring-[--accent] focus:outline-none focus:z-10"
                            min="1"
                            max={product.stock}
                            aria-label="Quantity"
                            aria-valuemin={1}
                            aria-valuemax={product.stock}
                            aria-valuenow={Number(quantity)}
                        />
                        <button
                            type="button"
                            onClick={() => setQuantity(q => Math.min(product.stock, (Number(q) || 0) + 1))}
                            disabled={Number(quantity) >= product.stock}
                            className="h-12 w-12 flex items-center justify-center bg-[--bg-tertiary] text-[--text-primary] rounded-r-full border border-l-0 border-[--border-color] hover:bg-[--border-color] disabled:opacity-50 transition-colors"
                            aria-label="Increase quantity"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        </button>
                    </div>
                    <button 
                        onClick={handleAddToCart}
                        disabled={isAdded}
                        className={`flex-grow px-8 h-12 font-bold text-lg rounded-full transition duration-300 transform shadow-lg flex items-center justify-center gap-2
                            ${isAdded 
                                ? '!bg-emerald-600 !text-white cursor-not-allowed' 
                                : 'bg-[--accent] text-[--bg-primary] hover:bg-[--accent-hover] hover:scale-105 shadow-[--accent]/20'
                            }`}
                    >
                        {isAdded ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Added
                            </>
                        ) : (
                            'Add to Cart'
                        )}
                    </button>
                    <WishlistButton productId={product.id} />
                </div>
            ) : (
                <button
                disabled
                className="w-full px-8 py-3 bg-gray-500 text-gray-300 font-bold text-lg rounded-full cursor-not-allowed"
                >
                Out of Stock
                </button>
            )}
        </>
    );
}