import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { ProductWithTotalStock } from '../types';
import { WishlistItemCard } from './WishlistItemCard';

interface WishlistPageProps {
    products: ProductWithTotalStock[];
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ products }) => {
    const { wishlist } = useWishlist();

    const wishlistedProducts = useMemo(() => {
        return wishlist.map(productId => products.find(p => p.id === productId)).filter((p): p is ProductWithTotalStock => !!p);
    }, [wishlist, products]);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-cinzel font-bold text-[--accent] mb-8">My Wishlist</h1>
            {wishlistedProducts.length === 0 ? (
                <div className="text-center bg-[--bg-secondary] p-12 rounded-lg shadow-xl">
                    <h2 className="text-2xl font-cinzel font-semibold text-[--text-primary] mb-4">Your Wishlist is Empty</h2>
                    <p className="text-[--text-muted] mb-8">You haven't saved any magical items yet. Add items to your wishlist by clicking the heart icon.</p>
                    <Link to="/" className="px-8 py-3 bg-[--accent] text-[--bg-primary] font-bold text-lg rounded-full hover:bg-[--accent-hover] transition duration-300">
                        Discover Products
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {wishlistedProducts.map(product => (
                        <WishlistItemCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};