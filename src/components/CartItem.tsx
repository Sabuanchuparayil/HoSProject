import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useLanguage } from '../contexts/LanguageContext';
import { CartItem as CartItemType } from '../types';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { currency, getDisplayPrice } = useCurrency();
  const { t } = useLanguage();

  const variation = item.hasVariations ? item.variations?.find(v => v.id === item.variationId) : undefined;
  
  const displayName = variation 
    ? `${t(item.name)} (${Object.entries(variation.attributes).map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`).join(', ')})` 
    : t(item.name);
  
  const displayPrice = variation ? variation.pricing : item.pricing;
  
  const totalStock = variation 
    ? variation.inventory.reduce((sum, loc) => sum + loc.stock, 0)
    : item.inventory.reduce((sum, loc) => sum + loc.stock, 0);

  const primaryImage = variation?.media?.[0]?.url || (item.media && item.media.length > 0 ? item.media[0].url : '');

  const handleRemove = () => {
    removeFromCart(item.id, item.variationId);
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-[--border-color]">
      <div className="flex items-center gap-4 w-full mb-4 sm:mb-0">
        <img src={primaryImage} alt={t(item.name)} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
        <div className="flex-grow">
          <h3 className="font-bold text-[--text-primary] text-lg">{displayName}</h3>
          <p className="text-[--text-muted]">{getDisplayPrice(displayPrice)}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
        <div className="flex items-center">
            <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity - 1, item.variationId)}
                className="p-2 bg-[--bg-tertiary] rounded-l-md border border-r-0 border-[--border-color] hover:bg-[--border-color] disabled:opacity-50 transition-colors"
                aria-label="Decrease quantity"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
            </button>
            <input
              type="text"
              readOnly
              value={item.quantity}
              className="w-12 h-10 bg-[--bg-primary] text-[--text-primary] text-center font-semibold border-t border-b border-[--border-color] focus:outline-none"
              aria-label={`Quantity for ${t(item.name)}`}
            />
            <button
                type="button"
                onClick={() => updateQuantity(item.id, Math.min(totalStock, item.quantity + 1), item.variationId)}
                disabled={item.quantity >= totalStock}
                className="p-2 bg-[--bg-tertiary] rounded-r-md border border-l-0 border-[--border-color] hover:bg-[--border-color] disabled:opacity-50 transition-colors"
                aria-label="Increase quantity"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            </button>
        </div>
        <p className="font-bold text-[--text-primary] w-24 text-right">{getDisplayPrice({ [currency]: displayPrice[currency] * item.quantity })}</p>
        <button onClick={handleRemove} className="text-gray-500 hover:text-red-500 transition-colors" aria-label={`Remove ${displayName} from cart`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};