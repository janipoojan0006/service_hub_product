import React, { useState } from 'react';
import { LogoIcon, UserIcon } from './IconComponents';
import { User, UserRole } from '../types';

interface HeaderProps {
    user: User | null;
    onLoginClick: () => void;
    onLogout: () => void;
    onProviderDashboardClick: () => void;
    onCustomerDashboardClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLoginClick, onLogout, onProviderDashboardClick, onCustomerDashboardClick }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    
  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/80 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
            <LogoIcon className="h-10 w-10 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 ml-3">
            ServiceHub
            </h1>
        </div>

        <div>
            {user ? (
                <div className="relative">
                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
                        <UserIcon className="h-8 w-8 text-slate-600 bg-slate-100 rounded-full p-1" />
                        <span className="font-semibold text-slate-700 hidden sm:inline">{user.name}</span>
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-slate-200">
                             {user.role === UserRole.PROVIDER && (
                                <button
                                    onClick={() => {
                                        onProviderDashboardClick();
                                        setDropdownOpen(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                >
                                    Provider Dashboard
                                </button>
                            )}
                             {user.role === UserRole.CUSTOMER && (
                                <button
                                    onClick={() => {
                                        onCustomerDashboardClick();
                                        setDropdownOpen(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                >
                                    My Bookings
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    onLogout();
                                    setDropdownOpen(false);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <button 
                    onClick={onLoginClick}
                    className="bg-gradient-to-r from-primary to-blue-500 text-white font-semibold py-2 px-5 rounded-lg hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                    Login / Sign Up
                </button>
            )}
        </div>
      </div>
    </header>
  );
};