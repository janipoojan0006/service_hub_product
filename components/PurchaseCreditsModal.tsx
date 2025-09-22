import React from 'react';
import { WalletIcon } from './IconComponents';

interface PurchaseCreditsModalProps {
    onClose: () => void;
    onPurchase: (amount: number) => void;
}

export const PurchaseCreditsModal: React.FC<PurchaseCreditsModalProps> = ({ onClose, onPurchase }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full text-center relative transform transition-all">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600" aria-label="Close">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                    <WalletIcon className="h-9 w-9 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Purchase Message Credits</h2>
                <p className="text-slate-500 mb-8">Unlock more customer requests by topping up your credits. Each credit costs 10 cents.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div 
                        onClick={() => onPurchase(20)}
                        className="group bg-slate-50 p-6 rounded-xl border-2 border-slate-200 hover:border-blue-500 transition-all duration-300 cursor-pointer text-center"
                    >
                        <h3 className="text-3xl font-bold text-blue-600">200</h3>
                        <p className="font-semibold text-slate-600 mb-4">Credits</p>
                        <div className="w-full bg-blue-600 text-white font-semibold py-3 px-5 rounded-lg group-hover:bg-blue-700 transition-colors duration-300">
                            Buy for $20
                        </div>
                    </div>
                     <div 
                        onClick={() => onPurchase(50)}
                        className="group bg-slate-50 p-6 rounded-xl border-2 border-slate-200 hover:border-blue-500 transition-all duration-300 cursor-pointer text-center"
                    >
                        <h3 className="text-3xl font-bold text-blue-600">500</h3>
                        <p className="font-semibold text-slate-600 mb-4">Credits</p>
                         <div className="w-full bg-blue-600 text-white font-semibold py-3 px-5 rounded-lg group-hover:bg-blue-700 transition-colors duration-300">
                            Buy for $50
                        </div>
                    </div>
                </div>
                 <p className="text-xs text-slate-400 mt-6">
                    This is a simulated purchase. No real transaction will occur.
                </p>
            </div>
        </div>
    );
};
