import React from 'react';
import { Service } from '../types';
import { ServiceCard } from './ServiceCard';

interface SearchResultsViewProps {
  query: string;
  results: Service[];
  isLoading: boolean;
  onServiceSelect: (service: Service) => void;
  onBack: () => void;
  isLoggedIn: boolean;
}

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({ query, results, isLoading, onServiceSelect, onBack, isLoggedIn }) => {
  
  if (isLoading) {
    return (
        <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold text-slate-700">Searching for services...</h2>
            <p className="text-slate-500 mt-2">Our AI is finding the best match for "{query}"</p>
        </div>
    )
  }
  
  return (
    <div>
      <div className="mb-10 text-center">
        <div className="flex justify-center items-center mb-4">
            <button onClick={onBack} className="absolute left-4 sm:left-8 md:left-16 text-primary hover:text-primary-dark font-semibold flex items-center transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to Home
            </button>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Search Results for "{query}"</h2>
        <p className="text-lg text-slate-600 mt-2">
            {results.length > 0 ? `We found ${results.length} matching service${results.length > 1 ? 's' : ''}.` : 'No matching services found.'}
        </p>
      </div>
      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {results.map((service) => (
            <ServiceCard key={service.id} service={service} onSelect={onServiceSelect} isLoggedIn={isLoggedIn} />
          ))}
        </div>
      ) : (
         <div className="col-span-full text-center bg-white p-8 rounded-lg shadow-card max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-slate-700">We couldn't find a match</h3>
            <p className="text-slate-500 mt-2">Please try rephrasing your search or browse our categories below.</p>
             <button onClick={onBack} className="mt-6 bg-gradient-to-r from-primary to-blue-500 text-white font-semibold py-2 px-5 rounded-lg hover:opacity-90 transition-all">
                Browse Categories
             </button>
        </div>
      )}
    </div>
  );
};