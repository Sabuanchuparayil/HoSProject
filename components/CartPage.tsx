import React, { useState, useMemo } from 'react';
import { useCart } from '../contexts/CartContext';
import { CartItem } from './CartItem';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrency } from '../contexts/CurrencyContext';
import { usePromotions } from '../contexts/PromotionsContext';
import { useFinancials } from '../contexts/FinancialsContext';
import { calculateOrderTotals } from '../services/financialService';
import { useTheme } from '../contexts/ThemeContext';


export const CartPage: React.FC = () => {
  const { cartItems, clearCart, applyPromotion, appliedPromotion } = useCart();
  const { currency, getDisplayPrice } = useCurrency();
  const { validatePromoCode } = usePromotions();
  const { taxRates } = useFinancials();
  const { isB2BMode } = useTheme();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
        const priceObject = isB2BMode && item.tradePrice ? item.tradePrice : item.pricing;
        return total + (priceObject[currency] || 0) * item.quantity;
    }, 0);
  }, [cartItems, currency, isB2BMode]);
  
  const summary = useMemo(() => {
    // We pass a dummy country code because taxes/shipping aren't shown in the cart summary
    // and pass undefined for shipping cost as it's not yet selected.
    return calculateOrderTotals(cartItems, currency, 'US', appliedPromotion, undefined, taxRates, isB2BMode);
  }, [cartItems, currency, appliedPromotion, taxRates, isB2BMode]);


  const handleApplyPromo = () => {
    setPromoError('');
    applyPromotion(null);
    if (!promoCode) return;
    
    const promotion = validatePromoCode(promoCode);

    if (!promotion) {
        setPromoError('This code is not valid or has expired.');
        return;
    }

    if (promotion.minSpend && subtotal < promotion.minSpend) {
        setPromoError(`You must spend ${getDisplayPrice({[currency]: promotion.minSpend})} to use this code.`);
        return;
    }
    
    // Check for category/product specific promotions
    if (promotion.applicableCategory) {
        const hasApplicableItem = cartItems.some(item => item.taxonomy.subCategory === promotion.applicableCategory);
        if (!hasApplicableItem) {
            setPromoError(`This code is only valid for items in the '${promotion.applicableCategory}' category.`);
            return;
        }
    }
    
    if (promotion.applicableProductIds) {
        const hasApplicableItem = cartItems.some(item => promotion.applicableProductIds!.includes(item.id));
        if (!hasApplicableItem) {
            setPromoError(`This code is not valid for the items in your cart.`);
            return;
        }
    }

    applyPromotion(promotion);
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-4xl font-cinzel font-bold text-[--text-primary] mb-4">Your Cart is Empty</h1>
        <p className="text-[--text-muted] mb-8">Looks like you haven't added any magic to your cart yet.</p>
        <Link to="/" className="px-8 py-3 bg-[--accent] text-[--bg-primary] font-bold text-lg rounded-full hover:bg-[--accent-hover] transition duration-300 transform hover:scale-105 shadow-lg shadow-[--accent]/20">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-cinzel font-bold text-[--text-primary] mb-8">Your Shopping Cart</h1>
      <div className="lg:flex lg:gap-8">
        <div className="lg:w-2/3">
          <div className="bg-[--bg-secondary] rounded-lg shadow-xl overflow-hidden">
            <div>
              {cartItems.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
        <div className="lg:w-1/3 mt-8 lg:mt-0">
          <div className="bg-[--bg-secondary] rounded-lg shadow-xl p-6 sticky top-28">
            <h2 className="text-2xl font-cinzel font-bold text-[--text-primary] mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[--text-muted]">Subtotal</span>
                <span className="text-[--text-primary] font-semibold">{getDisplayPrice({ [currency]: summary.subtotal })}</span>
              </div>
              {summary.discountAmount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span className="text-[--text-muted]">Discount ({appliedPromotion?.code})</span>
                  <span>- {getDisplayPrice({ [currency]: summary.discountAmount })}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold border-t border-[--border-color] pt-2 mt-2">
                <span className="text-[--text-primary]">Total</span>
                <span className="text-[--text-primary]">{getDisplayPrice({ [currency]: summary.total - summary.shippingCost - summary.taxes })}</span>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-[--text-muted] mb-1">Promo Code</label>
              <div className="flex">
                <input 
                  type="text" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="w-full bg-[--bg-primary] border border-[--border-color] rounded-l-md px-3 py-2 text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-[--accent]"
                />
                <button onClick={handleApplyPromo} className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-r-md hover:bg-gray-600">Apply</button>
              </div>
              {promoError && <p className="text-red-500 text-sm mt-2">{promoError}</p>}
              {appliedPromotion && !promoError && <p className="text-green-400 text-sm mt-2">"{appliedPromotion.description}" applied!</p>}
            </div>
            <div className="mt-6 flex flex-col gap-4">
              <button 
                onClick={handleCheckout}
                className="w-full px-8 py-3 bg-[--accent] text-[--bg-primary] font-bold text-lg rounded-full hover:bg-[--accent-hover] transition duration-300 transform hover:scale-105"
              >
                Proceed to Checkout
              </button>
              <button 
                onClick={clearCart}
                className="w-full text-center text-sm text-[--text-muted] hover:text-red-500 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};