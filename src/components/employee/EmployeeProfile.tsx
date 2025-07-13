import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Briefcase, Calendar, Phone, Mail, MapPin } from 'lucide-react';
import { Employee } from '@/types/employee';

interface EmployeeProfileProps {
  employee: Employee;
  onLogout: () => void;
}

export function EmployeeProfile({ employee, onLogout }: EmployeeProfileProps) {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-blue-500 rounded-full flex items-center justify-center">
              {employee.profile_picture_url ? (
                <img 
                  src={employee.profile_picture_url} 
                  alt={employee.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold gradient-text">{employee.name}</h2>
              <p className="text-muted-foreground">{employee.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Details */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Gender</p>
              <p className="font-medium">{employee.gender}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Position</p>
              <p className="font-medium">{employee.role}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Joined</p>
              <p className="font-medium">
                {new Date(employee.created_at).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Info */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Contact</p>
              <p className="font-medium">+91 XXX XXX XXXX</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">info@nihaara.com</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Office</p>
              <p className="font-medium">Nihaara Technologies Pvt Ltd</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Salary Tab */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Salary Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-xl font-semibold gradient-text mb-2">Coming Soon!</h3>
            <p className="text-muted-foreground">
              Salary details and payslips will be available soon.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Button 
        onClick={onLogout}
        variant="destructive"
        className="w-full mobile-tap"
      >
        Logout
      </Button>
    </div>
  );
}