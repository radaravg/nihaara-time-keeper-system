import { useState, useEffect } from 'react';
import { AdminBottomNavigation } from './AdminBottomNavigation';
import { EmployeesTab } from './tabs/EmployeesTab';
import { AttendanceTab } from './tabs/AttendanceTab';
import { ResetRequestsTab } from './tabs/ResetRequestsTab';
import { NotesTab } from './tabs/NotesTab';
import { ExportsTab } from './tabs/ExportsTab';
import { AdminAuthService } from '@/services/adminAuth';
import { useToast } from '@/hooks/use-toast';

type AdminTab = 'employees' | 'attendance' | 'requests' | 'notes' | 'exports';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('employees');
  const { toast } = useToast();

  const handleLogout = async () => {
    await AdminAuthService.logout();
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin dashboard"
    });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-xs font-bold text-white">NAT</span>
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Nihaara Attendance Tracker</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="animate-slide-in">
        {activeTab === 'employees' && <EmployeesTab />}
        {activeTab === 'attendance' && <AttendanceTab />}
        {activeTab === 'requests' && <ResetRequestsTab />}
        {activeTab === 'notes' && <NotesTab />}
        {activeTab === 'exports' && <ExportsTab />}
      </div>

      {/* Bottom Navigation */}
      <AdminBottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};