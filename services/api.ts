import type { Experience, DateSlots, Booking } from '../types';

const MOCK_EXPERIENCES: Experience[] = [
  {
    id: 1,
    title: "Kyoto's Sagano Bamboo Forest",
    location: 'Kyoto, Japan',
    description: 'Immerse yourself in the ethereal beauty of the Sagano Bamboo Forest. This guided tour will take you through the towering bamboo groves, revealing hidden shrines and tranquil gardens. A truly magical experience awaits.',
    price: 120,
    rating: 4.9,
    reviews: 245,
    superhost: true,
    images: ['https://picsum.photos/seed/kyoto1/800/600', 'https://picsum.photos/seed/kyoto2/800/600', 'https://picsum.photos/seed/kyoto3/800/600'],
  },
  {
    id: 2,
    title: 'Northern Lights Adventure in Iceland',
    location: 'Reykjavik, Iceland',
    description: 'Chase the mesmerizing Aurora Borealis on this unforgettable night tour. Our expert guides will take you to the best viewing spots away from city lights, providing warm drinks and fascinating stories about this natural wonder.',
    price: 250,
    rating: 4.8,
    reviews: 412,
    superhost: false,
    images: ['https://picsum.photos/seed/iceland1/800/600', 'https://picsum.photos/seed/iceland2/800/600', 'https://picsum.photos/seed/iceland3/800/600'],
  },
  {
    id: 3,
    title: 'Historic Rome Walking Tour',
    location: 'Rome, Italy',
    description: 'Step back in time as you explore the ancient wonders of Rome. This tour covers the Colosseum, Roman Forum, and Palatine Hill with a knowledgeable historian who will bring the past to life.',
    price: 95,
    rating: 4.9,
    reviews: 789,
    superhost: true,
    images: ['https://picsum.photos/seed/rome1/800/600', 'https://picsum.photos/seed/rome2/800/600', 'https://picsum.photos/seed/rome3/800/600'],
  },
  {
    id: 4,
    title: 'Parisian Cooking Class: Macarons',
    location: 'Paris, France',
    description: "Learn the secrets of making perfect French macarons from a Parisian pastry chef. In this hands-on class, you'll create these delicate treats from scratch and take home your delicious creations.",
    price: 150,
    rating: 4.7,
    reviews: 180,
    superhost: true,
    images: ['https://picsum.photos/seed/paris1/800/600', 'https://picsum.photos/seed/paris2/800/600', 'https://picsum.photos/seed/paris3/800/600'],
  },
];

const PROMO_CODES: { [key: string]: number } = {
  'SAVE10': 0.10, // 10% discount
  'FLAT50': 50, // $50 flat discount
};

const generateSlots = (): DateSlots[] => {
  const slots: DateSlots[] = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    slots.push({
      date: dateString,
      slots: [
        { time: '10:00 AM', available: Math.random() > 0.2 },
        { time: '01:00 PM', available: Math.random() > 0.5 },
        { time: '04:00 PM', available: Math.random() > 0.3 },
      ],
    });
  }
  return slots;
};

const api = {
  getExperiences: (): Promise<Experience[]> => {
    return new Promise(resolve => {
      setTimeout(() => resolve(MOCK_EXPERIENCES), 500);
    });
  },

  getExperienceById: (id: number): Promise<Experience | undefined> => {
    return new Promise(resolve => {
      setTimeout(() => resolve(MOCK_EXPERIENCES.find(exp => exp.id === id)), 500);
    });
  },

  getSlotsForExperience: (experienceId: number): Promise<DateSlots[]> => {
    // In a real app, this would depend on the experienceId
    return new Promise(resolve => {
      setTimeout(() => resolve(generateSlots()), 500);
    });
  },

  validatePromoCode: (code: string): Promise<{ discount: number, type: 'PERCENT' | 'FLAT' }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const discountValue = PROMO_CODES[code.toUpperCase()];
        if (discountValue) {
          if(discountValue < 1) {
            resolve({ discount: discountValue, type: 'PERCENT' });
          } else {
            resolve({ discount: discountValue, type: 'FLAT' });
          }
        } else {
          reject(new Error('Invalid promo code'));
        }
      }, 300);
    });
  },

  submitBooking: (booking: Booking): Promise<{ success: boolean; bookingId: string }> => {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Booking submitted:', booking);
        // Simulate a small chance of failure
        if (Math.random() > 0.1) {
          resolve({ success: true, bookingId: `BK${Date.now()}` });
        } else {
          resolve({ success: false, bookingId: '' });
        }
      }, 1000);
    });
  },
};

export default api;
