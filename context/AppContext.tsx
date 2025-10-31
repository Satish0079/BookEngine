import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Page, Booking, Experience, UserDetails } from '../types';
import api from '../services/api';

interface AppContextType {
  page: Page;
  booking: Booking;
  isLoading: boolean;
  error: string | null;
  navigateTo: (page: Page) => void;
  selectExperience: (experience: Experience) => void;
  selectSlot: (date: string, time: string) => void;
  updateUserDetails: (details: Partial<UserDetails>) => void;
  applyPromoCode: (code: string) => Promise<void>;
  submitBooking: () => Promise<void>;
  resetBooking: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const TAX_RATE = 0.08;

const initialBookingState: Booking = {
  experience: null,
  date: null,
  time: null,
  userDetails: {
    fullName: '',
    email: '',
    phone: '',
  },
  promoCode: '',
  pricing: {
    basePrice: 0,
    taxes: 0,
    discount: 0,
    total: 0,
  },
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [page, setPage] = useState<Page>({ name: 'home' });
  const [booking, setBooking] = useState<Booking>(initialBookingState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const calculatePricing = useCallback((currentBooking: Booking) => {
    if (!currentBooking.experience) return initialBookingState.pricing;

    const basePrice = currentBooking.experience.price;
    const taxes = basePrice * TAX_RATE;
    const subtotal = basePrice + taxes;
    
    // This is a simplified discount logic. A real app would handle percent vs flat better.
    const discount = currentBooking.pricing.discount;
    
    const total = Math.max(0, subtotal - discount);

    return { basePrice, taxes, discount, total };
  }, []);

  const navigateTo = (newPage: Page) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };
  
  const selectExperience = (experience: Experience) => {
    setBooking(prev => {
        const newBooking = { ...initialBookingState, experience };
        const pricing = calculatePricing(newBooking);
        return { ...newBooking, pricing };
    });
    navigateTo({ name: 'details', experienceId: experience.id });
  };

  const selectSlot = (date: string, time: string) => {
    setBooking(prev => ({ ...prev, date, time }));
  };

  const updateUserDetails = (details: Partial<UserDetails>) => {
    setBooking(prev => ({
      ...prev,
      userDetails: { ...prev.userDetails, ...details },
    }));
  };
  
  const resetBooking = useCallback(() => {
    setBooking(initialBookingState);
    navigateTo({ name: 'home' });
  }, []);

  const applyPromoCode = async (code: string) => {
    if (!booking.experience) return;
    setIsLoading(true);
    setError(null);
    try {
      const { discount, type } = await api.validatePromoCode(code);
      setBooking(prev => {
        const basePrice = prev.experience?.price || 0;
        const discountAmount = type === 'PERCENT' ? basePrice * discount : discount;
        const newBooking = { ...prev, promoCode: code, pricing: { ...prev.pricing, discount: discountAmount } };
        const newPricing = calculatePricing(newBooking);
        return { ...newBooking, pricing: newPricing };
      });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const submitBooking = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.submitBooking(booking);
      if (response.success) {
        navigateTo({ name: 'result', status: 'success' });
      } else {
        navigateTo({ name: 'result', status: 'failure' });
      }
    } catch (e: any) {
      setError('An unexpected error occurred.');
      navigateTo({ name: 'result', status: 'failure' });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    page,
    booking,
    isLoading,
    error,
    navigateTo,
    selectExperience,
    selectSlot,
    updateUserDetails,
    applyPromoCode,
    submitBooking,
    resetBooking
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
