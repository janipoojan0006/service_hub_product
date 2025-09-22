import React, { useState, useMemo } from 'react';
import { Service, Provider, BookingRequest, Availability } from '../types';

interface SchedulingViewProps {
    service: Service;
    provider: Provider;
    existingBookings: BookingRequest[];
    onDateTimeSelect: (dateTime: Date) => void;
    onBack: () => void;
    pageTitle?: string;
    ctaButtonText?: string;
}

// Helper function to generate time slots for a given day's availability
const generateTimeSlots = (availability: Availability | undefined, selectedDate: Date, existingBookings: BookingRequest[]): Date[] => {
    if (!availability) return [];

    const slots: Date[] = [];
    const { startTime, endTime } = availability;

    for (let hour = startTime; hour < endTime; hour++) {
        const slotTime = new Date(selectedDate);
        slotTime.setHours(hour, 0, 0, 0);

        // Check if the slot is already booked
        const isBooked = existingBookings.some(booking => 
            booking.dateTime.getFullYear() === slotTime.getFullYear() &&
            booking.dateTime.getMonth() === slotTime.getMonth() &&
            booking.dateTime.getDate() === slotTime.getDate() &&
            booking.dateTime.getHours() === slotTime.getHours()
        );

        if (!isBooked && slotTime > new Date()) { // Only add future slots
             slots.push(slotTime);
        }
    }
    return slots;
};

export const SchedulingView: React.FC<SchedulingViewProps> = ({ 
    service, 
    provider, 
    existingBookings, 
    onDateTimeSelect, 
    onBack,
    pageTitle = "Schedule Appointment",
    ctaButtonText = "Continue to Payment"
}) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedTime, setSelectedTime] = useState<Date | null>(null);

    const availableDates = useMemo(() => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date);
        }
        return dates;
    }, []);

    const dayOfWeek = selectedDate.toLocaleString('en-US', { weekday: 'long' }).toLowerCase() as Availability['day'];
    const providerAvailabilityForDay = provider.availability.find(a => a.day === dayOfWeek);

    const timeSlots = useMemo(() => 
        generateTimeSlots(providerAvailabilityForDay, selectedDate, existingBookings),
    [providerAvailabilityForDay, selectedDate, existingBookings]);


    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setSelectedTime(null); // Reset time when date changes
    };

    const handleConfirm = () => {
        if (selectedTime) {
            onDateTimeSelect(selectedTime);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-10 text-center relative">
                 <button onClick={onBack} className="absolute left-0 top-1/2 -translate-y-1/2 text-primary hover:text-primary-dark font-semibold flex items-center transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back
                </button>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800">{pageTitle}</h2>
                <p className="text-lg text-slate-600 mt-2">Select a date and time for your <span className="font-semibold text-primary">{service.name}</span> with {provider.name}.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-xl border border-slate-200/80">
                {/* Date Selector */}
                <div>
                    <h3 className="text-xl font-bold text-slate-700 mb-4">Choose a Date</h3>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                        {availableDates.map(date => (
                            <button 
                                key={date.toISOString()}
                                onClick={() => handleDateSelect(date)}
                                className={`p-3 rounded-lg text-center transition-colors ${
                                    selectedDate.toDateString() === date.toDateString() 
                                    ? 'bg-primary text-white font-bold shadow-md' 
                                    : 'bg-slate-100 hover:bg-primary/10'
                                }`}
                            >
                                <p className="text-sm">{date.toLocaleString('en-US', { weekday: 'short' })}</p>
                                <p className="font-bold text-lg">{date.getDate()}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time Slot Selector */}
                <div className="mt-8">
                     <h3 className="text-xl font-bold text-slate-700 mb-4">Choose a Time for {selectedDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric'})}</h3>
                     <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                        {timeSlots.length > 0 ? timeSlots.map(time => (
                             <button 
                                key={time.toISOString()}
                                onClick={() => setSelectedTime(time)}
                                className={`p-3 rounded-lg font-semibold transition-colors ${
                                    selectedTime?.getTime() === time.getTime()
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-white border-2 border-primary text-primary hover:bg-primary/10'
                                }`}
                            >
                                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </button>
                        )) : (
                            <p className="col-span-full text-slate-500">No available slots for this day. Please select another date.</p>
                        )}
                     </div>
                </div>

                <div className="mt-8 pt-6 border-t">
                    <button 
                        onClick={handleConfirm}
                        disabled={!selectedTime}
                        className="w-full bg-gradient-to-r from-primary to-blue-500 text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {ctaButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};