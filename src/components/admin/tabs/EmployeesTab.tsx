import { useState, useEffect } from 'react';
import { Users, MoreVertical, UserCheck, UserX, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FirebaseService } from '@/services/firebaseService';
import { EmployeeProfile } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';

export const EmployeesTab = () => {
  const [employees, setEmployees] = useState<EmployeeProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = FirebaseService.subscribeToEmployees((employeeData) => {
      setEmployees(employeeData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleToggleStatus = async (employeeId: string, currentStatus: boolean) => {
    try {
      await FirebaseService.toggleEmployeeStatus(employeeId, !currentStatus);
      toast({
        title: "Employee Status Updated",
        description: `Employee ${!currentStatus ? 'activated' : 'deactivated'} successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update employee status",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEmployee = async (employeeId: string, employeeName: string) => {
    if (window.confirm(`Are you sure you want to delete ${employeeName}? This action cannot be undone.`)) {
      try {
        await FirebaseService.deleteEmployee(employeeId);
        toast({
          title: "Employee Deleted",
          description: `${employeeName} has been removed from the system`
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete employee",
          variant: "destructive"
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold gradient-text flex items-center justify-center gap-2">
          <Users size={24} />
          Employee Management
        </h1>
        <p className="text-muted-foreground">
          {employees.length} total employees • {employees.filter(e => e.isActive).length} active
        </p>
      </div>

      {/* Employee List */}
      <div className="space-y-3">
        {employees.length === 0 ? (
          <Card className="p-8 text-center glass-card">
            <Users size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Employees Registered</h3>
            <p className="text-muted-foreground">Employees will appear here once they register through the main app.</p>
          </Card>
        ) : (
          employees.map((employee) => (
            <Card key={employee.id} className="p-4 glass-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={employee.profilePhoto} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-blue-500 text-white">
                      {employee.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{employee.name}</h3>
                    <p className="text-sm text-muted-foreground">{employee.jobRole}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={employee.isActive ? "default" : "secondary"}>
                        {employee.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {employee.gender} • Joined {new Date(employee.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background border-white/10">
                    <DropdownMenuItem
                      onClick={() => handleToggleStatus(employee.id, employee.isActive)}
                      className="flex items-center space-x-2"
                    >
                      {employee.isActive ? (
                        <>
                          <UserX size={16} />
                          <span>Deactivate</span>
                        </>
                      ) : (
                        <>
                          <UserCheck size={16} />
                          <span>Activate</span>
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteEmployee(employee.id, employee.name)}
                      className="flex items-center space-x-2 text-destructive"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};