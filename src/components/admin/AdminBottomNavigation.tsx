import { Users, Calendar, RefreshCw, FileText, Download } from 'lucide-react';

type AdminTab = 'employees' | 'attendance' | 'requests' | 'notes' | 'exports';

interface AdminBottomNavigationProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

export const AdminBottomNavigation = ({ activeTab, onTabChange }: AdminBottomNavigationProps) => {
  const tabs = [
    { id: 'employees' as const, label: 'Employees', icon: Users },
    { id: 'attendance' as const, label: 'Attendance', icon: Calendar },
    { id: 'requests' as const, label: 'Requests', icon: RefreshCw },
    { id: 'notes' as const, label: 'Notes', icon: FileText },
    { id: 'exports' as const, label: 'Export', icon: Download },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-white/10 z-50">
      <div className="flex justify-around items-center py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-primary bg-primary/10 scale-105'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              <Icon size={20} className={isActive ? 'animate-pulse-glow' : ''} />
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};