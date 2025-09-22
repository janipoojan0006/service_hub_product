import React from 'react';
import { CalendarIcon } from './IconComponents';

interface RescheduleConfirmationProps {
  onDone: () => void;
}

export const RescheduleConfirmation: React.FC<RescheduleConfirmationProps> = ({ onDone }) => {
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
        <div className="flex justify-center mb-6">
            <div className="relative">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                    <CalendarIcon className="w-12 h-12 text-blue-600"/>
                </div>
                 <div className="absolute -top-1 -right-1 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-4 border-slate-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            </div>
        </div>
      <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Reschedule Request Sent!</h2>
      <p className="text-lg text-slate-600 mb-8">
        Your request for a new appointment time has been sent to the provider. 
        They will need to confirm the new time. You can track the status in your bookings dashboard.
      </p>
      
      <button
        onClick={onDone}
        className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Back to My Bookings
      </button>
    </div>
  );
};
