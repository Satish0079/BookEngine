export interface Experience {
  id: number;
  title: string;
  location: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  superhost: boolean;
  images: string[];
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface DateSlots {
  date: string; // YYYY-MM-DD
  slots: TimeSlot[];
}

export interface UserDetails {
  fullName: string;
  email: string;
  phone: string;
}

export interface Booking {
  experience: Experience | null;
  date: string | null;
  time: string | null;
  userDetails: UserDetails;
  promoCode: string;
  pricing: {
    basePrice: number;
    taxes: number;
    discount: number;
    total: number;
  };
}

export type Page = 
  | { name: 'home' }
  | { name: 'details'; experienceId: number }
  | { name: 'checkout' }
  | { name: 'result'; status: 'success' | 'failure' };
