
import { useState } from 'react';
import { User, Edit, Camera, RotateCcw, Briefcase } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Employee, JOB_ROLES } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ProfileTabProps {
  employee: Employee;
  onUpdateEmployee: (employee: Employee) => void;
}

export const ProfileTab = ({ employee, onUpdateEmployee }: ProfileTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetReason, setResetReason] = useState('');
  const [editForm, setEditForm] = useState({
    name: employee.name,
    gender: employee.gender,
    jobRole: employee.jobRole
  });

  const handleSave = () => {
    const updatedEmployee = {
      ...employee,
      ...editForm,
      name: editForm.name.charAt(0).toUpperCase() + editForm.name.slice(1).toLowerCase()
    };
    onUpdateEmployee(updatedEmployee);
    setIsEditing(false);
  };

  const handleReset = () => {
    if (!resetReason.trim()) return;
    
    // In a real app, this would send to admin
    console.log('Reset request sent:', { employeeId: employee.id, reason: resetReason });
    setResetReason('');
    setShowResetDialog(false);
    // Show success message
  };

  const handlePhotoCapture = () => {
    // In a real app, this would open camera
    console.log('Photo capture requested');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <User size={24} className="text-primary" />
          <h1 className="text-2xl font-bold gradient-text">Profile</h1>
        </div>
        <p className="text-muted-foreground">Manage your personal information</p>
      </div>

      {/* Profile Card */}
      <div className="glass-card p-6 space-y-6">
        {/* Profile Photo */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-blue-500 rounded-full flex items-center justify-center">
              {employee.profilePhoto ? (
                <img 
                  src={employee.profilePhoto} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={40} className="text-white" />
              )}
            </div>
            <button
              onClick={handlePhotoCapture}
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <Camera size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Profile Information */}
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                className="bg-secondary/50 border-white/10"
                style={{ textTransform: 'capitalize' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <Select value={editForm.gender} onValueChange={(value: 'male' | 'female' | 'other') => 
                setEditForm(prev => ({ ...prev, gender: value }))
              }>
                <SelectTrigger className="bg-secondary/50 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/20">
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Job Role</label>
              <Select value={editForm.jobRole} onValueChange={(value) => 
                setEditForm(prev => ({ ...prev, jobRole: value }))
              }>
                <SelectTrigger className="bg-secondary/50 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/20">
                  {JOB_ROLES.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-3">
              <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-primary to-blue-500">
                Save Changes
              </Button>
              <Button 
                onClick={() => setIsEditing(false)} 
                variant="outline" 
                className="flex-1 border-white/20"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">{employee.name}</h3>
                <p className="text-muted-foreground capitalize">{employee.gender}</p>
              </div>
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="border-white/20">
                <Edit size={16} className="mr-2" />
                Edit
              </Button>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-secondary/30 rounded-lg">
              <Briefcase size={20} className="text-primary" />
              <div>
                <p className="font-medium">{employee.jobRole}</p>
                <p className="text-sm text-muted-foreground">Job Role</p>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Employee ID: {employee.id.slice(0, 8)}</p>
              <p>Joined: {new Date(employee.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </div>

      {/* Salary Section */}
      <div className="glass-card p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Salary Information</h3>
        <p className="text-muted-foreground mb-4">Feature coming soon...</p>
        <div className="p-8 bg-secondary/30 rounded-xl">
          <p className="text-2xl">💰</p>
          <p className="text-sm text-muted-foreground mt-2">
            Salary details will be available in the next update
          </p>
        </div>
      </div>

      {/* Reset Request */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-3 text-orange-400">Account Reset</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Need to reset your account? Send a request to the admin.
        </p>
        <Button 
          onClick={() => setShowResetDialog(true)}
          variant="outline"
          className="w-full border-orange-400/30 text-orange-400 hover:bg-orange-400/10"
        >
          <RotateCcw size={16} className="mr-2" />
          Request Account Reset
        </Button>
      </div>

      {/* Reset Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="glass-card border-white/20">
          <DialogHeader>
            <DialogTitle className="gradient-text">Request Account Reset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please provide a reason for requesting an account reset. This will be sent to the admin for review.
            </p>
            <Textarea
              placeholder="Reason for reset request..."
              value={resetReason}
              onChange={(e) => setResetReason(e.target.value)}
              className="bg-secondary/50 border-white/10 min-h-[100px]"
            />
            <Button 
              onClick={handleReset}
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={!resetReason.trim()}
            >
              Send Reset Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
