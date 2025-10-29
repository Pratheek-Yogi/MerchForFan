import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import BrandLogosSlider from './components/BrandLogosSlider';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import MerchCustomizer from './components/MerchCustomizer';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import SportsCategoryPage from './components/SportsCategoryPage';
import SpecialCollectionPage from './components/SpecialCollectionPage';
import TermsOfServicePage from './components/TermsOfServicePage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import CookiePolicyPage from './components/CookiePolicyPage';
import ContactUsPage from './components/ContactUsPage';
import CricketPage from './components/CricketPage';
import FootballPage from './components/FootballPage';
import BasketballPage from './components/BasketballPage';
import SessionInitializer from './components/SessionInitializer';
import CartPage from './components/CartPage';
import ProductDetailPage from './components/ProductDetailPage';
import CheckoutPage from './components/CheckoutPage';
import MyAccountPage from './components/MyAccountPage';
import MyOrders from './components/MyOrders';
import Profile from './components/Profile';
import Password from './components/Password';
import MyAddress from './components/MyAddress';
import ScrollToTop from './components/ScrollToTop';
import PopularAthletePage from './components/PopularAthletePage';
import SearchPage from './components/SearchPage';
import LimitedEditionPage from './components/LimitedEditionPage';
import HotSalePage from './components/HotSalePage';
import CapsPage from './components/CapsPage';
import TshirtPage from './components/TshirtPage';
import KidsPage from './components/KidsPage';
import ShippingTracker from './components/ShippingTracker';
import ShippingGuidelines from './components/ShippingPolicy';
import ReturnsPolicy from './components/ReturnsPolicy';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <MainContent />
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
    fetch('/api/hello')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error fetching message:', error));

    // Fetch users
    fetch('/api/users')
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
      <Routes>
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
        <Route path="/customize" element={<MerchCustomizer />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/athlete/:athleteName" element={<PopularAthletePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/special/:sport" element={<SpecialCollectionPage />} />
        <Route path="/limited-edition" element={<LimitedEditionPage />} />
        <Route path="/hotsale" element={<HotSalePage />} />
        <Route path="/caps" element={<CapsPage />} />
        <Route path="/tshirts" element={<TshirtPage />} />
        <Route path="/kids" element={<KidsPage />} />
        <Route path="/shipping-info" element={<ShippingGuidelines/>} />
        <Route path="/returns-policy" element={<ReturnsPolicy/>} />
        <Route path="/tracker" element={<ShippingTracker />} />
        <Route path="/my-account" element={<MyAccountPage />}>
          <Route path="orders" element={<MyOrders />} />
          <Route path="profile" element={<Profile />} />
          <Route path="password" element={<Password />} />
          <Route path="address" element={<MyAddress />} />
        </Route>
      </Routes>
      {showBrandLogosSlider && <BrandLogosSlider />}
      <Footer />
    </div>
  );
}

export default App;
