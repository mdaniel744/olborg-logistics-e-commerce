import React from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import { LanguageProvider } from '@/lib/i18n';
import { CartProvider } from '@/lib/CartContext';
import { CATEGORY_LANDINGS } from '@/lib/routes';
import StoreLayout from '@/components/store/StoreLayout';
import CategoryLanding from '@/components/store/CategoryLanding';
import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import CartPage from '@/pages/CartPage';
import Checkout from '@/pages/Checkout';
import OrderConfirmation from '@/pages/OrderConfirmation';
import QuotePage from '@/pages/QuotePage';
import DeliveryPage from '@/pages/DeliveryPage';
import GuidesPage from '@/pages/GuidesPage';
import GuideDetail from '@/pages/GuideDetail';
import AboutPage from '@/pages/AboutPage';
import FaqPage from '@/pages/FaqPage';
import ContactPage from '@/pages/ContactPage';
import PolicyPage from '@/pages/PolicyPage';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <LanguageProvider>
      <CartProvider>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Storefront (PL root + DE prefix) */}
          <Route element={<StoreLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/de" element={<Home />} />
            <Route path="/kontenery" element={<Shop />} />
            <Route path="/de/container" element={<Shop />} />
            <Route path="/dostawa" element={<DeliveryPage />} />
            <Route path="/de/lieferung" element={<DeliveryPage />} />
            <Route path="/poradnik" element={<GuidesPage />} />
            <Route path="/de/ratgeber" element={<GuidesPage />} />
            <Route path="/poradnik/:slug" element={<GuideDetail />} />
            <Route path="/de/ratgeber/:slug" element={<GuideDetail />} />
            <Route path="/o-nas" element={<AboutPage />} />
            <Route path="/de/ueber-uns" element={<AboutPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/de/faq" element={<FaqPage />} />
            <Route path="/kontakt" element={<ContactPage />} />
            <Route path="/de/kontakt" element={<ContactPage />} />
            <Route path="/koszyk" element={<CartPage />} />
            <Route path="/de/warenkorb" element={<CartPage />} />
            <Route path="/zamowienie" element={<Checkout />} />
            <Route path="/de/kasse" element={<Checkout />} />
            <Route path="/potwierdzenie" element={<OrderConfirmation />} />
            <Route path="/de/bestellbestaetigung" element={<OrderConfirmation />} />
            <Route path="/wycena" element={<QuotePage />} />
            <Route path="/de/angebot" element={<QuotePage />} />

            {/* Policies */}
            <Route path="/regulamin" element={<PolicyPage policyKey="terms" />} />
            <Route path="/de/agb" element={<PolicyPage policyKey="terms" />} />
            <Route path="/dostawa-i-transport" element={<PolicyPage policyKey="shipping" />} />
            <Route path="/de/versand-und-lieferung" element={<PolicyPage policyKey="shipping" />} />
            <Route path="/zwroty" element={<PolicyPage policyKey="returns" />} />
            <Route path="/de/rueckgabe" element={<PolicyPage policyKey="returns" />} />
            <Route path="/odstapienie-od-umowy" element={<PolicyPage policyKey="withdrawal" />} />
            <Route path="/de/widerruf" element={<PolicyPage policyKey="withdrawal" />} />
            <Route path="/reklamacje" element={<PolicyPage policyKey="complaints" />} />
            <Route path="/de/reklamationen" element={<PolicyPage policyKey="complaints" />} />
            <Route path="/polityka-prywatnosci" element={<PolicyPage policyKey="privacy" />} />
            <Route path="/de/datenschutz" element={<PolicyPage policyKey="privacy" />} />
            <Route path="/polityka-cookies" element={<PolicyPage policyKey="cookies" />} />
            <Route path="/de/cookie-richtlinie" element={<PolicyPage policyKey="cookies" />} />

            {/* SEO category landings */}
            {CATEGORY_LANDINGS.map((landing) => (
              <React.Fragment key={landing.key}>
                <Route path={landing.pl} element={<CategoryLanding landing={landing} />} />
                <Route path={landing.de} element={<CategoryLanding landing={landing} />} />
              </React.Fragment>
            ))}

            {/* Product detail (dynamic slugs, lowest priority) */}
            <Route path="/:slug" element={<ProductDetail />} />
            <Route path="/de/:slug" element={<ProductDetail />} />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </CartProvider>
    </LanguageProvider>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App