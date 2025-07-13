import { useState, useEffect } from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { SupabaseService } from '@/services/supabaseService';
import { AttendanceWithEmployee } from '@/types/employee';
import { format } from 'date-fns';

export const AttendanceTab = () => {
  const [attendance, setAttendance] = useState<AttendanceWithEmployee[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttendance();
  }, [selectedDate]);

  const loadAttendance = async () => {
    try {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const data = await SupabaseService.getAttendanceByDate(dateString);
      setAttendance(data);
    } catch (error) {
      console.error('Failed to load attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const todayAttendance = attendance;

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold gradient-text flex items-center justify-center gap-2">
          <Calendar size={24} />
          Attendance Overview
        </h1>
        <p className="text-muted-foreground">Monitor daily employee attendance</p>
      </div>

      {/* Date Selector */}
      <Card className="p-4 glass-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-1">Selected Date</h3>
            <p className="text-sm text-muted-foreground">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Calendar size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </Card>

      {/* Attendance Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 glass-card text-center">
          <Users size={24} className="mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold">{todayAttendance.length}</p>
          <p className="text-sm text-muted-foreground">Total Records</p>
        </Card>
        <Card className="p-4 glass-card text-center">
          <Clock size={24} className="mx-auto mb-2 text-green-500" />
          <p className="text-2xl font-bold">{todayAttendance.filter(r => r.status === 'present').length}</p>
          <p className="text-sm text-muted-foreground">Present</p>
        </Card>
      </div>

      {/* Attendance Records */}
      <div className="space-y-3">
        <h3 className="font-semibold text-primary">
          Attendance Records - {format(selectedDate, 'MMM d, yyyy')}
        </h3>
        
        {todayAttendance.length === 0 ? (
          <Card className="p-8 text-center glass-card">
            <Calendar size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Records Found</h3>
            <p className="text-muted-foreground">No attendance records for this date.</p>
          </Card>
        ) : (
          todayAttendance.map((record) => (
            <Card key={record.id} className="p-4 glass-card">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{record.employee.name}</h4>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                    {record.check_in && (
                      <span>In: {format(new Date(record.check_in), 'HH:mm')}</span>
                    )}
                    {record.check_out && (
                      <span>Out: {format(new Date(record.check_out), 'HH:mm')}</span>
                    )}
                  </div>
                  {record.work_description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {record.work_description}
                    </p>
                  )}
                </div>
                <Badge 
                  variant={
                    record.status === 'present' ? 'default' : 
                    record.status === 'partial' ? 'secondary' : 'destructive'
                  }
                >
                  {record.status}
                </Badge>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};