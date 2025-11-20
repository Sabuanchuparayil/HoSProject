import React from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';

interface WishlistButtonProps {
    productId: number;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({ productId }) => {
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const { user } = useAuth();
    const isWishlisted = isInWishlist(productId);

    const handleToggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            // In a real app, you might redirect to login or show a modal
            alert("Please log in to save items to your wishlist.");
            return;
        }

        if (isWishlisted) {
            removeFromWishlist(productId);
        } else {
            addToWishlist(productId);
        }
    };

    if (user?.role !== 'customer') {
        return null;
    }
    
    const buttonClasses = `p-2 bg-[--bg-primary]/50 rounded-full hover:bg-[--bg-primary] transition-all duration-200 ${
        isWishlisted
        ? 'text-red-500' // Always red if wishlisted
        : 'text-[--text-primary] hover:text-red-500' // White/gray, red on hover if not
    }`;

    return (
        <button
            onClick={handleToggleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={buttonClasses}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isWishlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        </button>
    );
};