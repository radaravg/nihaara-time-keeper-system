import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, User } from 'lucide-react';
import { Employee } from '@/types/employee';
import { SupabaseService } from '@/services/supabaseService';
import { toast } from '@/hooks/use-toast';

interface OnboardingFormProps {
  onComplete: (employee: Employee) => void;
}

const ROLES = [
  'Senior Architect',
  'Interior Designer', 
  'Architect',
  'Accountant',
  'Site Supervisor',
  'Driver',
  'Other'
];

const GENDERS = ['Male', 'Female', 'Other'];

export function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    role: '',
    profile_picture_url: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.gender || !formData.role) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const employee = await SupabaseService.createEmployee(formData);
      toast({
        title: "Welcome to NAT!",
        description: "Your profile has been created successfully."
      });
      onComplete(employee);
    } catch (error) {
      console.error('Failed to create employee:', error);
      toast({
        title: "Error",
        description: "Failed to create your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoCapture = () => {
    // For now, just set a placeholder
    setFormData(prev => ({ ...prev, profile_picture_url: '/placeholder-avatar.png' }));
    toast({
      title: "Photo Feature",
      description: "Photo capture will be implemented soon!"
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-card to-background">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
            <span className="text-2xl font-bold text-white">NAT</span>
          </div>
          <CardTitle className="text-2xl gradient-text">Welcome to NAT</CardTitle>
          <p className="text-muted-foreground">Let's set up your profile</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Photo */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center border-2 border-dashed border-primary/50">
                {formData.profile_picture_url ? (
                  <img src={formData.profile_picture_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePhotoCapture}
                className="mobile-tap"
              >
                <Camera className="w-4 h-4 mr-2" />
                Take Photo
              </Button>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                className="mobile-tap"
                required
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                <SelectTrigger className="mobile-tap">
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Job Role *</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                <SelectTrigger className="mobile-tap">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full mobile-tap"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Profile...' : 'Complete Setup'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}