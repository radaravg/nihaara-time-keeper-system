import { Clock, Calendar, CheckSquare, User, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'attendance', label: 'Attendance', icon: Clock },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'salary', label: 'Salary', icon: DollarSign },
];

export function BottomTabs({ activeTab, onTabChange }: BottomTabsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-white/10 safe-area-padding">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 mobile-tap",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "scale-110")} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}