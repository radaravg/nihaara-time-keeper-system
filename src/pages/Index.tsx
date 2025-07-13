
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Employee } from '@/types/employee';
import { OnboardingForm } from '@/components/employee/OnboardingForm';
import { BottomTabs } from '@/components/employee/BottomTabs';
import { SwipeAttendance } from '@/components/employee/SwipeAttendance';
import { EmployeeCalendar } from '@/components/employee/EmployeeCalendar';
import { TasksTab } from '@/components/employee/TasksTab';
import { EmployeeProfile } from '@/components/employee/EmployeeProfile';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminAuthService } from '@/services/adminAuth';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

const Index = () => {
  const [employee, setEmployee] = useLocalStorage<Employee | null>('nat_employee', null);
  const [activeTab, setActiveTab] = useState('attendance');
  const [isLoading, setIsLoading] = useState(true);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await AdminAuthService.isAuthenticated();
      setIsAdminAuthenticated(authenticated);
    };

    const timer = setTimeout(() => {
      setIsLoading(false);
      checkAuth();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleOnboardingComplete = (newEmployee: Employee) => {
    setEmployee(newEmployee);
  };

  const handleLogout = () => {
    setEmployee(null);
    setActiveTab('attendance');
  };

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    setShowAdminLogin(false);
  };

  const handleAdminLogout = async () => {
    await AdminAuthService.logout();
    setIsAdminAuthenticated(false);
  };

  const handleShowAdminLogin = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    setShowAdminLogin(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-background">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-500 rounded-full flex items-center justify-center mx-auto animate-pulse-glow">
            <span className="text-2xl font-bold text-white">NAT</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold gradient-text">Loading NAT</h1>
            <p className="text-muted-foreground">Syncing with Kolkata time...</p>
          </div>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Show admin login modal
  if (showAdminLogin) {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  // Show admin dashboard if authenticated
  if (isAdminAuthenticated) {
    return <AdminDashboard onLogout={handleAdminLogout} />;
  }

  // Show onboarding if no employee profile
  if (!employee) {
    return (
      <div className="min-h-screen min-h-dvh bg-gradient-to-br from-background via-card to-background mobile-safe-area">
        {/* Admin Login Button */}
        <div className="absolute top-4 right-4 z-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShowAdminLogin}
            className="text-xs text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all duration-200"
          >
            <Shield className="w-3 h-3 mr-1" />
            Admin
          </Button>
        </div>
        
        <OnboardingForm onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  // Employee interface with admin login button
  return (
    <div className="min-h-screen min-h-dvh bg-gradient-to-br from-background via-card to-background mobile-safe-area">
      {/* Admin Login Button */}
      <div className="absolute top-4 right-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShowAdminLogin}
          className="text-xs text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all duration-200"
        >
          <Shield className="w-3 h-3 mr-1" />
          Admin
        </Button>
      </div>

      {/* Main Content */}
      <div className="mobile-container mobile-scroll animate-slide-in pb-24 pt-4">
        {activeTab === 'attendance' && <SwipeAttendance employee={employee} />}
        {activeTab === 'calendar' && <EmployeeCalendar employee={employee} />}
        {activeTab === 'tasks' && <TasksTab employeeId={employee.id} />}
        {activeTab === 'profile' && <EmployeeProfile employee={employee} onLogout={handleLogout} />}
        {activeTab === 'salary' && <EmployeeProfile employee={employee} onLogout={handleLogout} />}
      </div>

      {/* Bottom Navigation */}
      <BottomTabs activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
