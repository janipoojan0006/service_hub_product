import React from 'react';

export interface Service {
  id: string;
  name: string;
  basePrice: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  services: Service[];
}

export enum UserRole {
  CUSTOMER = 'customer',
  PROVIDER = 'provider',
}

export interface User {
  id:string;
  name: string;
  email: string;
  role: UserRole;
  credits?: number; // Maintained for potential future use, but deprecated from current flow
}

export interface Availability {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: number; // Hour in 24h format (e.g., 9 for 9am)
  endTime: number;   // Hour in 24h format (e.g., 17 for 5pm)
}

export interface Provider {
  id: string;
  name: string;
  rating: number; // This will become a calculated field based on reviews
  distance: number; // in miles
  bio: string;
  services: string[]; // array of service ids
  availability: Availability[];
}

export enum RequestStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  DECLINED = 'declined',
  COMPLETED = 'completed',
}

export interface BookingRequest {
  id: string;
  customerId: string;
  customerName: string;
  providerId: string;
  serviceId: string;
  serviceName: string;
  status: RequestStatus;
  dateTime: Date;
  reviewSubmitted: boolean;
}

export interface Review {
  id: string;
  providerId: string;
  customerId: string;
  customerName: string;
  rating: number; // 1-5
  comment: string;
  date: Date;
  serviceName: string;
}


export enum AppState {
  BROWSING_CATEGORIES,
  VIEWING_SERVICES,
  VIEWING_PROVIDERS,
  VIEWING_PROVIDER_PROFILE,
  SCHEDULING,
  PROCESSING_PAYMENT,
  REQUEST_SENT,
  PROVIDER_DASHBOARD,
  PROVIDER_MANAGING_SERVICES,
  CUSTOMER_DASHBOARD,
  RESCHEDULING,
  RESCHEDULE_REQUEST_SENT,
  VIEWING_SEARCH_RESULTS,
}