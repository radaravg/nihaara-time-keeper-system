
import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AttendanceRecord } from '@/types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { cn } from '@/lib/utils';

interface CalendarTabProps {
  employeeId: string;
}

export const CalendarTab = ({ employeeId }: CalendarTabProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendance] = useLocalStorage<AttendanceRecord[]>('attendance', []);
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const getAttendanceForDate = (date: Date) => {
    return attendance.find(record => 
      record.employeeId === employeeId && 
      record.date === format(date, 'yyyy-MM-dd')
    );
  };

  const getStatusColor = (record?: AttendanceRecord) => {
    if (!record || !record.checkIn) return 'bg-muted';
    if (record.checkIn && record.checkOut) return 'bg-green-500';
    return 'bg-yellow-500';
  };

  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Calendar size={24} className="text-primary" />
          <h1 className="text-2xl font-bold gradient-text">Attendance Calendar</h1>
        </div>
        <p className="text-muted-foreground">Track your monthly attendance</p>
      </div>

      {/* Calendar Header */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={previousMonth}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <h2 className="text-xl font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          
          <button 
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {monthDays.map(day => {
            const attendanceRecord = getAttendanceForDate(day);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentDate);
            
            return (
              <div
                key={day.toString()}
                className={cn(
                  "relative p-3 rounded-xl text-center transition-all duration-200 hover:scale-105",
                  isCurrentMonth 
                    ? "text-foreground hover:bg-white/5" 
                    : "text-muted-foreground/50",
                  isToday && "ring-2 ring-primary"
                )}
              >
                <span className="text-sm font-medium">
                  {format(day, 'd')}
                </span>
                
                {attendanceRecord && (
                  <div className={cn(
                    "absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full",
                    getStatusColor(attendanceRecord)
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="glass-card p-4">
        <h3 className="font-semibold mb-3">Legend</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-sm">Full Day (Check In + Check Out)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-sm">Partial Day (Check In Only)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-muted rounded-full"></div>
            <span className="text-sm">No attendance</span>
          </div>
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="glass-card p-4">
        <h3 className="font-semibold mb-3">This Month</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {attendance.filter(record => 
                record.employeeId === employeeId && 
                record.date.startsWith(format(currentDate, 'yyyy-MM')) &&
                record.checkIn && record.checkOut
              ).length}
            </div>
            <div className="text-sm text-muted-foreground">Full Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {attendance.filter(record => 
                record.employeeId === employeeId && 
                record.date.startsWith(format(currentDate, 'yyyy-MM')) &&
                record.checkIn && !record.checkOut
              ).length}
            </div>
            <div className="text-sm text-muted-foreground">Partial Days</div>
          </div>
        </div>
      </div>
    </div>
  );
};
