import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronRight, Clock, CheckCircle } from 'lucide-react';
import { Employee, Attendance } from '@/types/employee';
import { SupabaseService } from '@/services/supabaseService';
import { toast } from '@/hooks/use-toast';

interface SwipeAttendanceProps {
  employee: Employee;
}

export function SwipeAttendance({ employee }: SwipeAttendanceProps) {
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [taskDescription, setTaskDescription] = useState('');
  const [completionNotes, setCompletionNotes] = useState('');
  const [canCheckOut, setCanCheckOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentTime = new Date().toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: true,
    hour: '2-digit',
    minute: '2-digit'
  });

  const currentDate = new Date().toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  });

  useEffect(() => {
    loadTodayAttendance();
  }, [employee.id]);

  useEffect(() => {
    // Enable check-out after 10 minutes of check-in
    if (todayAttendance?.check_in && !todayAttendance.check_out) {
      const checkInTime = new Date(todayAttendance.check_in);
      const tenMinutesLater = new Date(checkInTime.getTime() + 10 * 60 * 1000);
      const now = new Date();
      
      if (now >= tenMinutesLater) {
        setCanCheckOut(true);
      } else {
        const timeout = setTimeout(() => {
          setCanCheckOut(true);
        }, tenMinutesLater.getTime() - now.getTime());
        
        return () => clearTimeout(timeout);
      }
    }
  }, [todayAttendance]);

  const loadTodayAttendance = async () => {
    try {
      const attendance = await SupabaseService.getTodayAttendance(employee.id);
      setTodayAttendance(attendance);
    } catch (error) {
      console.error('Failed to load attendance:', error);
    }
  };

  const handleCheckIn = () => {
    setShowTaskDialog(true);
  };

  const handleCheckOut = () => {
    setShowCheckoutDialog(true);
  };

  const submitCheckIn = async () => {
    if (!taskDescription.trim()) {
      toast({
        title: "Task Required",
        description: "Please describe today's task.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const checkInTime = new Date().toISOString();
      
      const attendance = await SupabaseService.createAttendance({
        employee_id: employee.id,
        date: today,
        check_in: checkInTime,
        work_description: taskDescription,
        status: 'present'
      });
      
      setTodayAttendance(attendance);
      setShowTaskDialog(false);
      setTaskDescription('');
      
      toast({
        title: "Checked In Successfully!",
        description: `Welcome ${employee.name}! Have a productive day.`
      });
    } catch (error) {
      console.error('Check-in failed:', error);
      toast({
        title: "Check-in Failed",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const submitCheckOut = async () => {
    if (!completionNotes.trim()) {
      toast({
        title: "Completion Notes Required",
        description: "Please describe what you completed today.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const checkOutTime = new Date().toISOString();
      
      const updatedAttendance = await SupabaseService.updateAttendance(todayAttendance!.id, {
        check_out: checkOutTime,
        completion_notes: completionNotes
      });
      
      setTodayAttendance(updatedAttendance);
      setShowCheckoutDialog(false);
      setCompletionNotes('');
      
      toast({
        title: "Checked Out Successfully!",
        description: `Great work today, ${employee.name}! Have a good evening.`
      });
    } catch (error) {
      console.error('Check-out failed:', error);
      toast({
        title: "Check-out Failed",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isCheckedIn = todayAttendance?.check_in && !todayAttendance?.check_out;
  const isCheckedOut = todayAttendance?.check_in && todayAttendance?.check_out;

  return (
    <div className="space-y-6">
      {/* Time Display */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold gradient-text">{currentTime}</div>
            <div className="text-sm text-muted-foreground">IST (Indian Standard Time)</div>
            <div className="text-lg font-medium">{currentDate}</div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Actions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Today's Attendance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!todayAttendance?.check_in && (
            <div className="swipe-slider h-16 p-2">
              <Button 
                onClick={handleCheckIn}
                className="w-full h-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl mobile-tap"
              >
                <ChevronRight className="w-6 h-6 mr-2" />
                Swipe to Check In
              </Button>
            </div>
          )}

          {isCheckedIn && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle className="w-5 h-5" />
                <span>Checked in at {new Date(todayAttendance.check_in!).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
              </div>
              
              {canCheckOut ? (
                <div className="swipe-slider h-16 p-2">
                  <Button 
                    onClick={handleCheckOut}
                    className="w-full h-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl mobile-tap"
                  >
                    <ChevronRight className="w-6 h-6 mr-2" />
                    Swipe to Check Out
                  </Button>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  Check-out will be available in a few minutes...
                </div>
              )}
            </div>
          )}

          {isCheckedOut && (
            <div className="space-y-2 text-center">
              <div className="flex items-center gap-2 text-green-500 justify-center">
                <CheckCircle className="w-5 h-5" />
                <span>Work completed for today!</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Checked out at {new Date(todayAttendance.check_out!).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>What's today's task?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="task">Describe your planned work for today</Label>
              <Textarea
                id="task"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="e.g., Working on architectural drawings for Project XYZ"
                className="mobile-tap"
              />
            </div>
            <Button 
              onClick={submitCheckIn} 
              className="w-full mobile-tap"
              disabled={isLoading}
            >
              {isLoading ? 'Checking In...' : 'Check In'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Check-out Dialog */}
      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>What did you complete today?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="completion">Describe what you accomplished</Label>
              <Textarea
                id="completion"
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                placeholder="e.g., Completed 3 architectural drawings and reviewed client feedback"
                className="mobile-tap"
              />
            </div>
            <Button 
              onClick={submitCheckOut} 
              className="w-full mobile-tap"
              disabled={isLoading}
            >
              {isLoading ? 'Checking Out...' : 'Check Out'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}