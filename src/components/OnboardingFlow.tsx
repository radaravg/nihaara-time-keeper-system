
import { useState } from 'react';
import { User, Camera, Briefcase } from 'lucide-react';
import { Employee, JOB_ROLES } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface OnboardingFlowProps {
  onComplete: (employee: Employee) => void;
}

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    gender: '' as 'male' | 'female' | 'other',
    jobRole: '',
    customRole: '',
    profilePhoto: ''
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleComplete = () => {
    const employee: Employee = {
      id: crypto.randomUUID(),
      name: form.name.charAt(0).toUpperCase() + form.name.slice(1).toLowerCase(),
      gender: form.gender,
      jobRole: form.jobRole === 'OTHER' ? form.customRole : form.jobRole,
      profilePhoto: form.profilePhoto,
      createdAt: new Date(),
      isActive: true
    };
    
    onComplete(employee);
  };

  const canProceedStep1 = form.name.trim().length >= 2;
  const canProceedStep2 = form.gender && form.jobRole && (form.jobRole !== 'OTHER' || form.customRole.trim());
  const canComplete = canProceedStep1 && canProceedStep2;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-card to-background">
      <div className="w-full max-w-md">
        {/* Welcome Header */}
        <div className="text-center mb-8 animate-slide-in">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">NAT</span>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Welcome to NAT</h1>
          <p className="text-muted-foreground">Nihaara Attendance Tracker</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  i <= step ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="glass-card p-6 animate-slide-in">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <User size={32} className="text-primary mx-auto mb-3" />
                <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
                <p className="text-sm text-muted-foreground">Let's get to know you better</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-secondary/50 border-white/10"
                    style={{ textTransform: 'capitalize' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Gender</label>
                  <Select value={form.gender} onValueChange={(value: 'male' | 'female' | 'other') => 
                    setForm(prev => ({ ...prev, gender: value }))
                  }>
                    <SelectTrigger className="bg-secondary/50 border-white/10">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/20">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleNext}
                disabled={!canProceedStep1}
                className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90"
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <Briefcase size={32} className="text-primary mx-auto mb-3" />
                <h2 className="text-xl font-semibold mb-2">Job Information</h2>
                <p className="text-sm text-muted-foreground">What's your role at Nihaara?</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Job Role</label>
                  <Select value={form.jobRole} onValueChange={(value) => 
                    setForm(prev => ({ ...prev, jobRole: value, customRole: value === 'OTHER' ? prev.customRole : '' }))
                  }>
                    <SelectTrigger className="bg-secondary/50 border-white/10">
                      <SelectValue placeholder="Select your job role" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/20">
                      {JOB_ROLES.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {form.jobRole === 'OTHER' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Custom Role</label>
                    <Input
                      placeholder="Enter your job role"
                      value={form.customRole}
                      onChange={(e) => setForm(prev => ({ ...prev, customRole: e.target.value }))}
                      className="bg-secondary/50 border-white/10"
                      style={{ textTransform: 'capitalize' }}
                    />
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1 border-white/20">
                  Back
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={!canProceedStep2}
                  className="flex-1 bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <Camera size={32} className="text-primary mx-auto mb-3" />
                <h2 className="text-xl font-semibold mb-2">Profile Photo</h2>
                <p className="text-sm text-muted-foreground">Add a photo to complete your profile</p>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-primary to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  {form.profilePhoto ? (
                    <img 
                      src={form.profilePhoto} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User size={48} className="text-white" />
                  )}
                </div>
                
                <Button
                  onClick={() => {
                    // In a real app, this would open camera
                    console.log('Photo capture requested');
                  }}
                  variant="outline"
                  className="border-white/20"
                >
                  <Camera size={16} className="mr-2" />
                  Take Photo
                </Button>
                
                <p className="text-xs text-muted-foreground mt-2">
                  You can add a photo later from your profile
                </p>
              </div>

              <div className="flex space-x-3">
                <Button onClick={() => setStep(2)} variant="outline" className="flex-1 border-white/20">
                  Back
                </Button>
                <Button 
                  onClick={handleComplete}
                  disabled={!canComplete}
                  className="flex-1 bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90"
                >
                  Complete Setup
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to use NAT for attendance tracking
          </p>
        </div>
      </div>
    </div>
  );
};
