import React, { useState } from 'react';
import { BookingRequest } from '../types';
import { StarIcon } from './IconComponents';

interface ReviewModalProps {
    booking: BookingRequest;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ booking, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating > 0) {
            onSubmit(rating, comment);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 modal-backdrop flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative transform transition-all">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600" aria-label="Close">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                
                <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Leave a Review</h2>
                <p className="text-slate-500 mb-6 text-center">How was your <span className="font-semibold">{booking.serviceName}</span> service?</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-slate-700 text-sm font-bold mb-2 text-center">Your Rating</label>
                        <div className="flex justify-center items-center space-x-1">
                             {[...Array(5)].map((_, index) => {
                                const starValue = index + 1;
                                return (
                                    <button
                                        type="button"
                                        key={starValue}
                                        onClick={() => setRating(starValue)}
                                        onMouseEnter={() => setHoverRating(starValue)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="focus:outline-none"
                                        aria-label={`Rate ${starValue} star`}
                                    >
                                        <StarIcon className={`w-10 h-10 transition-colors ${(hoverRating || rating) >= starValue ? 'text-amber-400' : 'text-slate-300'}`} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <label htmlFor="comment" className="block text-slate-700 text-sm font-bold mb-2">Comments (Optional)</label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 text-slate-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Tell us more about your experience..."
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={rating === 0}
                        className="w-full bg-gradient-to-r from-primary to-blue-500 text-white font-semibold py-3 px-5 rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        Submit Review
                    </button>
                </form>
            </div>
        </div>
    );
};