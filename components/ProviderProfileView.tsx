import React from 'react';
import { Provider, Service, Review } from '../types';
import { StarIcon, UserIcon } from './IconComponents';

interface ProviderProfileViewProps {
    provider: Provider;
    service: Service; // The service the user clicked to get here
    reviews: Review[];
    allServices: Service[]; // All available services in the app
    onBack: () => void;
    onSchedule: () => void;
}

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
    <div className="bg-white p-4 rounded-lg border border-slate-200/80">
        <div className="flex items-center mb-2">
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className={`w-5 h-5 ${i < review.rating ? 'text-amber-400' : 'text-slate-300'}`} />
                ))}
            </div>
            <p className="ml-auto text-sm text-slate-500">{review.date.toLocaleDateString()}</p>
        </div>
        <p className="text-slate-600 mb-2">"{review.comment}"</p>
        <p className="text-sm font-semibold text-slate-700">- {review.customerName} for <span className="italic">{review.serviceName}</span></p>
    </div>
);

export const ProviderProfileView: React.FC<ProviderProfileViewProps> = ({ provider, service, reviews, allServices, onBack, onSchedule }) => {
    
    const offeredServiceNames = provider.services
        .map(serviceId => allServices.find(s => s.id === serviceId)?.name)
        .filter((name): name is string => !!name);
        
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 relative">
                <button onClick={onBack} className="absolute left-0 top-2 text-primary hover:text-primary-dark font-semibold flex items-center transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back to Results
                </button>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-xl border border-slate-200/80 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Provider Info */}
                <div className="md:col-span-1 text-center md:text-left">
                    <div className="inline-block bg-slate-100 rounded-full p-4 mb-4">
                        <UserIcon className="w-16 h-16 text-slate-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800">{provider.name}</h2>
                    <div className="flex items-center text-slate-500 mt-2 justify-center md:justify-start">
                        {reviews.length > 0 ? (
                            <>
                                <StarIcon className="w-5 h-5 text-amber-400 mr-1"/>
                                <span className="font-semibold text-slate-600 text-lg">
                                    {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                                </span>
                                <span className="ml-1">
                                    ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                                </span>
                            </>
                        ) : (
                            <span className="text-slate-500">No reviews yet</span>
                        )}
                    </div>
                    <p className="text-slate-600 my-4">{provider.bio}</p>

                    <div className="my-6">
                        <h4 className="font-bold text-slate-700 mb-2 text-center md:text-left">Services Offered</h4>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            {offeredServiceNames.map(name => (
                                <span key={name} className="bg-primary/10 text-primary-dark text-sm font-semibold px-2.5 py-1 rounded-full">
                                    {name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={onSchedule}
                        className="w-full bg-gradient-to-r from-primary to-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-300 shadow-md"
                    >
                        Schedule "{service.name}"
                    </button>
                </div>

                {/* Right Column: Reviews */}
                <div className="md:col-span-2">
                    <h3 className="text-2xl font-bold text-slate-700 mb-4 border-b pb-2">Customer Reviews</h3>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 bg-slate-50/50 p-4 rounded-lg">
                        {reviews.length > 0 ? (
                            reviews.map(review => <ReviewCard key={review.id} review={review} />)
                        ) : (
                            <p className="text-slate-500">This provider doesn't have any reviews yet. Be the first!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};