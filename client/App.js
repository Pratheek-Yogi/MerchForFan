import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import API_URL from './config/apiConfig';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import BrandLogosSlider from './components/BrandLogosSlider';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import SportsCategoryPage from './components/SportsCategoryPage';
import TermsOfServicePage from './components/TermsOfServicePage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import CookiePolicyPage from './components/CookiePolicyPage';
import ContactUsPage from './components/ContactUsPage';
import CricketPage from './components/CricketPage';
import FootballPage from './components/FootballPage';
import BasketballPage from './components/BasketballPage';
import SessionInitializer from './components/SessionInitializer';
import CartPage from './components/CartPage';
import ScrollToTop from './components/ScrollToTop';
import SearchPage from './components/SearchPage';
import ShippingTracker from './components/ShippingTracker';
import ShippingGuidelines from './components/ShippingPolicy';
import ReturnsPolicy from './components/ReturnsPolicy';

// Lazy load heavy components (these are likely causing the large bundles)
const MerchCustomizer = lazy(() => import('./components/MerchCustomizer'));
const SpecialCollectionPage = lazy(() => import('./components/SpecialCollectionPage'));
const ProductDetailPage = lazy(() => import('./components/ProductDetailPage'));
const CheckoutPage = lazy(() => import('./components/CheckoutPage'));
const MyAccountPage = lazy(() => import('./components/MyAccountPage'));
const MyOrders = lazy(() => import('./components/MyOrders'));
const Profile = lazy(() => import('./components/Profile'));
const Password = lazy(() => import('./components/Password'));
const MyAddress = lazy(() => import('./components/MyAddress'));
const PopularAthletePage = lazy(() => import('./components/PopularAthletePage'));
const LimitedEditionPage = lazy(() => import('./components/LimitedEditionPage'));
const HotSalePage = lazy(() => import('./components/HotSalePage'));
const CapsPage = lazy(() => import('./components/CapsPage'));
const TshirtPage = lazy(() => import('./components/TshirtPage'));
const KidsPage = lazy(() => import('./components/KidsPage'));

// Loading component for suspense fallback
const LoadingFallback = () => (
  <div className="loading" style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '200px',
    fontSize: '18px',
    color: '#666'
  }}>
    Loading...
  </div>
);

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <ScrollToTop />
        <MainContent />
      </ErrorBoundary>
    </Router>
  );
}

function MainContent() {
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Fetch hello message
    fetch(`${API_URL}/hello`)
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error fetching message:', error));

    // Fetch users
    fetch(`${API_URL}/users`)
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);

  const showBrandLogosSlider = location.pathname !== '/customize';

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <SessionInitializer />
      <Header />
      
      {/* Suspense wrapper for all lazy-loaded routes */}
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Keep critical routes normal for instant loading */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/sports/cricket" element={<CricketPage />} />
          <Route path="/sports/football" element={<FootballPage />} />
          <Route path="/sports/basketball" element={<BasketballPage />} />
          <Route path="/sports/:sport" element={<SportsCategoryPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/shipping-info" element={<ShippingGuidelines/>} />
          <Route path="/returns-policy" element={<ReturnsPolicy/>} />
          <Route path="/tracker" element={<ShippingTracker />} />
          
          {/* Lazy-loaded heavy routes */}
          <Route path="/customize" element={<MerchCustomizer />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/athlete/:athleteName" element={<PopularAthletePage />} />
          <Route path="/special/:sport" element={<SpecialCollectionPage />} />
          <Route path="/limited-edition" element={<LimitedEditionPage />} />
          <Route path="/hotsale" element={<HotSalePage />} />
          <Route path="/caps" element={<CapsPage />} />
          <Route path="/tshirts" element={<TshirtPage />} />
          <Route path="/kids" element={<KidsPage />} />
          
          {/* Nested lazy-loaded routes */}
          <Route path="/my-account" element={<MyAccountPage />}>
            <Route path="orders" element={<MyOrders />} />
            <Route path="profile" element={<Profile />} />
            <Route path="password" element={<Password />} />
            <Route path="address" element={<MyAddress />} />
          </Route>
        </Routes>
      </Suspense>
      
      {showBrandLogosSlider && <BrandLogosSlider />}
      <Footer />
    </div>
  );
}

export default App;
