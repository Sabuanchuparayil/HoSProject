import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Carrier } from '../types';
import { apiService } from '../services/apiService';

interface LogisticsContextType {
  carriers: Carrier[];
  updateCarrier: (updatedCarrier: Carrier) => Promise<void>;
  addCarrier: (newCarrier: Omit<Carrier, 'rates'> & { rates: any[] }) => Promise<void>;
  removeCarrier: (carrierId: string) => Promise<void>;
}

const LogisticsContext = createContext<LogisticsContextType | undefined>(undefined);

export const LogisticsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [carriers, setCarriers] = useState<Carrier[]>([]);

  useEffect(() => {
    const fetchCarriers = async () => {
      try {
        const data = await apiService.fetchCarriers();
        setCarriers(data);
      } catch (error) {
        console.error("Failed to fetch carriers:", error);
      }
    };
    fetchCarriers();
  }, []);


  const updateCarrier = async (updatedCarrier: Carrier) => {
    const savedCarrier = await apiService.updateCarrier(updatedCarrier);
    setCarriers(prev => prev.map(c => c.id === savedCarrier.id ? savedCarrier : c));
  };

  const addCarrier = async (newCarrier:  Omit<Carrier, 'rates'> & { rates: any[] }) => {
    const savedCarrier = await apiService.addCarrier(newCarrier);
    setCarriers(prev => [...prev, savedCarrier]);
  };

  const removeCarrier = async (carrierId: string) => {
    await apiService.removeCarrier(carrierId);
    setCarriers(prev => prev.filter(c => c.id !== carrierId));
  };

  return (
    <LogisticsContext.Provider value={{ carriers, updateCarrier, addCarrier, removeCarrier }}>
      {children}
    </LogisticsContext.Provider>
  );
};

export const useLogistics = () => {
  const context = useContext(LogisticsContext);
  if (context === undefined) {
    throw new Error('useLogistics must be used within a LogisticsProvider');
  }
  return context;
};
