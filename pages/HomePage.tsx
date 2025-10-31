import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { Experience } from '../types';
import { useAppContext } from '../context/AppContext';
import { StarIcon } from '../components/icons';
import { Header } from '../components/Header';

const ExperienceCard: React.FC<{ experience: Experience }> = ({ experience }) => {
    const { selectExperience } = useAppContext();
    return (
        <div 
            className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
            onClick={() => selectExperience(experience)}
        >
            <div className="relative">
                <img src={experience.images[0]} alt={experience.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                {experience.superhost && (
                    <div className="absolute top-2 left-2 bg-white text-text-primary text-xs font-bold px-2 py-1 rounded-md">
                        SUPERHOST
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="font-bold text-lg text-text-primary truncate">{experience.title}</h3>
                <p className="text-text-secondary text-sm mt-1">{experience.location}</p>
                <div className="flex items-center mt-2">
                    <StarIcon className="w-5 h-5 text-yellow-400" />
                    <span className="text-text-secondary text-sm ml-1">{experience.rating}</span>
                </div>
                <p className="text-text-primary font-semibold mt-4">
                    From ${experience.price} <span className="font-normal text-text-secondary">/ person</span>
                </p>
            </div>
        </div>
    );
};


const HomePage: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const { navigateTo } = useAppContext();

  useEffect(() => {
    const fetchExperiences = async () => {
      const data = await api.getExperiences();
      setExperiences(data);
    };
    fetchExperiences();
  }, []);

  return (
    <div>
        <Header title="BookIt" />
        <main className="p-4 sm:p-6">
            <h2 className="text-2xl font-bold mb-6 text-text-primary">Experiences for you</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {experiences.map(exp => (
                    <ExperienceCard key={exp.id} experience={exp} />
                ))}
            </div>
        </main>
    </div>
  );
};

export default HomePage;
