import React, { useState } from 'react';
import { UserRole } from '../types';
import { LogoIcon } from './IconComponents';

interface AuthModalProps {
    onClose: () => void;
    onLogin: (role: UserRole) => void;
    onSignUp: (name: string, email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin, onSignUp }) => {
    const [view, setView] = useState<'signup' | 'login'>('signup');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Simulated

    const handleSignUpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && email.trim()) {
            onSignUp(name.trim(), email.trim());
        }
    };
    
    const renderSignUpView = () => (
        <form onSubmit={handleSignUpSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 text-left">Full Name</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:text-sm"
                    placeholder="e.g., Alex Smith"
                />
            </div>
            <div>
                <label htmlFor="email-signup" className="block text-sm font-medium text-slate-700 text-left">Email Address</label>
                <input
                    id="email-signup"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:text-sm"
                    placeholder="you@example.com"
                />
            </div>
             <div>
                <label htmlFor="password-signup" className="block text-sm font-medium text-slate-700 text-left">Password</label>
                <input
                    id="password-signup"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:text-sm"
                    placeholder="••••••••"
                />
            </div>
            <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-blue-500 text-white font-semibold py-3 px-5 rounded-lg hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg"
            >
                Create Account & Continue
            </button>
        </form>
    );

    const renderLoginView = () => (
        <div className="space-y-4">
            <div className='p-4 border rounded-lg text-left'>
                <h3 className='font-bold text-lg text-slate-800'>I'm a Customer</h3>
                <p className='text-slate-500 mb-4 text-sm'>Quickly log in with our demo account.</p>
                <button
                    onClick={() => onLogin(UserRole.CUSTOMER)}
                    className="w-full bg-gradient-to-r from-primary to-blue-500 text-white font-semibold py-3 px-5 rounded-lg hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                    Login as Demo Customer
                </button>
            </div>
            <div className='p-4 border rounded-lg text-left'>
                <h3 className='font-bold text-lg text-slate-800'>I'm a Service Provider</h3>
                <p className='text-slate-500 mb-4 text-sm'>Access your provider dashboard.</p>
                <button
                    onClick={() => onLogin(UserRole.PROVIDER)}
                    className="w-full bg-slate-700 text-white font-semibold py-3 px-5 rounded-lg hover:bg-slate-800 transition-colors duration-300"
                >
                    Login as Provider
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 modal-backdrop flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 max-w-md w-full text-center relative transform transition-all" >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600" aria-label="Close">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
                    <LogoIcon className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    {view === 'signup' ? 'Create an Account' : 'Welcome Back'}
                </h2>
                <p className="text-slate-500 mb-8">
                    {view === 'signup' ? 'You must have an account to book a service.' : 'Please log in to continue.'}
                </p>

                {view === 'signup' ? renderSignUpView() : renderLoginView()}

                <div className="mt-6">
                    <button
                        type="button"
                        onClick={() => setView(view === 'signup' ? 'login' : 'signup')}
                        className="text-sm font-medium text-primary hover:text-primary-dark"
                    >
                        {view === 'signup' ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
                    </button>
                </div>

                 <p className="text-xs text-slate-400 mt-6">
                    This is a simulation. No real accounts or data are stored.
                </p>
            </div>
        </div>
    );
};