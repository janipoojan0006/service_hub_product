import React, { useState } from 'react';
import { ServiceCategory } from '../types';

interface ServiceCategorySelectorProps {
  categories: ServiceCategory[];
  onSelectCategory: (category: ServiceCategory) => void;
  onSearch: (query: string) => void;
}

const ServiceCategoryCard: React.FC<{ category: ServiceCategory; onClick: () => void; }> = ({ category, onClick }) => {
  const Icon = category.icon;
  return (
    <div
      onClick={onClick}
      className="group bg-white p-6 rounded-xl shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-slate-200/50"
    >
      <div className="flex flex-col items-center text-center">
        <div className="bg-primary/10 rounded-full p-4 mb-4 group-hover:bg-primary/20 transition-colors duration-300">
          <Icon className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-1">{category.name}</h3>
        <p className="text-slate-500">{category.description}</p>
      </div>
    </div>
  );
};


export const ServiceCategorySelector: React.FC<ServiceCategorySelectorProps> = ({ categories, onSelectCategory, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };
  
  return (
    <div className="text-center">
      <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 gradient-text">What service do you need?</h2>
      <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8">Describe what you need, or browse categories below.</p>
      
      <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <input 
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g., 'fix my leaky faucet' or 'mow my lawn'"
            className="w-full px-6 py-4 text-lg text-slate-700 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition shadow-sm"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-blue-500 text-white font-semibold py-2.5 px-8 rounded-full hover:opacity-90 transition-opacity duration-300"
          >
            Search
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <ServiceCategoryCard 
            key={category.id} 
            category={category} 
            onClick={() => onSelectCategory(category)}
          />
        ))}
      </div>
    </div>
  );
};