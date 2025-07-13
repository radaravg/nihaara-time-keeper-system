import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CalendarDays } from 'lucide-react';
import { Employee, Attendance } from '@/types/employee';
import { SupabaseService } from '@/services/supabaseService';
import { cn } from '@/lib/utils';

interface EmployeeCalendarProps {
  employee: Employee;
}

export function EmployeeCalendar({ employee }: EmployeeCalendarProps) {
  const [attendanceHistory, setAttendanceHistory] = useState<Attendance[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    loadAttendanceHistory();
  }, [employee.id]);

  const loadAttendanceHistory = async () => {
    try {
      const history = await SupabaseService.getEmployeeAttendance(employee.id);
      setAttendanceHistory(history);
    } catch (error) {
      console.error('Failed to load attendance history:', error);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getAttendanceForDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateString = date.toISOString().split('T')[0];
    return attendanceHistory.find(att => att.date === dateString);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthYear = currentMonth.toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric'
  });

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Attendance Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={goToPreviousMonth}
              className="p-2 rounded-lg hover:bg-secondary mobile-tap"
            >
              ←
            </button>
            <h3 className="text-lg font-semibold">{monthYear}</h3>
            <button
              onClick={goToNextMonth}
              className="p-2 rounded-lg hover:bg-secondary mobile-tap"
            >
              →
            </button>
          </div>

          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={index} className="p-2" />;
              }

              const attendance = getAttendanceForDate(day);
              const isToday = new Date().toDateString() === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();

              return (
                <div
                  key={day}
                  className={cn(
                    "p-2 text-center rounded-lg border text-sm relative",
                    isToday && "border-primary bg-primary/10",
                    !isToday && "border-border",
                    attendance && "bg-green-500/20 border-green-500/50"
                  )}
                >
                  <span className={cn(
                    "font-medium",
                    isToday && "text-primary",
                    attendance && "text-green-400"
                  )}>
                    {day}
                  </span>
                  {attendance && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Attendance Summary */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            This Month Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="text-2xl font-bold text-green-400">
                {attendanceHistory.filter(att => {
                  const attDate = new Date(att.date);
                  return attDate.getMonth() === currentMonth.getMonth() && 
                         attDate.getFullYear() === currentMonth.getFullYear();
                }).length}
              </div>
              <div className="text-sm text-muted-foreground">Days Present</div>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="text-2xl font-bold text-primary">
                {new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()}
              </div>
              <div className="text-sm text-muted-foreground">Total Days</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}