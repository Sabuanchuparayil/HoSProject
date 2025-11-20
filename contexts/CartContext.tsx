import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { CartItem, Product, Promotion } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, variationId?: number) => void;
  removeFromCart: (productId: number, variationId?: number) => void;
  updateQuantity: (productId: number, quantity: number, variationId?: number) => void;
  clearCart: () => void;
  itemCount: number;
  appliedPromotion: Promotion | null;
  applyPromotion: (promotion: Promotion | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to manage state with localStorage persistence
function usePersistentState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = useState<T>(() => {
        try {
            const storedValue = window.localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key “${key}”:`, error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error(`Error setting localStorage key “${key}”:`, error);
        }
    }, [key, state]);

    return [state, setState];
}


export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const cartKey = user ? `cart_${user.id}` : 'cart_guest';
  const promoKey = user ? `promo_${user.id}` : 'promo_guest';

  const [cartItems, setCartItems] = usePersistentState<CartItem[]>(cartKey, []);
  const [appliedPromotion, setAppliedPromotion] = usePersistentState<Promotion | null>(promoKey, null);
  
  // Clear guest cart on login
  useEffect(() => {
    if (user) {
        localStorage.removeItem('cart_guest');
        localStorage.removeItem('promo_guest');
    }
  }, [user]);

  const addToCart = (product: Product, quantity: number, variationId?: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id && item.variationId === variationId);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id && item.variationId === variationId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { ...product, quantity, variationId }];
    });
  };

  const removeFromCart = (productId: number, variationId?: number) => {
    setCartItems(prevItems => prevItems.filter(item => !(item.id === productId && item.variationId === variationId)));
  };

  const updateQuantity = (productId: number, quantity: number, variationId?: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variationId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId && item.variationId === variationId ? { ...item, quantity } : item
        )
      );
    }
  };
  
  const clearCart = () => {
    setCartItems([]);
    setAppliedPromotion(null);
  };
  
  const applyPromotion = (promotion: Promotion | null) => {
    setAppliedPromotion(promotion);
  };

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, appliedPromotion, applyPromotion }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};