import React, { useState, useEffect } from 'react';
import { Service } from '../types';
import { generateServiceDescription } from '../services/geminiService';

interface ServiceCardProps {
  service: Service;
  onSelect: (service: Service) => void;
  isLoggedIn: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect, isLoggedIn }) => {
  const [description, setDescription] = useState<string>('Loading description...');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDescription = async () => {
      setIsLoading(true);
      const generatedDesc = await generateServiceDescription(service.name);
      setDescription(generatedDesc);
      setIsLoading(false);
    };

    fetchDescription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service.name]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-card border border-slate-200/50 flex flex-col transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-slate-800">{service.name}</h3>
        {isLoading ? (
          <div className="mt-2 space-y-2 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          </div>
        ) : (
          <p className="text-slate-600 mt-2">{description}</p>
        )}
      </div>
      <div className="mt-6 flex justify-between items-center">
        <p className="text-2xl font-semibold text-primary">
          ${service.basePrice}<span className="text-base font-normal text-slate-500">/job</span>
        </p>
        <button
          onClick={() => onSelect(service)}
          className="bg-gradient-to-r from-primary to-blue-500 text-white font-semibold py-2 px-5 rounded-lg hover:opacity-90 transition-all duration-300 shadow-sm"
        >
          {isLoggedIn ? 'Find a Provider' : 'Login to Book'}
        </button>
      </div>
    </div>
  );
};