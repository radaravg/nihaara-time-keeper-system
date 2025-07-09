
import { Calendar, CheckCircle, FileText, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HapticService } from '@/services/hapticService';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'attendance', label: 'Attendance', icon: CheckCircle },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'task', label: 'Tasks', icon: FileText },
  { id: 'profile', label: 'Profile', icon: User },
];

export const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-white/10 rounded-t-3xl">
      <div className="flex justify-around items-center py-2 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => {
                HapticService.toggleFeedback();
                onTabChange(tab.id);
              }}
              className={cn(
                "flex flex-col items-center p-3 rounded-2xl transition-all duration-300 mobile-tap",
                isActive 
                  ? "bg-primary/20 text-primary scale-110" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <Icon size={24} className={cn("mb-1", isActive && "animate-pulse-glow")} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
