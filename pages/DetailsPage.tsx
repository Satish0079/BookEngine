import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import api from '../services/api';
import type { Experience, DateSlots } from '../types';
import { Header } from '../components/Header';
import { StarIcon } from '../components/icons';
import { format } from 'date-fns';

interface DetailsPageProps {
  experienceId: number;
}

const DetailsPage: React.FC<DetailsPageProps> = ({ experienceId }) => {
  const { navigateTo, booking, selectSlot, navigateTo: navigate } = useAppContext();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [slots, setSlots] = useState<DateSlots[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const expData = await api.getExperienceById(experienceId);
      if (expData) {
        setExperience(expData);
        const slotsData = await api.getSlotsForExperience(experienceId);
        setSlots(slotsData);
        if (slotsData.length > 0) {
          setSelectedDate(slotsData[0].date);
        }
      }
    };
    fetchData();
  }, [experienceId]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    selectSlot(date, ''); // Reset time selection when date changes
  };

  const handleTimeSelect = (time: string, available: boolean) => {
    if (available) {
      selectSlot(selectedDate, time);
    }
  };

  if (!experience) {
    return null; // Or a loading skeleton
  }

  const selectedDateSlots = slots.find(s => s.date === selectedDate)?.slots || [];

  return (
    <div className="pb-24">
      <Header title="BookIt" onBack={() => navigateTo({ name: 'home' })} />
      <div className="relative h-64 sm:h-80">
        <img src={experience.images[0]} alt={experience.title} className="w-full h-full object-cover" />
      </div>
      <main className="p-4 sm:p-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">{experience.title}</h2>
        <p className="text-text-secondary mt-1">{experience.location}</p>
        <div className="flex items-center mt-2 text-text-secondary">
          <StarIcon className="w-5 h-5 text-yellow-400" />
          <span className="ml-1 font-semibold">{experience.rating}</span>
          <span className="ml-1">({experience.reviews} reviews)</span>
        </div>

        <div className="mt-6 pt-6 border-t border-border-light">
          <h3 className="text-lg font-bold text-text-primary">About the experience</h3>
          <p className="mt-2 text-text-secondary leading-relaxed">{experience.description}</p>
        </div>

        <div className="mt-6 pt-6 border-t border-border-light">
          <h3 className="text-lg font-bold text-text-primary mb-4">Select Date & Time</h3>
          <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4">
            {slots.map(({ date }) => {
              const d = new Date(date + 'T00:00:00'); // Ensure correct date parsing
              const isSelected = selectedDate === date;
              return (
                <button
                  key={date}
                  onClick={() => handleDateSelect(date)}
                  className={`flex-shrink-0 text-center p-3 rounded-lg w-20 transition-colors ${
                    isSelected ? 'bg-primary text-white shadow-lg' : 'bg-secondary-bg hover:bg-gray-200'
                  }`}
                >
                  <p className="font-semibold text-sm">{format(d, 'EEE')}</p>
                  <p className="font-bold text-2xl">{format(d, 'd')}</p>
                  <p className="text-sm">{format(d, 'MMM')}</p>
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            {selectedDateSlots.map(({ time, available }) => {
              const isSelected = booking.time === time;
              return (
                <button
                  key={time}
                  disabled={!available}
                  onClick={() => handleTimeSelect(time, available)}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    !available
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                      : isSelected
                      ? 'bg-primary text-white border-primary ring-2 ring-primary ring-offset-2'
                      : 'bg-white border-border-light hover:border-primary'
                  }`}
                >
                  {time}
                  {!available && <span className="text-xs block">Sold Out</span>}
                </button>
              );
            })}
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 w-full max-w-4xl mx-auto bg-white p-4 border-t border-border-light shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-primary font-bold text-xl">${experience.price}</p>
            <p className="text-text-secondary text-sm">/ person</p>
          </div>
          <button
            onClick={() => navigate({ name: 'checkout' })}
            disabled={!booking.time}
            className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
