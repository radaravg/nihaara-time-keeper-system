import { useState } from 'react';
import { Lock, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AdminAuthService } from '@/services/adminAuth';
import { useToast } from '@/hooks/use-toast';

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await AdminAuthService.login(password);
      
      if (success) {
        toast({
          title: "Welcome to NAT Admin",
          description: "Successfully logged in to the admin dashboard"
        });
        onLogin();
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid admin password. Please try again.",
          variant: "destructive"
        });
        setPassword('');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to authenticate. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-background p-6">
      <Card className="w-full max-w-md p-8 glass-card">
        <div className="text-center space-y-6">
          {/* Logo */}
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-blue-500 rounded-full flex items-center justify-center animate-pulse-glow">
            <Building2 size={32} className="text-white" />
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold gradient-text">NAT Admin</h1>
            <p className="text-muted-foreground">Nihaara Attendance Tracker</p>
            <p className="text-sm text-muted-foreground/80">Admin Dashboard Access</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-secondary/50 border-white/10"
                required
                disabled={isLoading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90"
              disabled={isLoading || !password.trim()}
            >
              {isLoading ? "Authenticating..." : "Access Admin Dashboard"}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-xs text-muted-foreground/60 space-y-1">
            <p>Secure access for authorized personnel only</p>
            <p>© 2024 Nihaara Architecture</p>
          </div>
        </div>
      </Card>
    </div>
  );
};