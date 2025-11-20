import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Promotion } from '../types';
import { apiService } from '../services/apiService';

interface PromotionsContextType {
  promotions: Promotion[];
  addPromotion: (promotion: Omit<Promotion, 'id'>) => Promise<void>;
  updatePromotion: (updatedPromotion: Promotion) => Promise<void>;
  validatePromoCode: (code: string) => Promotion | null;
  recordPromotionUsage: (promotionId: number) => void;
}

const PromotionsContext = createContext<PromotionsContextType | undefined>(undefined);

export const PromotionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const promos = await apiService.fetchPromotions();
        setPromotions(promos);
      } catch (error) {
        console.error("Failed to fetch promotions:", error);
      }
    };
    fetchPromos();
  }, []);


  const addPromotion = async (promotion: Omit<Promotion, 'id'>) => {
    const newPromotion = await apiService.addPromotion(promotion);
    setPromotions(prev => [...prev, newPromotion]);
  };

  const updatePromotion = async (updatedPromotion: Promotion) => {
    const savedPromotion = await apiService.updatePromotion(updatedPromotion);
    setPromotions(prev => prev.map(p => p.id === savedPromotion.id ? savedPromotion : p));
  };
  
  const validatePromoCode = (code: string): Promotion | null => {
      const promotion = promotions.find(p => p.code.toUpperCase() === code.toUpperCase());
      if (!promotion || !promotion.isActive) return null;

      // Check date range
      const now = new Date();
      if (promotion.startDate && new Date(promotion.startDate) > now) return null; // Not started yet
      if (promotion.endDate && new Date(promotion.endDate) < now) return null; // Expired

      // Check usage limits
      if (promotion.maxUsage && promotion.usageCount >= promotion.maxUsage) return null;

      return promotion;
  };

  const recordPromotionUsage = (promotionId: number) => {
    // This should ideally be a backend call, but for now we'll optimistically update
    setPromotions(prev => prev.map(p => 
      p.id === promotionId ? { ...p, usageCount: p.usageCount + 1 } : p
    ));
    // Example: apiService.recordPromotionUsage(promotionId);
  };

  return (
    <PromotionsContext.Provider value={{ promotions, addPromotion, updatePromotion, validatePromoCode, recordPromotionUsage }}>
      {children}
    </PromotionsContext.Provider>
  );
};

export const usePromotions = () => {
  const context = useContext(PromotionsContext);
  if (context === undefined) {
    throw new Error('usePromotions must be used within a PromotionsProvider');
  }
  return context;
};
