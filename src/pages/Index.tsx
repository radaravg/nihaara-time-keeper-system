
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Employee } from '@/types';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { BottomNavigation } from '@/components/BottomNavigation';
import { AttendanceTab } from '@/components/AttendanceTab';
import { CalendarTab } from '@/components/CalendarTab';
import { TaskTab } from '@/components/TaskTab';
import { ProfileTab } from '@/components/ProfileTab';

const Index = () => {
  const [employee, setEmployee] = useLocalStorage<Employee | null>('employee', null);
  const [activeTab, setActiveTab] = useState('attendance');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and sync with Kolkata time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleOnboardingComplete = (newEmployee: Employee) => {
    setEmployee(newEmployee);
  };

  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    setEmployee(updatedEmployee);
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

  if (!employee) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background pb-20">
      {/* Main Content */}
      <div className="animate-slide-in">
        {activeTab === 'attendance' && <AttendanceTab employeeId={employee.id} />}
        {activeTab === 'calendar' && <CalendarTab employeeId={employee.id} />}
        {activeTab === 'task' && <TaskTab employeeId={employee.id} />}
        {activeTab === 'profile' && (
          <ProfileTab 
            employee={employee} 
            onUpdateEmployee={handleUpdateEmployee}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
