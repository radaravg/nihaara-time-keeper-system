
import { useState, useEffect } from 'react';
import { SwipeToMark } from './SwipeToMark';
import { Clock, MapPin } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AttendanceRecord } from '@/types';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface AttendanceTabProps {
  employeeId: string;
}

export const AttendanceTab = ({ employeeId }: AttendanceTabProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendance, setAttendance] = useLocalStorage<AttendanceRecord[]>('attendance', []);
  const [showWorkDialog, setShowWorkDialog] = useState(false);
  const [workDescription, setWorkDescription] = useState('');
  const [pendingAction, setPendingAction] = useState<'checkin' | 'checkout' | null>(null);

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayAttendance = attendance.find(record => 
    record.employeeId === employeeId && record.date === today
  );

  const canCheckOut = todayAttendance?.checkIn && !todayAttendance?.checkOut && 
    todayAttendance.checkIn && 
    (new Date().getTime() - new Date(todayAttendance.checkIn).getTime()) > 10 * 60 * 1000; // 10 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate Kolkata time
      const now = new Date();
      now.setHours(now.getHours() + 5.5); // IST offset
      setCurrentTime(now);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAttendanceAction = () => {
    if (todayAttendance?.checkIn && !todayAttendance?.checkOut) {
      // Check out
      setPendingAction('checkout');
      setShowWorkDialog(true);
    } else if (!todayAttendance?.checkIn) {
      // Check in
      setPendingAction('checkin');
      setShowWorkDialog(true);
    }
  };

  const submitAttendance = () => {
    const now = new Date();
    
    if (pendingAction === 'checkin') {
      const newRecord: AttendanceRecord = {
        id: crypto.randomUUID(),
        employeeId,
        date: today,
        checkIn: now,
        workDescription,
        status: 'present'
      };
      
      setAttendance(prev => [...prev, newRecord]);
    } else if (pendingAction === 'checkout' && todayAttendance) {
      setAttendance(prev => prev.map(record => 
        record.id === todayAttendance.id 
          ? { ...record, checkOut: now, workDescription: workDescription }
          : record
      ));
    }

    setWorkDescription('');
    setShowWorkDialog(false);
    setPendingAction(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Good Morning!</h1>
        <p className="text-muted-foreground">Ready to start your productive day?</p>
      </div>

      {/* Current Time Card */}
      <div className="glass-card p-6 text-center floating-card">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Clock size={20} className="text-primary" />
          <span className="text-sm text-muted-foreground">Kolkata Time</span>
        </div>
        <div className="text-4xl font-bold gradient-text">
          {format(currentTime, 'HH:mm:ss')}
        </div>
        <div className="text-lg text-muted-foreground mt-1">
          {format(currentTime, 'EEEE, MMMM do, yyyy')}
        </div>
      </div>

      {/* Location Card */}
      <div className="glass-card p-4 flex items-center space-x-3">
        <MapPin size={20} className="text-primary" />
        <div>
          <p className="font-medium">Nihaara Architecture Firm</p>
          <p className="text-sm text-muted-foreground">Kolkata, West Bengal</p>
        </div>
      </div>

      {/* Attendance Status */}
      {todayAttendance && (
        <div className="glass-card p-4 space-y-2">
          <h3 className="font-semibold text-primary">Today's Attendance</h3>
          <div className="space-y-1">
            {todayAttendance.checkIn && (
              <p className="text-sm">
                <span className="text-muted-foreground">Check In: </span>
                <span className="text-green-400">{format(new Date(todayAttendance.checkIn), 'HH:mm')}</span>
              </p>
            )}
            {todayAttendance.checkOut && (
              <p className="text-sm">
                <span className="text-muted-foreground">Check Out: </span>
                <span className="text-red-400">{format(new Date(todayAttendance.checkOut), 'HH:mm')}</span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Swipe to Mark */}
      <div className="glass-card p-6">
        <SwipeToMark
          onSwipe={handleAttendanceAction}
          disabled={todayAttendance?.checkOut !== undefined}
          isCheckedOut={!!todayAttendance?.checkIn && !todayAttendance?.checkOut}
          onCheckOut={handleAttendanceAction}
        />
        
        {todayAttendance?.checkOut && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Attendance marked for today. See you tomorrow! 👋
          </p>
        )}
        
        {todayAttendance?.checkIn && !todayAttendance?.checkOut && !canCheckOut && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Check out available in {Math.ceil((10 * 60 * 1000 - (new Date().getTime() - new Date(todayAttendance.checkIn).getTime())) / 60000)} minutes
          </p>
        )}
      </div>

      {/* Work Description Dialog */}
      <Dialog open={showWorkDialog} onOpenChange={setShowWorkDialog}>
        <DialogContent className="glass-card border-white/20">
          <DialogHeader>
            <DialogTitle className="gradient-text">
              {pendingAction === 'checkin' ? "What's today's work?" : "How was your day?"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder={pendingAction === 'checkin' 
                ? "Describe what you'll be working on today..." 
                : "Describe what you accomplished today..."}
              value={workDescription}
              onChange={(e) => setWorkDescription(e.target.value)}
              className="bg-secondary/50 border-white/10 min-h-[100px]"
            />
            <Button 
              onClick={submitAttendance}
              className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90"
              disabled={!workDescription.trim()}
            >
              {pendingAction === 'checkin' ? 'Check In' : 'Check Out'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
