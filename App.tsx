import React, { useState, useCallback } from 'react';
import { ServiceCategory, Service, AppState, User, UserRole, Provider as ProviderType, BookingRequest, RequestStatus, Review } from './types';
import { SERVICE_CATEGORIES, MOCK_USERS, MOCK_BOOKING_REQUESTS, MOCK_REVIEWS, PROVIDERS } from './constants';
import { Header } from './components/Header';
import { ServiceCategorySelector } from './components/ServiceCategorySelector';
import { ServiceDetailsView } from './components/ServiceDetailsView';
import { BookingConfirmation } from './components/BookingConfirmation';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { ProviderListView } from './components/ProviderListView';
import { ProviderDashboard } from './components/ProviderDashboard';
import { PaymentView } from './components/PaymentView';
import { SchedulingView } from './components/SchedulingView';
import { CustomerDashboard } from './components/CustomerDashboard';
import { ProviderProfileView } from './components/ProviderProfileView';
import { RescheduleConfirmation } from './components/RescheduleConfirmation';
import { SearchResultsView } from './components/SearchResultsView';
import { matchQueryToServices } from './services/geminiService';
import { ProviderServiceManager } from './components/ProviderServiceManager';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.BROWSING_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<ProviderType | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>(MOCK_BOOKING_REQUESTS);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [bookingToReschedule, setBookingToReschedule] = useState<BookingRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Service[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Convert static data to state to allow for dynamic updates
  const [providers, setProviders] = useState<ProviderType[]>(PROVIDERS);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(SERVICE_CATEGORIES);

  const handleLogin = (role: UserRole) => {
    const user = role === UserRole.CUSTOMER ? MOCK_USERS.customer : MOCK_USERS.provider;
    setCurrentUser(user);
    setAuthModalOpen(false);
    if (user.role === UserRole.PROVIDER) {
      setAppState(AppState.PROVIDER_DASHBOARD);
    }
  };
  
  const handleSignUp = useCallback((name: string, email: string) => {
    const newUser: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        role: UserRole.CUSTOMER, // Sign up form is for customers
    };
    setCurrentUser(newUser);
    setAuthModalOpen(false);
    // The service selection flow will now proceed since currentUser is set
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setAppState(AppState.BROWSING_CATEGORIES);
  }, []);

  const handleSelectCategory = useCallback((category: ServiceCategory) => {
    setSelectedCategory(category);
    setAppState(AppState.VIEWING_SERVICES);
  }, []);

  const handleBackToCategories = useCallback(() => {
    setSelectedCategory(null);
    setSelectedService(null);
    setSearchQuery('');
    setSearchResults([]);
    setAppState(AppState.BROWSING_CATEGORIES);
  }, []);
  
  const handleSelectService = useCallback((service: Service) => {
    if (!currentUser) {
        setAuthModalOpen(true);
        return;
    }
    setSelectedService(service);
    setAppState(AppState.VIEWING_PROVIDERS);
  }, [currentUser]);

  const handleSelectProvider = useCallback((provider: ProviderType) => {
    setSelectedProvider(provider);
    setAppState(AppState.VIEWING_PROVIDER_PROFILE);
  }, []);

  const handleScheduleFromProfile = useCallback(() => {
    setAppState(AppState.SCHEDULING);
  }, []);

  const handleDateTimeSelect = useCallback((dateTime: Date) => {
    setSelectedDateTime(dateTime);
    setAppState(AppState.PROCESSING_PAYMENT);
  }, []);
  
  const handleConfirmPayment = useCallback(() => {
    if (!currentUser || !selectedService || !selectedProvider || !selectedDateTime) return;
    
    const newRequest: BookingRequest = {
        id: `req_${Date.now()}`,
        customerId: currentUser.id,
        customerName: currentUser.name,
        providerId: selectedProvider.id,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        status: RequestStatus.PENDING,
        dateTime: selectedDateTime,
        reviewSubmitted: false,
    };

    setBookingRequests(prev => [...prev, newRequest]);
    setAppState(AppState.REQUEST_SENT);
  }, [currentUser, selectedService, selectedProvider, selectedDateTime]);

  const handleNewBooking = useCallback(() => {
    setSelectedCategory(null);
    setSelectedService(null);
    setSelectedProvider(null);
    setSelectedDateTime(null);
    setAppState(AppState.BROWSING_CATEGORIES);
  }, []);

  const viewProviderDashboard = useCallback(() => {
    if(currentUser?.role === UserRole.PROVIDER) {
      setAppState(AppState.PROVIDER_DASHBOARD);
    }
  }, [currentUser]);

  const viewCustomerDashboard = useCallback(() => {
    if(currentUser?.role === UserRole.CUSTOMER) {
      setAppState(AppState.CUSTOMER_DASHBOARD);
    }
  }, [currentUser]);

  const handleUpdateRequestStatus = useCallback((requestId: string, status: RequestStatus) => {
    setBookingRequests(prevRequests => 
        prevRequests.map(req => 
            req.id === requestId ? { ...req, status } : req
        )
    );
  }, []);

  const handleAddReview = useCallback((booking: BookingRequest, rating: number, comment: string) => {
    if (!currentUser) return;
    const newReview: Review = {
      id: `rev_${Date.now()}`,
      providerId: booking.providerId,
      customerId: currentUser.id,
      customerName: currentUser.name,
      rating,
      comment,
      date: new Date(),
      serviceName: booking.serviceName,
    };
    setReviews(prev => [newReview, ...prev]);
    setBookingRequests(prev => prev.map(req => req.id === booking.id ? {...req, reviewSubmitted: true} : req));
  }, [currentUser]);

  const handleInitiateReschedule = useCallback((booking: BookingRequest) => {
    const provider = providers.find(p => p.id === booking.providerId);
    if (provider) {
      setSelectedProvider(provider);
      const service = serviceCategories.flatMap(c => c.services).find(s => s.id === booking.serviceId);
      if (service) {
        setSelectedService(service);
        setBookingToReschedule(booking);
        setAppState(AppState.RESCHEDULING);
      } else {
        console.error("Service not found for rescheduling");
      }
    } else {
      console.error("Provider not found for rescheduling");
    }
  }, [providers, serviceCategories]);

  const handleConfirmReschedule = useCallback((newDateTime: Date) => {
    if (!bookingToReschedule) return;
    setBookingRequests(prev => prev.map(req => 
        req.id === bookingToReschedule.id 
            ? { ...req, dateTime: newDateTime, status: RequestStatus.PENDING } 
            : req
    ));
    setBookingToReschedule(null);
    setSelectedProvider(null);
    setSelectedService(null);
    setAppState(AppState.RESCHEDULE_REQUEST_SENT);
  }, [bookingToReschedule]);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    setAppState(AppState.VIEWING_SEARCH_RESULTS);
    
    const allServices = serviceCategories.flatMap(c => c.services);
    const matchingIds = await matchQueryToServices(query, allServices);
    
    const matchedServices = allServices.filter(s => matchingIds.includes(s.id));
    setSearchResults(matchedServices);
    setIsSearching(false);
  }, [serviceCategories]);

  const handleManageServices = useCallback(() => {
    if (currentUser?.role === UserRole.PROVIDER) {
      setAppState(AppState.PROVIDER_MANAGING_SERVICES);
    }
  }, [currentUser]);

  const handleUpdateProviderProfile = useCallback((
    providerId: string,
    updatedServiceIds: string[],
    newCustomServices: { categoryId: string; serviceName: string }[]
  ) => {
    let updatedCategories = [...serviceCategories];
    const allAddedServiceIds = [...updatedServiceIds];

    // Create new service objects for custom additions
    newCustomServices.forEach(custom => {
      const categoryIndex = updatedCategories.findIndex(c => c.id === custom.categoryId);
      if (categoryIndex > -1) {
        const newService: Service = {
          id: `custom_${custom.categoryId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: custom.serviceName,
          basePrice: 0, // Default price, could be made editable in a future update
        };
        updatedCategories[categoryIndex].services.push(newService);
        allAddedServiceIds.push(newService.id);
      }
    });

    setServiceCategories(updatedCategories);

    // Update the specific provider's list of offered services
    setProviders(prev =>
      prev.map(p =>
        p.id === providerId ? { ...p, services: allAddedServiceIds } : p
      )
    );

    setAppState(AppState.PROVIDER_DASHBOARD);
  }, [serviceCategories]);


  const renderContent = () => {
    if (appState === AppState.PROVIDER_DASHBOARD && currentUser?.role === UserRole.PROVIDER) {
        const providerRequests = bookingRequests.filter(req => req.providerId === currentUser.id);
        const providerDetails = providers.find(p => p.id === currentUser.id);
        return <ProviderDashboard 
            user={currentUser} 
            provider={providerDetails}
            requests={providerRequests} 
            onUpdateRequestStatus={handleUpdateRequestStatus}
            onManageServices={handleManageServices}
        />;
    }
    
    if (appState === AppState.CUSTOMER_DASHBOARD && currentUser?.role === UserRole.CUSTOMER) {
        const customerBookings = bookingRequests.filter(req => req.customerId === currentUser.id);
        const customerReviews = reviews.filter(rev => rev.customerId === currentUser.id);
        return <CustomerDashboard 
            user={currentUser}
            bookings={customerBookings}
            reviews={customerReviews}
            onAddReview={handleAddReview}
            onNewBooking={handleNewBooking}
            onInitiateReschedule={handleInitiateReschedule}
        />
    }

    switch (appState) {
      case AppState.VIEWING_SERVICES:
        return selectedCategory && (
          <ServiceDetailsView
            category={selectedCategory}
            onServiceSelect={handleSelectService}
            onBack={handleBackToCategories}
            isLoggedIn={!!currentUser}
          />
        );
      case AppState.VIEWING_PROVIDERS:
        return selectedService && (
            <ProviderListView 
                service={selectedService}
                providers={providers}
                reviews={reviews}
                onProviderSelect={handleSelectProvider}
                onBack={() => {
                  if (searchQuery) {
                    setAppState(AppState.VIEWING_SEARCH_RESULTS);
                  } else {
                    setAppState(AppState.VIEWING_SERVICES);
                  }
                }}
            />
        );
      case AppState.VIEWING_PROVIDER_PROFILE:
        const allServices = serviceCategories.flatMap(c => c.services);
        return selectedProvider && selectedService && (
          <ProviderProfileView
            provider={selectedProvider}
            service={selectedService}
            reviews={reviews.filter(r => r.providerId === selectedProvider.id)}
            allServices={allServices}
            onBack={() => setAppState(AppState.VIEWING_PROVIDERS)}
            onSchedule={handleScheduleFromProfile}
          />
        );
       case AppState.SCHEDULING:
        return selectedProvider && selectedService && (
            <SchedulingView 
                provider={selectedProvider}
                service={selectedService}
                onDateTimeSelect={handleDateTimeSelect}
                onBack={() => setAppState(AppState.VIEWING_PROVIDER_PROFILE)}
                existingBookings={bookingRequests.filter(r => r.providerId === selectedProvider.id && r.status === RequestStatus.CONFIRMED)}
            />
        );
       case AppState.PROCESSING_PAYMENT:
        return selectedService && selectedProvider && selectedDateTime && (
          <PaymentView 
            service={selectedService}
            provider={selectedProvider}
            dateTime={selectedDateTime}
            onConfirmPayment={handleConfirmPayment}
            onBack={() => setAppState(AppState.SCHEDULING)}
          />
        );
      case AppState.REQUEST_SENT:
        return selectedService && selectedCategory && selectedProvider && selectedDateTime && (
          <BookingConfirmation 
            service={selectedService}
            category={selectedCategory}
            provider={selectedProvider}
            dateTime={selectedDateTime}
            onNewBooking={handleNewBooking}
          />
        );
      case AppState.RESCHEDULING:
        return selectedProvider && selectedService && bookingToReschedule && (
          <SchedulingView 
              provider={selectedProvider}
              service={selectedService}
              onDateTimeSelect={handleConfirmReschedule}
              onBack={() => {
                  setBookingToReschedule(null);
                  setSelectedProvider(null);
                  setSelectedService(null);
                  setAppState(AppState.CUSTOMER_DASHBOARD);
              }}
              existingBookings={bookingRequests.filter(r => r.providerId === selectedProvider.id && r.status === RequestStatus.CONFIRMED && r.id !== bookingToReschedule.id)}
              pageTitle="Reschedule Appointment"
              ctaButtonText="Confirm New Time"
          />
        );
      case AppState.RESCHEDULE_REQUEST_SENT:
        return (
          <RescheduleConfirmation 
            onDone={() => setAppState(AppState.CUSTOMER_DASHBOARD)}
          />
        );
      case AppState.VIEWING_SEARCH_RESULTS:
        return (
            <SearchResultsView 
                query={searchQuery}
                results={searchResults}
                isLoading={isSearching}
                onServiceSelect={handleSelectService}
                onBack={handleBackToCategories}
                isLoggedIn={!!currentUser}
            />
        );
      case AppState.PROVIDER_MANAGING_SERVICES:
        const currentProvider = providers.find(p => p.id === currentUser?.id);
        return currentUser?.role === UserRole.PROVIDER && currentProvider && (
            <ProviderServiceManager
                provider={currentProvider}
                categories={serviceCategories}
                onSave={handleUpdateProviderProfile}
                onBack={() => setAppState(AppState.PROVIDER_DASHBOARD)}
            />
        );
      case AppState.BROWSING_CATEGORIES:
      default:
        return (
          <ServiceCategorySelector
            categories={serviceCategories}
            onSelectCategory={handleSelectCategory}
            onSearch={handleSearch}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        user={currentUser}
        onLoginClick={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onProviderDashboardClick={viewProviderDashboard}
        onCustomerDashboardClick={viewCustomerDashboard}
      />
      <main className="flex-grow container mx-auto px-4 py-10 md:py-16">
        {renderContent()}
      </main>
      <Footer />
      {isAuthModalOpen && (
        <AuthModal 
            onClose={() => setAuthModalOpen(false)}
            onLogin={handleLogin}
            onSignUp={handleSignUp}
        />
      )}
    </div>
  );
};

export default App;