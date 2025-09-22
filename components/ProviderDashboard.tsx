import React from 'react';
import { User, BookingRequest, RequestStatus, Provider } from '../types';
import { CalendarIcon } from './IconComponents';

interface ProviderDashboardProps {
    user: User;
    provider?: Provider;
    requests: BookingRequest[];
    onUpdateRequestStatus: (requestId: string, status: RequestStatus) => void;
    onManageServices: () => void;
}

const RequestCard: React.FC<{ request: BookingRequest, onUpdate: (id: string, status: RequestStatus) => void }> = ({ request, onUpdate }) => {
    return (
        <div className="bg-white p-5 rounded-lg shadow-card border border-slate-200/60">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <p className="font-bold text-slate-800 text-lg">{request.serviceName}</p>
                    <p className="text-sm text-slate-500">From: {request.customerName}</p>
                    <p className="text-sm text-slate-500 mt-1">
                        Requested for: {request.dateTime.toLocaleDateString()} at {request.dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
                <div className="flex space-x-2 mt-4 sm:mt-0">
                    <button 
                        onClick={() => onUpdate(request.id, RequestStatus.DECLINED)}
                        className="bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors"
                    >
                        Decline
                    </button>
                    <button 
                        onClick={() => onUpdate(request.id, RequestStatus.CONFIRMED)}
                        className="bg-secondary text-white font-semibold py-2 px-4 rounded-lg hover:bg-secondary-dark transition-colors"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    )
}

const AppointmentCard: React.FC<{ request: BookingRequest }> = ({ request }) => {
     return (
        <div className="bg-white p-4 rounded-lg border border-slate-200/60 flex items-center space-x-4 shadow-card">
            <div className="flex-shrink-0 bg-primary/10 p-3 rounded-lg">
                <CalendarIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
                 <p className="font-semibold text-slate-800">{request.serviceName} with {request.customerName}</p>
                 <p className="text-sm text-slate-500">
                    {request.dateTime.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                    {' at '}
                    {request.dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </p>
            </div>
        </div>
    )
}

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({ user, provider, requests, onUpdateRequestStatus, onManageServices }) => {
    const pendingRequests = requests.filter(r => r.status === RequestStatus.PENDING).sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
    const confirmedAppointments = requests.filter(r => r.status === RequestStatus.CONFIRMED).sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white/60 backdrop-blur-lg border border-slate-200/60 shadow-sm rounded-lg p-6 mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Provider Dashboard</h1>
                        <p className="text-slate-500 mt-1">Welcome back, {user.name}!</p>
                    </div>
                     <button
                        onClick={onManageServices}
                        className="bg-gradient-to-r from-primary to-blue-500 text-white font-semibold py-2 px-5 rounded-lg hover:opacity-90 transition-all duration-300 shadow-md"
                    >
                        Manage My Services
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pending Requests Column */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-700 mb-4">Pending Requests ({pendingRequests.length})</h2>
                    <div className="space-y-4">
                        {pendingRequests.length > 0 ? (
                            pendingRequests.map(request => (
                                <RequestCard key={request.id} request={request} onUpdate={onUpdateRequestStatus} />
                            ))
                        ) : (
                            <p className="text-slate-500 bg-white p-5 rounded-lg border">You have no new requests.</p>
                        )}
                    </div>
                </div>

                 {/* Confirmed Appointments Column */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-700 mb-4">Your Confirmed Schedule</h2>
                     <div className="space-y-4">
                        {confirmedAppointments.length > 0 ? (
                            confirmedAppointments.map(request => (
                                <AppointmentCard key={request.id} request={request} />
                            ))
                        ) : (
                            <p className="text-slate-500 bg-white p-5 rounded-lg border">Your schedule is clear.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};