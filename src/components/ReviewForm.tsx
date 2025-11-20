import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ProductReview } from '../types';

interface ReviewFormProps {
    productId: number;
    onAddReview: (review: Omit<ProductReview, 'id' | 'isVerifiedPurchase' | 'userName' | 'userId'>) => void;
    hasPurchased: boolean;
}

const StarInput: React.FC<{ rating: number, onRatingChange: (rating: number) => void }> = ({ rating, onRatingChange }) => {
    return (
        <div className="flex" onMouseLeave={() => { /* keep selection */ }}>
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    type="button"
                    key={star}
                    onClick={() => onRatingChange(star)}
                    className="text-3xl focus:outline-none"
                    aria-label={`Rate ${star} stars`}
                >
                    <span className={star <= rating ? 'text-yellow-400' : 'text-gray-500'}>★</span>
                </button>
            ))}
        </div>
    );
};


export const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onAddReview, hasPurchased }) => {
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a star rating.');
            return;
        }
        if (comment.trim() === '') {
            setError('Please write a comment for your review.');
            return;
        }

        onAddReview({
            productId,
            rating,
            comment,
            date: new Date().toISOString(),
        });

        // Reset form
        setRating(0);
        setComment('');
        setError('');
    };

    if (!user) {
        return null; // Don't show form if not logged in
    }

    return (
        <div className="bg-[--bg-primary] p-6 rounded-lg border border-[--border-color] mt-8">
            <h3 className="text-xl font-bold font-cinzel text-[--text-primary] mb-4">Write a Review</h3>
            {hasPurchased && (
                <div className="bg-green-900/50 border border-green-700 text-green-300 text-sm p-3 rounded-md mb-4">
                    ✨ As a verified buyer, you'll earn 10 loyalty points for submitting a review!
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-[--text-muted] mb-2">Your Rating</label>
                    <StarInput rating={rating} onRatingChange={setRating} />
                </div>
                <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-[--text-muted] mb-2">Your Review</label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        rows={4}
                        placeholder="Tell us what you think about this magical item..."
                        className="w-full bg-[--bg-tertiary] border border-[--border-color] rounded-md py-2 px-3 text-[--text-primary] focus:ring-[--accent] focus:border-[--accent]"
                    ></textarea>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <div className="text-right">
                    <button type="submit" className="px-6 py-2 bg-[--accent] text-[--accent-foreground] font-bold rounded-full hover:bg-[--accent-hover] transition duration-300">
                        Submit Review
                    </button>
                </div>
            </form>
        </div>
    );
};
