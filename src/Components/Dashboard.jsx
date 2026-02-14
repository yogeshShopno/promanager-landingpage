import React, { useState } from 'react';
import AttendanceReport from './DashboardComponents/AttendanceReport';
import PayrollSummary from './DashboardComponents/PayrollSummary';
import SalaryTrend from './DashboardComponents/SalaryTrend';
import { DashboardProvider } from '../context/DashboardContext';
import { useAuth } from '../context/AuthContext';

const DashboardContent = () => {
  // Static sample data (keep/remove as needed)
  return (
    <div className="min-h-screen p-6 bg-[var(--color-bg-primary)]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* First Row */}
        <div className="py-2">
          <AttendanceReport />
        </div>
        <div>
          <PayrollSummary />
        </div>

        {/* Second Row */}
        <div >
          <SalaryTrend />
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();

  const [selectedDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  return (
    <DashboardProvider user={user} date={selectedDate}>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default Dashboard;
