import React, { Suspense, lazy, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import Login from "./Components/Login";
import Dashboard from './Components/Dashboard';
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

// Lazy Loaded Employee Management Pages
const Employee = lazy(() => import('./pages/Employee/Employee'));
const EmployeeDetail = lazy(() => import('./pages/Employee/EmployeeDetail'));
const AddEmployee = lazy(() => import('./pages/Employee/AddEmployee'));
const DepartmentsPage = lazy(() => import('./pages/Employee/Departments'));
const BranchesPage = lazy(() => import('./pages/Employee/Branches'));
const DesignationPage = lazy(() => import('./pages/Employee/Designations'));
const DeductionPage = lazy(() => import('./pages/Employee/Deduction'));
const AllowancePage = lazy(() => import('./pages/Employee/Allowance'));
const CompanyPage = lazy(() => import('./pages/Employee/Company'));

// Lazy Loaded User Management Pages
const Role = lazy(() => import('./pages/Users/Role'));
const AddRole = lazy(() => import('./pages/Users/AddRole'));
const Usermanagement = lazy(() => import('./pages/Users/Usermanagement'));
const AddUser = lazy(() => import('./pages/Users/AddUser'));

// Lazy Loaded Shift Management Pages
const ShiftManagement = lazy(() => import('./pages/ShiftManagement/ShiftManagement'));
const CreateShift = lazy(() => import('./pages/ShiftManagement/CreateShift'));
const AssignShift = lazy(() => import('./pages/ShiftManagement/AssignShift'));

// Lazy Loaded Leave Management Pages
const LeaveApplication = lazy(() => import('./pages/Leave/LeaveApplication'));
const LeaveStatusPage = lazy(() => import('./pages/Leave/LeaveStatus'));
const Holiday = lazy(() => import('./pages/Leave/Holiday'));

// Lazy Loaded Loan Management Pages
const LoanAdvance = lazy(() => import('./pages/Loan/LoanAdvance'));
const AddLoanAdvance = lazy(() => import('./pages/Loan/AddLoanAdvance'));

// Lazy Loaded Payroll Management Pages
const MonthlyPayroll = lazy(() => import('./pages/Payroll/MonthlyPayroll'));
const FinalizePayroll = lazy(() => import('./pages/Payroll/FinalizePayroll'));

// Lazy Loaded Report Pages
const AllReports = lazy(() => import('./pages/Report/AllReports'));
const DailyReport = lazy(() => import('./pages/Report/DailyReport'));
const DetailedDailyReport = lazy(() => import('./pages/Report/DetailedDailyReport'));
const MonthlyReport = lazy(() => import('./pages/Report/MothlyReport'));
const MonthlyMusterPreview = lazy(() => import('./pages/Report/MonthlyMusterPreview'));
const DateRangeReport = lazy(() => import('./pages/Report/DateRangeReport'));
const EmployeeDirectoryReport = lazy(() => import('./pages/Report/EmployeeDirectoryReport'));
const MonthlySalaryReport = lazy(() => import('./pages/Report/MonthlySalaryReport'));

// Settings (combines Configuration + Plans & Pricing)
const SettingsPage = lazy(() => import('./pages/Setting/SettingsPage'));

import { useNavigate } from 'react-router-dom';
import DailyAttendance from './pages/Attendance/DailyAttendance';
import MonthlyAttendance from './pages/Attendance/MonthlyAttendance';
import GeolocationReport from './pages/Report/GeolocationReport';
import ShiftReallocation from './pages/ShiftManagement/ShiftReallocation';

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

  // Permission-based route wrapper
  const PermissionRoute = ({ children, permission, fallback = <Navigate to="/unauthorized" replace /> }) => {
    return permissions[permission] ? (
      <ProtectedRoute>{children}</ProtectedRoute>
    ) : fallback;
  };

  // Simplified wrapper component for landing pages
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

                {/* Protected Dashboard Route - Only for Desktop */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    {isMobileOrTablet ? <Navigate to="/attendance/daily" replace /> : <Dashboard />}
                  </ProtectedRoute>
                } />

                {/* Attendance Routes - Available for all devices */}
                <Route path="/attendance/daily" element={
                  <ProtectedRoute>
                    <DailyAttendance />
                  </ProtectedRoute>
                } />
                <Route path="/attendance/monthly" element={
                  <ProtectedRoute>
                    <MonthlyAttendance />
                  </ProtectedRoute>
                } />

                {/* Desktop Only Routes - Redirect mobile/tablet users to attendance */}
                <Route path="/role" element={
                  isMobileOrTablet ? (
                    <Navigate to="/attendance/daily" replace />
                  ) : (
                    <PermissionRoute permission="user_roles_view">
                      <Role />
                    </PermissionRoute>
                  )
                } />

                <Route path="/add-role" element={
                  isMobileOrTablet ? (
                    <Navigate to="/attendance/daily" replace />
                  ) : (
                    <PermissionRoute permission={permissions['user_roles_create'] || permissions['user_roles_edit'] ? 'user_roles_create' : null}>
                      <AddRole />
                    </PermissionRoute>
                  )
                } />

                <Route path="/usermanage" element={
                  isMobileOrTablet ? (
                    <Navigate to="/attendance/daily" replace />
                  ) : (
                    <PermissionRoute permission="user_view">
                      <Usermanagement />
                    </PermissionRoute>
                  )
                } />

                <Route path="/add-user" element={
                  isMobileOrTablet ? (
                    <Navigate to="/attendance/daily" replace />
                  ) : (
                    <PermissionRoute permission="user_create">
                      <AddUser />
                    </PermissionRoute>
                  )
                } />

                {/* Employee Management Routes - Desktop Only */}
                <Route path="/employee" element={
                  isMobileOrTablet ? (
                    <Navigate to="/attendance/daily" replace />
                  ) : (
                    <PermissionRoute permission="employee_view">
                      <Employee />
                    </PermissionRoute>
                  )
                } />

                <Route path="/add-employee" element={
                  isMobileOrTablet ? (
                    <Navigate to="/attendance/daily" replace />
                  ) : (
                    <PermissionRoute permission="employee_create">
                      <AddEmployee />
                    </PermissionRoute>
                  )
                } />

                <Route path="/employee/details/:employee_id" element={
                  isMobileOrTablet ? (
                    <Navigate to="/attendance/daily" replace />
                  ) : (
                    <PermissionRoute permission="employee_view">
                      <EmployeeDetail />
                    </PermissionRoute>
                  )
                } />

                {/* Organizational Structure Routes - Desktop Only */}
                <Route path="/departments" element={
                  isMobileOrTablet ? (
                    <Navigate to="/attendance/daily" replace />
                  ) : (
                    <PermissionRoute permission="department_view">
                      <DepartmentsPage />
                    </PermissionRoute>
                  )
                } />

                <Route path="/branches" element={
                  isMobileOrTablet ? (
                    <Navigate to="/attendance/daily" replace />
                  ) : (
                    <PermissionRoute permission="branch_view">
                      <BranchesPage />
                    </PermissionRoute>
                  )
                } />

                <Route path="/designation" element={
                  isMobileOrTablet ? (
                    <Navigate to="/attendance/daily" replace />
                  ) : (
                    <PermissionRoute permission="designation_view">
                      <DesignationPage />
                    </PermissionRoute>
                  )
                } />

                <Route path="/deductions" element={
                  isMobileOrTablet ? (
                    <Navigate to="/attendance/daily" replace />
                  ) : (
                    <PermissionRoute permission="deduction_view">
                      <DeductionPage />
                    </PermissionRoute>
                  )
                } />

                <Route path="/allowances" element={
                  isMobileOrTablet ? (
                    <Navigate to="/attendance/daily" replace />
                  ) : (
                    <PermissionRoute permission="allowance_view">
                      <AllowancePage />
                    </PermissionRoute>
                  )
                } />

                <Route path="/companies" element={
                  isMobileOrTablet ? (
                    <Navigate to="/attendance/daily" replace />
                  ) : (
                    <PermissionRoute permission="company_view">
                      <CompanyPage />
                    </PermissionRoute>
                  )
                } />

                {/* Shift Management Routes - Desktop Only */}
                <Route path="/shift-management" element={
                  isMobileOrTablet ? (
                    <Navigate to="/attendance/daily" replace />
                  ) : (
                    <PermissionRoute permission="shift_view">
                      <ShiftManagement />
                    </PermissionRoute>
                  )
                } />

                <Route path="/add-shift" element={
                  isMobileOrTablet ? (
                    <Navigate to="/attendance/daily" replace />
                  ) : (
                    <PermissionRoute permission="shift_create">
                      <CreateShift />
                    </PermissionRoute>
                  )
                } />

                <Route path="/assign-shift" element={
                  isMobileOrTablet ? (
                    <Navigate to="/attendance/daily" replace />
                  ) : (
                    <PermissionRoute permission="shift_assign">
                      <AssignShift />
                    </PermissionRoute>
                  )
                } />

                <Route path="/shift-reallocation" element={
                  isMobileOrTablet ? (
                    <Navigate to="/attendance/daily" replace />
                  ) : (
                    <PermissionRoute permission="shift_assign">
                      <ShiftReallocation />
                    </PermissionRoute>
                  )
                } />

                {/* Leave Management Routes - Desktop Only */}
                <Route path="/leaveapplication" element={
                  isMobileOrTablet ? (
                    <Navigate to="/attendance/daily" replace />
                  ) : (
                    <PermissionRoute permission="leave_create">
                      <LeaveApplication />
                    </PermissionRoute>
                  )
                } />

                <Route path="/leavestatusPage" element={
                  isMobileOrTablet ? (
                    <Navigate to="/attendance/daily" replace />
                  ) : (
                    <PermissionRoute permission="leave_view">
                      <LeaveStatusPage />
                    </PermissionRoute>
                  )
                } />

                <Route path="/holiday" element={
                  isMobileOrTablet ? (
                    <Navigate to="/attendance/daily" replace />
                  ) : (
                    <Holiday />
                  )
                } />

                {/* Loan Management Routes - Desktop Only */}
                <Route path="/loans" element={
                  isMobileOrTablet ? (
                    <Navigate to="/attendance/daily" replace />
                  ) : (
                    <PermissionRoute permission="loan_view">
                      <LoanAdvance />
                    </PermissionRoute>
                  )
                } />

                <Route path="/add-loan-advance" element={
                  isMobileOrTablet ? (
                    <Navigate to="/attendance/daily" replace />
                  ) : (
                    <PermissionRoute permission="loan_create">
                      <AddLoanAdvance />
                    </PermissionRoute>
                  )
                } />

                {/* Payroll Management Routes - Desktop Only */}
                <Route path="/monthly-payroll" element={
                  isMobileOrTablet ? (
                    <Navigate to="/attendance/daily" replace />
                  ) : (
                    <PermissionRoute permission={permissions['salary_view'] || permissions['salary_create'] ? 'salary_view' : null}>
                      <MonthlyPayroll />
                    </PermissionRoute>
                  )
                } />

                <Route path="/finalize-payroll" element={
                  isMobileOrTablet ? (
                    <Navigate to="/attendance/daily" replace />
                  ) : (
                    <PermissionRoute permission={permissions['salary_create'] || permissions['add_salary_payment'] ? 'salary_create' : null}>
                      <FinalizePayroll />
                    </PermissionRoute>
                  )
                } />

                {/* Reports Routes - Desktop Only */}
                <Route path="/reports" element={
                  <PermissionRoute permission={
                    permissions['employee_directory'] ||
                      permissions['daily_attendance'] ||
                      permissions['monthly_attendance'] ||
                      permissions['monthly_salary'] ||
                      permissions['custom_range'] ? 'employee_directory' : null
                  }>
                    <AllReports />
                  </PermissionRoute>
                } />

                <Route path="/reports/employee-directory" element={

                  <PermissionRoute permission="employee_directory">
                    <EmployeeDirectoryReport />
                  </PermissionRoute>
                } />

                <Route path="/reports/daily-attendance" element={
                  <PermissionRoute permission="daily_attendance">
                    <DailyReport />
                  </PermissionRoute>
                } />

                <Route path="/reports/daily-attendance-detailed" element={
                  <PermissionRoute permission="daily_attendance">
                    <DetailedDailyReport />
                  </PermissionRoute>
                } />

                <Route path="/reports/monthly-attendance" element={
                    <PermissionRoute permission="monthly_attendance">
                      <MonthlyReport />
                    </PermissionRoute>
                } />

                <Route path="/reports/monthly-attendance-muster" element={
                    <PermissionRoute permission="monthly_attendance">
                      <MonthlyMusterPreview />
                    </PermissionRoute>
                } />

                <Route path="/reports/daterangereport" element={
                    <PermissionRoute permission="custom_range">
                      <DateRangeReport />
                    </PermissionRoute>
                } />

                <Route path="/reports/monthly-salary" element={
                    <PermissionRoute permission="monthly_salary">
                      <MonthlySalaryReport />
                    </PermissionRoute>
                } />

                <Route path="/reports/geolocation-report" element={
                    <PermissionRoute permission="daily_attendance">
                      <GeolocationReport />
                    </PermissionRoute>
                } />

                <Route path="/settings" element={
                  isMobileOrTablet ? (
                    <Navigate to="/attendance/daily" replace />
                  ) : (
                    <ProtectedRoute>
                      <SettingsPage canEditConfiguration={!!permissions.configuration_edit} />
                    </ProtectedRoute>
                  )
                } />

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