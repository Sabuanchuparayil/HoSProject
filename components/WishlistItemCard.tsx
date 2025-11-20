import React from 'react';
import { Link } from 'react-router-dom';
import type { ProductWithTotalStock } from '../types';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useWishlist } from '../contexts/WishlistContext';

interface WishlistItemCardProps {
  product: ProductWithTotalStock;
}

export const WishlistItemCard: React.FC<WishlistItemCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { removeFromWishlist } = useWishlist();
  const { getDisplayPrice } = useCurrency();
  const { t } = useLanguage();
  const primaryImage = product.media && product.media.length > 0 ? product.media[0].url : '';

  const handleAddToCart = () => {
    addToCart(product, 1);
    // Optional: remove from wishlist after adding to cart
    // removeFromWishlist(product.id);
  };

  const handleRemove = () => {
    removeFromWishlist(product.id);
  };

  const AddToCartButton = () => {
    if (product.hasVariations) {
        return (
            <Link to={`/product/${product.id}`} className="block w-full text-center px-4 py-2 bg-[--accent] text-[--accent-foreground] text-sm font-bold rounded-full hover:bg-[--accent-hover] transition-colors">
                Select Options
            </Link>
        )
    }
    return (
         <button 
            onClick={handleAddToCart} 
            aria-label={`Add ${t(product.name)} to cart`}
            disabled={product.stock === 0}
            className="w-full px-4 py-2 bg-[--accent] text-[--accent-foreground] text-sm font-bold rounded-full hover:bg-[--accent-hover] transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
    );
  }

  return (
    <div className="bg-[--bg-secondary] rounded-lg overflow-hidden shadow-lg flex flex-col h-full border border-[--border-color]">
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden h-56 bg-[--bg-tertiary] group">
        <img 
            src={primaryImage} 
            alt={t(product.name)} 
            className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-500"
            loading="lazy"
        />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold font-cinzel text-[--accent] truncate">
            <Link to={`/product/${product.id}`}>{t(product.name)}</Link>
        </h3>
        <p className="text-[--text-muted] text-sm mt-1 flex-grow line-clamp-2">{t(product.description)}</p>
        <p className="text-xl font-bold text-[--text-primary] mt-4">{getDisplayPrice(product.pricing)}</p>
      </div>
      <div className="p-4 border-t border-[--border-color] flex flex-col gap-2">
         <AddToCartButton />
           <button 
            onClick={handleRemove} 
            aria-label={`Remove ${t(product.name)} from wishlist`}
            className="w-full text-center text-sm text-[--text-muted] hover:text-red-500 transition-colors"
        >
            Remove
          </button>
      </div>
    </div>
  );
};