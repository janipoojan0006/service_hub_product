import React, { useState, useCallback } from 'react';
import { Provider, ServiceCategory, Service } from '../types';
import { generateServiceSuggestions } from '../services/geminiService';

interface ProviderServiceManagerProps {
    provider: Provider;
    categories: ServiceCategory[];
    onSave: (providerId: string, updatedServiceIds: string[], newCustomServices: { categoryId: string; serviceName: string }[]) => void;
    onBack: () => void;
}

const AISuggestionChip: React.FC<{ suggestion: string; onClick: () => void; }> = ({ suggestion, onClick }) => (
    <button
        onClick={onClick}
        className="bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1.5 rounded-full hover:bg-purple-200 transition-colors flex items-center"
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        {suggestion}
    </button>
);

export const ProviderServiceManager: React.FC<ProviderServiceManagerProps> = ({ provider, categories, onSave, onBack }) => {
    const [selectedServiceIds, setSelectedServiceIds] = useState<Set<string>>(() => new Set(provider.services));
    const [customServiceInputs, setCustomServiceInputs] = useState<{ [categoryId: string]: string }>({});
    const [suggestions, setSuggestions] = useState<{ [categoryId: string]: string[] }>({});
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<{ [categoryId: string]: boolean }>({});

    const handleCheckboxChange = (serviceId: string) => {
        setSelectedServiceIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(serviceId)) {
                newSet.delete(serviceId);
            } else {
                newSet.add(serviceId);
            }
            return newSet;
        });
    };

    const handleCustomInputChange = (categoryId: string, value: string) => {
        setCustomServiceInputs(prev => ({ ...prev, [categoryId]: value }));
    };

    const handleSave = () => {
        const newCustomServices = Object.entries(customServiceInputs)
            .map(([categoryId, serviceName]) => ({ categoryId, serviceName: serviceName.trim() }))
            .filter(item => item.serviceName !== '');
        
        onSave(provider.id, Array.from(selectedServiceIds), newCustomServices);
    };

    const fetchSuggestions = useCallback(async (category: ServiceCategory) => {
        setIsLoadingSuggestions(prev => ({...prev, [category.id]: true}));
        const existingServiceNames = category.services.map(s => s.name);
        const newSuggestions = await generateServiceSuggestions(category.name, existingServiceNames);
        setSuggestions(prev => ({ ...prev, [category.id]: newSuggestions }));
        setIsLoadingSuggestions(prev => ({...prev, [category.id]: false}));
    }, []);

    const addSuggestionAsCustom = (categoryId: string, suggestion: string) => {
        const currentInput = customServiceInputs[categoryId] || '';
        // Add suggestion if it's not already in the input
        if (!currentInput.toLowerCase().includes(suggestion.toLowerCase())) {
            const newInput = currentInput ? `${currentInput}, ${suggestion}` : suggestion;
            setCustomServiceInputs(prev => ({ ...prev, [categoryId]: newInput }));
        }
        // Remove the suggestion from the list
        setSuggestions(prev => ({
            ...prev,
            [categoryId]: prev[categoryId].filter(s => s !== suggestion)
        }));
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center relative">
                <button onClick={onBack} className="absolute left-0 top-1/2 -translate-y-1/2 text-primary hover:text-primary-dark font-semibold flex items-center transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back to Dashboard
                </button>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Manage Your Services</h2>
                <p className="text-lg text-slate-600 mt-2">Select the services you offer to appear in customer searches.</p>
            </div>

            <div className="space-y-8">
                {categories.map(category => (
                    <div key={category.id} className="bg-white p-6 rounded-lg shadow-card border border-slate-200/80">
                        <h3 className="text-2xl font-semibold text-slate-700 mb-4">{category.name}</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {category.services.map(service => (
                                <label key={service.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors">
                                    <input 
                                        type="checkbox"
                                        checked={selectedServiceIds.has(service.id)}
                                        onChange={() => handleCheckboxChange(service.id)}
                                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-slate-800 font-medium">{service.name}</span>
                                </label>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-200">
                             <h4 className="font-semibold text-slate-600 mb-2">Add a custom service for this category:</h4>
                            <p className="text-sm text-slate-500 mb-3">If you offer a service not listed above, add it here. You can add multiple by separating them with a comma.</p>
                            <input
                                type="text"
                                value={customServiceInputs[category.id] || ''}
                                onChange={(e) => handleCustomInputChange(category.id, e.target.value)}
                                placeholder="e.g., Custom Hedge Art, Organic Fertilization"
                                className="w-full px-4 py-2 text-slate-700 bg-white border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            />

                             <div className="mt-4">
                                {isLoadingSuggestions[category.id] ? (
                                    <p className="text-sm text-slate-500">Loading suggestions...</p>
                                ) : (
                                    <>
                                        {(!suggestions[category.id] || suggestions[category.id]?.length === 0) && (
                                            <button onClick={() => fetchSuggestions(category)} className="text-sm font-semibold text-primary hover:text-primary-dark">
                                                Get AI Suggestions
                                            </button>
                                        )}
                                        {suggestions[category.id] && suggestions[category.id].length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                <span className="text-sm font-semibold text-slate-600 mr-2 mt-1.5">Suggestions:</span>
                                                {suggestions[category.id].map(s => (
                                                    <AISuggestionChip key={s} suggestion={s} onClick={() => addSuggestionAsCustom(category.id, s)} />
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-end items-center space-x-4">
                <button onClick={onBack} className="font-semibold text-slate-600 py-3 px-6 rounded-lg hover:bg-slate-100 transition-colors">
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-primary to-blue-500 text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};