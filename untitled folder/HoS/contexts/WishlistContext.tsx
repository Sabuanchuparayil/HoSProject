import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: number[]; // Array of product IDs
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const { user } = useAuth();

  // Load wishlist from localStorage when user logs in or on initial load
  useEffect(() => {
    if (user) {
      try {
        const storedWishlist = localStorage.getItem(`wishlist_${user.id}`);
        if (storedWishlist) {
          setWishlist(JSON.parse(storedWishlist));
        } else {
          setWishlist([]);
        }
      } catch (error) {
        console.error("Failed to parse wishlist from localStorage", error);
        setWishlist([]);
      }
    } else {
      // Clear wishlist when user logs out
      setWishlist([]);
    }
  }, [user]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlist));
      } catch (error) {
        console.error("Failed to save wishlist to localStorage", error);
      }
    }
  }, [wishlist, user]);

  const addToWishlist = (productId: number) => {
    setWishlist(prevWishlist => {
      if (!prevWishlist.includes(productId)) {
        return [...prevWishlist, productId];
      }
      return prevWishlist;
    });
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist(prevWishlist => prevWishlist.filter(id => id !== productId));
  };

  const isInWishlist = (productId: number): boolean => {
    return wishlist.includes(productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
