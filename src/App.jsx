import React, { Suspense, lazy, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import Login from "./Components/Login";
import ProtectedRoute from './Components/ProtectedRoute';
import SubscriptionGuard from './Components/Subscription/SubscriptionGuard';
import { ThemeProvider } from './context/Themecontext';
import Unauthorized from './Components/Unauthorized';
const Error404Page = lazy(() => import('./Components/Error404Page'));

// Landing Page Components (for better performance, keep these non-lazy)
import LandingPage from './Components/Landing/LandingPage';
import LandingNavbar from './Components/Landing/LandingNavbar';
import LoadingSpinner from './Components/Loader/LoadingSpinner';
import Footer from './Components/Landing/components/Footer';

// Landing Page Components
import AboutPage from './Components/Landing/pages/AboutPage';
import ServicesPage from './Components/Landing/pages/ServicePage';
import EmployeeManagement from './Components/Landing/pages/EmployeeManagement';
import PayrollBenefits from './Components/Landing/pages/PayrollBenefits';
import FeaturesPage from './Components/Landing/components/FeaturesSection';
import ContactPage from './Components/Landing/components/ContactPage';

// Legal Pages
import SecurityPolicy from './Components/Landing/pages/SecurityPolicy';
import TermsOfService from './Components/Landing/pages/TermsOfService';
import PrivacyPolicy from './Components/Landing/pages/PrivacyPolicy';
import ComingSoon from './Components/Landing/pages/ComingSoon';

import { useNavigate } from 'react-router-dom';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(state => state.auth?.isAuthenticated) || false;
  const permissions = useSelector(state => state.permissions) || {};

  const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  };

  // Detect if user is on mobile or tablet
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(window.innerWidth <= 768);

  // Route categorization for better performance
  const isLandingRoute = [
    "/",
    "/about",
    "/services",
    "/features",
    "/contact",
    "/employee-management",
    "/payroll-benefits",
    "/security-policy",
    "/terms-of-service",
    "/privacy-policy",
    "/coming-soon"
  ].includes(location.pathname);

  const isLoginRoute = location.pathname === "/login";
  const isErrorRoute = ["/unauthorized", "/404"].includes(location.pathname);
  const isPublicRoute = isLandingRoute || isLoginRoute || isErrorRoute;
  const shouldHideNavigation = isPublicRoute;

  // Sidebar state management with localStorage persistence
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved !== null ? JSON.parse(saved) : window.innerWidth <= 768;
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Redirect to Daily Attendance for mobile/tablet users after login
  useEffect(() => {
    if (isAuthenticated && isMobileOrTablet) {
      // Redirect to daily attendance instead of dashboard
      navigate("/attendance/daily");
      setIsCollapsed(false);
    } else if (isAuthenticated && !isMobileOrTablet) {
      // Desktop users go to dashboard
      navigate("/dashboard");
      setIsCollapsed(false);
    }
  }, [isAuthenticated, isMobileOrTablet, navigate]);

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  // Optimized window resize handler with debouncing
  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const mobile = window.innerWidth <= 768;
        const mobileOrTablet = window.innerWidth <= 768;

        setIsMobile(mobile);
        setIsMobileOrTablet(mobileOrTablet);

        // Auto-collapse on mobile, expand on desktop if previously expanded
        if (mobile && !isCollapsed) {
          setIsCollapsed(true);
        }
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [isCollapsed]);

  // Calculate main content style with smooth transitions
  const getMainContentStyle = () => {
    if (shouldHideNavigation) return { minHeight: '100vh' };

    return {
      marginLeft: isCollapsed
        ? (isMobile ? '0' : '80px')
        : '256px',
      paddingTop: '64px',
      minHeight: 'calc(100vh - 64px)',
      transition: 'margin-left 0.3s ease-in-out'
    };
  };


  const LandingPageWrapper = ({ children }) => (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );

  return (
    <ThemeProvider>
      <ScrollToTop />
      <SubscriptionGuard>
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
          {/* Landing Page Navbar - Show on all landing routes */}
          {isLandingRoute && <LandingNavbar />}

          {/* Application Navbar */}
          {!shouldHideNavigation && (
            <Navbar
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          )}

          {/* Sidebar for authenticated routes - Pass isMobileOrTablet prop */}
          {!shouldHideNavigation && (
            <Sidebar
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              isMobileOrTablet={isMobileOrTablet}
            />
          )}

          <main
            className="transition-all duration-300 overflow-y-auto"
            style={getMainContentStyle()}
          >
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public Landing Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={
                  <LandingPageWrapper>
                    <AboutPage />
                  </LandingPageWrapper>
                } />
                <Route path="/services" element={
                  <LandingPageWrapper>
                    <ServicesPage />
                  </LandingPageWrapper>
                } />
                <Route path="/employee-management" element={
                  <LandingPageWrapper>
                    <EmployeeManagement />
                  </LandingPageWrapper>
                } />
                <Route path="/payroll-benefits" element={
                  <LandingPageWrapper>
                    <PayrollBenefits />
                  </LandingPageWrapper>
                } />
                <Route path="/features" element={
                  <LandingPageWrapper>
                    <FeaturesPage />
                  </LandingPageWrapper>
                } />
                <Route path="/contact" element={
                  <LandingPageWrapper>
                    <ContactPage />
                  </LandingPageWrapper>
                } />

                {/* Legal Pages Routes */}
                <Route path="/security-policy" element={
                  <LandingPageWrapper>
                    <SecurityPolicy />
                  </LandingPageWrapper>
                } />
                <Route path="/terms-of-service" element={
                  <LandingPageWrapper>
                    <TermsOfService />
                  </LandingPageWrapper>
                } />
                <Route path="/privacy-policy" element={
                  <LandingPageWrapper>
                    <PrivacyPolicy />
                  </LandingPageWrapper>
                } />
                <Route path="/coming-soon" element={
                  <LandingPageWrapper>
                    <ComingSoon />
                  </LandingPageWrapper>
                } />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />



                {/* 404 Error Page - Catch all unmatched routes */}
                <Route path="/404" element={<Error404Page />} />
                <Route path="*" element={<Navigate to="/404" replace />} />

              </Routes>
            </Suspense>
          </main>

          {/* Footer for Landing Pages - Show only on landing routes */}
          {isLandingRoute && <Footer />}
        </div>
      </SubscriptionGuard>
    </ThemeProvider>
  );
};

export default App;