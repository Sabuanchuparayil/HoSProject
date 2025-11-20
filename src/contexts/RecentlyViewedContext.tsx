import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';

const RECENTLY_VIEWED_KEY = 'recentlyViewed';
const MAX_RECENTLY_VIEWED = 15;

interface RecentlyViewedContextType {
  recentlyViewedIds: number[];
  addRecentlyViewed: (productId: number) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export const RecentlyViewedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<number[]>([]);

  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(RECENTLY_VIEWED_KEY);
      if (storedItems) {
        setRecentlyViewedIds(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error("Failed to parse recently viewed items from localStorage", error);
    }
  }, []);

  const addRecentlyViewed = useCallback((productId: number) => {
    setRecentlyViewedIds(prevIds => {
      // Remove the id if it already exists to move it to the front
      const newIds = prevIds.filter(id => id !== productId);
      
      // Add the new id to the beginning of the array
      newIds.unshift(productId);
      
      // Enforce the maximum limit
      const finalIds = newIds.slice(0, MAX_RECENTLY_VIEWED);

      try {
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(finalIds));
      } catch (error) {
          console.error("Failed to save recently viewed items to localStorage", error);
      }
      
      return finalIds;
    });
  }, []);

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewedIds, addRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
};
