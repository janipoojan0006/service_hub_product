import React from 'react';
import { ServiceCategory, Service } from '../types';
import { ServiceCard } from './ServiceCard';

interface ServiceDetailsViewProps {
  category: ServiceCategory;
  onServiceSelect: (service: Service) => void;
  onBack: () => void;
  isLoggedIn: boolean;
}

export const ServiceDetailsView: React.FC<ServiceDetailsViewProps> = ({ category, onServiceSelect, onBack, isLoggedIn }) => {
  const Icon = category.icon;

  return (
    <div>
      <div className="mb-10 text-center">
        <div className="flex justify-center items-center mb-4">
            <button onClick={onBack} className="absolute left-4 sm:left-8 md:left-16 text-primary hover:text-primary-dark font-semibold flex items-center transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back
            </button>
            <div className="inline-block bg-primary/10 rounded-full p-3">
                <Icon className="h-10 w-10 text-primary" />
            </div>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800">{category.name} Services</h2>
        <p className="text-lg text-slate-600 mt-2">Choose from our available {category.name.toLowerCase()} options.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {category.services.map((service) => (
          <ServiceCard key={service.id} service={service} onSelect={onServiceSelect} isLoggedIn={isLoggedIn} />
        ))}
      </div>
    </div>
  );
};