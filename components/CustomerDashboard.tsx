import React, { useState } from 'react';
import { User, BookingRequest, Review, RequestStatus } from '../types';
import { ReviewModal } from './ReviewModal';
import { StarIcon } from './IconComponents';

interface CustomerDashboardProps {
    user: User;
    bookings: BookingRequest[];
    reviews: Review[];
    onAddReview: (booking: BookingRequest, rating: number, comment: string) => void;
    onNewBooking: () => void;
    onInitiateReschedule: (booking: BookingRequest) => void;
}

const BookingCard: React.FC<{ 
    booking: BookingRequest, 
    onReviewClick: (booking: BookingRequest) => void,
    onRescheduleClick: (booking: BookingRequest) => void,
    review?: Review 
}> = ({ booking, onReviewClick, onRescheduleClick, review }) => {
    
    return (
        <div className="bg-white p-5 rounded-lg shadow-card border border-slate-200/60">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <p className="font-bold text-slate-800 text-lg">{booking.serviceName}</p>
                    <p className="text-sm text-slate-500">
                        {booking.dateTime.toLocaleDateString()} at {booking.dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
                <div className="flex-shrink-0 mt-4 sm:mt-0 flex items-center space-x-3">
                    {booking.status === RequestStatus.CONFIRMED && (
                        <button 
                            onClick={() => onRescheduleClick(booking)}
                            className="bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors text-sm"
                        >
                            Reschedule
                        </button>
                    )}
                    {booking.status === RequestStatus.COMPLETED && (
                        <>
                            {booking.reviewSubmitted && review ? (
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon key={i} className={`w-5 h-5 ${i < review.rating ? 'text-amber-400' : 'text-slate-300'}`} />
                                    ))}
                                    <span className="ml-2 text-sm font-semibold text-slate-600">Your Review</span>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => onReviewClick(booking)}
                                    className="bg-gradient-to-r from-primary to-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-all"
                                >
                                    Leave a Review
                                </button>
                            )}
                        </>
                    )}
                </div>
             </div>
        </div>
    )
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ user, bookings, reviews, onAddReview, onNewBooking, onInitiateReschedule }) => {
    const [isReviewModalOpen, setReviewModalOpen] = useState(false);
    const [bookingToReview, setBookingToReview] = useState<BookingRequest | null>(null);

    const pendingBookings = bookings.filter(b => b.status === RequestStatus.PENDING).sort((a,b) => a.dateTime.getTime() - b.dateTime.getTime());
    const upcomingBookings = bookings.filter(b => b.status === RequestStatus.CONFIRMED).sort((a,b) => a.dateTime.getTime() - b.dateTime.getTime());
    const pastBookings = bookings.filter(b => b.status === RequestStatus.COMPLETED).sort((a,b) => b.dateTime.getTime() - a.dateTime.getTime());

    const handleOpenReviewModal = (booking: BookingRequest) => {
        setBookingToReview(booking);
        setReviewModalOpen(true);
    };

    const handleCloseReviewModal = () => {
        setBookingToReview(null);
        setReviewModalOpen(false);
    };

    const handleSubmitReview = (rating: number, comment: string) => {
        if (bookingToReview) {
            onAddReview(bookingToReview, rating, comment);
        }
        handleCloseReviewModal();
    };
    
    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white/60 backdrop-blur-lg border border-slate-200/60 shadow-sm rounded-lg p-6 mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">My Bookings</h1>
                    <p className="text-slate-500 mt-1">Manage your appointments for {user.name}.</p>
                </div>
                <button 
                    onClick={onNewBooking}
                    className="bg-gradient-to-r from-primary to-blue-500 text-white font-semibold py-2 px-5 rounded-lg hover:opacity-90 transition-all duration-300 shadow-md"
                >
                    Book New Service
                </button>
            </div>

            <div className="space-y-8">
                {/* Upcoming Confirmed */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-700 mb-4">Upcoming Confirmed ({upcomingBookings.length})</h2>
                    <div className="space-y-4">
                        {upcomingBookings.length > 0 ? (
                            upcomingBookings.map(booking => <BookingCard key={booking.id} booking={booking} onReviewClick={handleOpenReviewModal} onRescheduleClick={onInitiateReschedule} />)
                        ) : <p className="text-slate-500 bg-white p-5 rounded-lg border">You have no upcoming appointments.</p>}
                    </div>
                </div>

                 {/* Pending Requests */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-700 mb-4">Pending Requests ({pendingBookings.length})</h2>
                    <div className="space-y-4">
                         {pendingBookings.length > 0 ? (
                            pendingBookings.map(booking => <BookingCard key={booking.id} booking={booking} onReviewClick={handleOpenReviewModal} onRescheduleClick={onInitiateReschedule} />)
                        ) : <p className="text-slate-500 bg-white p-5 rounded-lg border">You have no pending requests.</p>}
                    </div>
                </div>
                
                 {/* Past Bookings */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-700 mb-4">Past Bookings ({pastBookings.length})</h2>
                    <div className="space-y-4">
                         {pastBookings.length > 0 ? (
                            pastBookings.map(booking => {
                                const reviewForBooking = reviews.find(r => r.providerId === booking.providerId && r.serviceName === booking.serviceName && r.customerId === booking.customerId);
                                return <BookingCard key={booking.id} booking={booking} onReviewClick={handleOpenReviewModal} review={reviewForBooking} onRescheduleClick={onInitiateReschedule} />
                            })
                        ) : <p className="text-slate-500 bg-white p-5 rounded-lg border">You have no past bookings.</p>}
                    </div>
                </div>
            </div>

            {isReviewModalOpen && bookingToReview && (
                <ReviewModal
                    booking={bookingToReview}
                    onClose={handleCloseReviewModal}
                    onSubmit={handleSubmitReview}
                />
            )}
        </div>
    );
};