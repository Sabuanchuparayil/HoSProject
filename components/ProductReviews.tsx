import React from 'react';
import { ProductReview } from '../types';
import { StarRating } from './StarRating';

interface ProductReviewsProps {
    productId: number;
    reviews: ProductReview[];
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, reviews }) => {
    const productReviews = reviews.filter(r => r.productId === productId);

    if (productReviews.length === 0) {
        return (
            <div className="mt-12 text-center text-[--text-muted]">
                <p>This item has no reviews yet. Be the first to share your thoughts!</p>
            </div>
        );
    }

    return (
        <div className="mt-12">
            <h2 className="text-3xl font-bold font-cinzel text-[--text-primary] mb-6">Customer Reviews</h2>
            <div className="space-y-8">
                {productReviews.map(review => (
                    <div key={review.id} className="p-6 bg-[--bg-primary] rounded-lg border border-[--border-color]">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-semibold text-lg text-[--text-secondary]">{review.userName}</h4>
                                <p className="text-xs text-[--text-muted]">{new Date(review.date).toLocaleDateString()}</p>
                            </div>
                            <StarRating rating={review.rating} />
                        </div>
                        {review.isVerifiedPurchase && (
                             <span className="text-xs font-bold text-green-400 bg-green-900/50 px-2 py-1 rounded-full my-2 inline-block">
                                ✔ Verified Purchase
                            </span>
                        )}
                        <p className="mt-2 text-[--text-secondary] leading-relaxed">{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
