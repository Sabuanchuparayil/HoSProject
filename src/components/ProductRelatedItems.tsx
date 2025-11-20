import React, { useMemo } from 'react';
import { ProductWithTotalStock, ProductReview, Order } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { ProductReviews } from './ProductReviews';
import { ReviewForm } from './ReviewForm';
import { ProductCarousel } from './ProductCarousel';

interface ProductRelatedItemsProps {
    product: ProductWithTotalStock;
    allProducts: ProductWithTotalStock[];
    reviews: ProductReview[];
    orders: Order[];
    onAddReview: (review: Omit<ProductReview, 'id' | 'isVerifiedPurchase' | 'userName' | 'userId'>) => void;
    isLoading: boolean;
}

export const ProductRelatedItems: React.FC<ProductRelatedItemsProps> = ({ product, allProducts, reviews, orders, onAddReview, isLoading }) => {
    const { user } = useAuth();
    
    const hasPurchased = !!(user && product && orders.some(order => 
        order.shippingAddress.email === user.email && 
        order.items.some(item => item.id === product.id) &&
        order.status === 'Delivered'
    ));

    const moreInFandom = useMemo(() => {
        if (!product) return [];
        return allProducts.filter(p => p.taxonomy.fandom === product.taxonomy.fandom && p.id !== product.id).slice(0, 10);
    }, [product, allProducts]);

    const alsoViewed = useMemo(() => {
        if (!product) return [];
        // Simulate "also viewed" by finding items in the same sub-category
        return allProducts.filter(p => p.taxonomy.subCategory === product.taxonomy.subCategory && p.id !== product.id).slice(0, 10);
    }, [product, allProducts]);

    return (
        <>
            <div id="reviews" className="scroll-mt-20">
                <ProductReviews productId={product.id} reviews={reviews} />
                {user && (
                    <ReviewForm productId={product.id} onAddReview={onAddReview} hasPurchased={hasPurchased} />
                )}
            </div>

            <div className="mt-20 space-y-20">
                {moreInFandom.length > 0 && (
                    <ProductCarousel
                        title={`More from ${product.taxonomy.fandom}`}
                        products={moreInFandom}
                        isLoading={isLoading}
                    />
                )}
                {alsoViewed.length > 0 && (
                    <ProductCarousel
                        title="You Might Also Like"
                        products={alsoViewed}
                        isLoading={isLoading}
                    />
                )}
            </div>
        </>
    );
}