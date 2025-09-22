import React from 'react';
import { Service, Provider, Review } from '../types';
import { UserIcon, StarIcon } from './IconComponents';

interface ProviderListViewProps {
    service: Service;
    providers: Provider[];
    reviews: Review[];
    onProviderSelect: (provider: Provider) => void;
    onBack: () => void;
}

const ProviderCard: React.FC<{ provider: Provider; reviews: Review[]; onSelect: () => void }> = ({ provider, reviews, onSelect }) => {
    const providerReviews = reviews.filter(r => r.providerId === provider.id);
    
    return (
    <div className="bg-white p-6 rounded-lg shadow-card border border-slate-200/50 flex flex-col transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 cursor-pointer" onClick={onSelect}>
        <div className="flex items-start mb-4">
            <div className="bg-slate-100 rounded-full p-2 mr-4">
                <UserIcon className="w-8 h-8 text-slate-500"/>
            </div>
            <div>
                 <h3 className="text-xl font-bold text-slate-800">{provider.name}</h3>
                 <div className="flex items-center text-sm text-slate-500 mt-1">
                    {providerReviews.length > 0 ? (
                        <>
                            <StarIcon className="w-4 h-4 text-amber-400 mr-1"/>
                            <span className="font-semibold text-slate-600">
                                {(providerReviews.reduce((acc, r) => acc + r.rating, 0) / providerReviews.length).toFixed(1)}
                            </span>
                            <span className="ml-1">
                                ({providerReviews.length} {providerReviews.length === 1 ? 'review' : 'reviews'})
                            </span>
                        </>
                    ) : (
                        <span className="text-slate-500">No reviews yet</span>
                    )}
                    <span className="mx-2">·</span>
                    <span>{provider.distance} miles away</span>
                 </div>
            </div>
        </div>
        <p className="text-slate-600 mb-6 flex-grow">{provider.bio}</p>
        <button
            onClick={(e) => { e.stopPropagation(); onSelect(); }} // Prevent card click from firing twice
            className="w-full bg-gradient-to-r from-primary to-blue-500 text-white font-semibold py-2 px-5 rounded-lg hover:opacity-90 transition-all duration-300 shadow-sm"
        >
            View Profile & Schedule
        </button>
    </div>
)};


export const ProviderListView: React.FC<ProviderListViewProps> = ({ service, providers, reviews, onProviderSelect, onBack }) => {
    // Filter providers that offer the selected service
    const availableProviders = providers.filter(p => p.services.includes(service.id));

    return (
        <div>
            <div className="mb-10 text-center relative">
                 <button onClick={onBack} className="absolute left-0 top-1/2 -translate-y-1/2 text-primary hover:text-primary-dark font-semibold flex items-center transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back
                </button>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Choose a Provider</h2>
                <p className="text-lg text-slate-600 mt-2">Top-rated professionals for your <span className="font-semibold text-primary">{service.name}</span> job.</p>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {availableProviders.length > 0 ? (
                    availableProviders.map(provider => (
                        <ProviderCard 
                            key={provider.id} 
                            provider={provider} 
                            reviews={reviews}
                            onSelect={() => onProviderSelect(provider)} 
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center bg-white p-8 rounded-lg shadow-card">
                        <h3 className="text-xl font-semibold text-slate-700">No Providers Found</h3>
                        <p className="text-slate-500 mt-2">We couldn't find any providers for this service in your area right now.</p>
                    </div>
                )}
             </div>
        </div>
    );
};