import React, { useState } from 'react';
import { Service, Provider } from '../types';
import { CreditCardIcon, PayPalIcon } from './IconComponents';

interface PaymentViewProps {
    service: Service;
    provider: Provider;
    dateTime: Date;
    onConfirmPayment: () => void;
    onBack: () => void;
}

type PaymentMethod = 'credit-card' | 'paypal';

export const PaymentView: React.FC<PaymentViewProps> = ({ service, provider, dateTime, onConfirmPayment, onBack }) => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('credit-card');
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate network request
        setTimeout(() => {
            onConfirmPayment();
        }, 1500);
    }
    
    const formattedDate = dateTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    const formattedTime = dateTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="max-w-2xl mx-auto">
             <div className="mb-10 text-center relative">
                 <button onClick={onBack} className="absolute left-0 top-1/2 -translate-y-1/2 text-primary hover:text-primary-dark font-semibold flex items-center transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back
                </button>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Confirm and Pay</h2>
                <p className="text-lg text-slate-600 mt-2">You're almost there! Just one more step.</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-xl border border-slate-200/80">
                <h3 className="font-bold text-xl text-slate-700 mb-4 border-b pb-4">Order Summary</h3>
                <div className="space-y-3 mb-6">
                     <div className="flex justify-between items-center">
                        <span className="text-slate-500">Service:</span>
                        <span className="font-semibold text-slate-800">{service.name}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-slate-500">Provider:</span>
                        <span className="font-semibold text-slate-800">{provider.name}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-slate-500">When:</span>
                        <span className="font-semibold text-slate-800">{formattedDate} at {formattedTime}</span>
                    </div>
                     <div className="flex justify-between items-center text-xl font-bold pt-3 border-t mt-3">
                        <span className="text-slate-800">Total:</span>
                        <span className="text-primary">${service.basePrice}</span>
                    </div>
                </div>

                <h3 className="font-bold text-xl text-slate-700 mb-4 border-b pb-4">Payment Method</h3>
                <div className="space-y-4">
                    <div 
                        onClick={() => setSelectedPaymentMethod('credit-card')} 
                        className={`p-4 border-2 rounded-lg flex items-center cursor-pointer transition-all ${selectedPaymentMethod === 'credit-card' ? 'border-primary bg-primary/10' : 'border-slate-200'}`}
                    >
                        <CreditCardIcon className="w-8 h-8 text-slate-500 mr-4"/>
                        <span className="font-semibold text-slate-700">Credit Card</span>
                        <div className={`ml-auto w-5 h-5 rounded-full border-2 ${selectedPaymentMethod === 'credit-card' ? 'border-primary bg-primary' : 'border-slate-300'}`}></div>
                    </div>
                     <div 
                        onClick={() => setSelectedPaymentMethod('paypal')} 
                        className={`p-4 border-2 rounded-lg flex items-center cursor-pointer transition-all ${selectedPaymentMethod === 'paypal' ? 'border-primary bg-primary/10' : 'border-slate-200'}`}
                    >
                        <PayPalIcon className="w-8 h-8 text-blue-800 mr-4"/>
                        <span className="font-semibold text-slate-700">PayPal</span>
                        <div className={`ml-auto w-5 h-5 rounded-full border-2 ${selectedPaymentMethod === 'paypal' ? 'border-primary bg-primary' : 'border-slate-300'}`}></div>
                    </div>
                </div>

                <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="mt-8 w-full bg-gradient-to-r from-primary to-blue-500 text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isProcessing ? (
                        <>
                           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : `Confirm & Pay $${service.basePrice}` }
                </button>
                 <p className="text-xs text-slate-400 mt-4 text-center">
                    This is a simulated payment. No real charges will be made.
                </p>
            </div>
        </div>
    );
};