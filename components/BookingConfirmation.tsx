import React from 'react';
import { Service, ServiceCategory, Provider } from '../types';

interface BookingConfirmationProps {
  service: Service;
  category: ServiceCategory;
  provider: Provider;
  dateTime: Date;
  onNewBooking: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ service, category, provider, dateTime, onNewBooking }) => {
  const Icon = category.icon;

  const formattedDate = dateTime.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
  });
  const formattedTime = dateTime.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
  });

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
        <div className="flex justify-center mb-6">
            <div className="relative">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="w-12 h-12 text-primary"/>
                </div>
                 <div className="absolute -top-1 -right-1 w-10 h-10 bg-secondary rounded-full flex items-center justify-center border-4 border-gray-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            </div>
        </div>
      <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Request Sent!</h2>
      <p className="text-lg text-slate-600 mb-8">
        Your request for a {service.name} has been sent to {provider.name}. They will contact you shortly to confirm the details.
      </p>

      <div className="bg-white p-6 rounded-lg shadow-card border border-slate-200/80 text-left mb-10">
        <h3 className="font-bold text-xl text-slate-700 mb-4">Request Summary</h3>
        <div className="flex justify-between items-center py-3 border-b border-slate-200">
          <span className="text-slate-500">Service:</span>
          <span className="font-semibold text-slate-800">{service.name}</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-slate-200">
          <span className="text-slate-500">Provider:</span>
          <span className="font-semibold text-slate-800">{provider.name}</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-slate-200">
            <span className="text-slate-500">Date:</span>
            <span className="font-semibold text-slate-800">{formattedDate}</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-slate-200">
            <span className="text-slate-500">Time:</span>
            <span className="font-semibold text-slate-800">{formattedTime}</span>
        </div>
        <div className="flex justify-between items-center pt-3">
          <span className="text-slate-500">Est. Price:</span>
          <span className="font-bold text-xl text-primary">${service.basePrice}</span>
        </div>
      </div>
      <button
        onClick={onNewBooking}
        className="bg-gradient-to-r from-primary to-blue-500 text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg"
      >
        Book Another Service
      </button>
    </div>
  );
};