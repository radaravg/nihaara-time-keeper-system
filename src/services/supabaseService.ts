import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type Employee = Tables<'employees'>;
export type Attendance = Tables<'attendance'>;

export class SupabaseService {
  // Employee Management
  static async getEmployees(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching employees:', error);
      return [];
    }
    
    return data || [];
  }

  static subscribeToEmployees(callback: (employees: Employee[]) => void) {
    // Initial fetch
    this.getEmployees().then(callback);
    
    // Real-time subscription
    const channel = supabase
      .channel('employees-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'employees'
      }, () => {
        this.getEmployees().then(callback);
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }

  static async toggleEmployeeStatus(employeeId: string, status: 'active' | 'inactive') {
    const { error } = await supabase
      .from('employees')
      .update({ status })
      .eq('id', employeeId);
    
    if (error) {
      throw new Error('Failed to update employee status');
    }
  }

  static async deleteEmployee(employeeId: string) {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', employeeId);
    
    if (error) {
      throw new Error('Failed to delete employee');
    }
  }

  // Attendance Management
  static async getAttendanceWithEmployees(date?: string): Promise<any[]> {
    let query = supabase
      .from('attendance')
      .select(`
        *,
        employees (
          name,
          role
        )
      `)
      .order('check_in', { ascending: false });
    
    if (date) {
      query = query.eq('date', date);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching attendance:', error);
      return [];
    }
    
    return data || [];
  }

  static subscribeToAttendance(callback: (attendance: any[]) => void) {
    // Initial fetch
    this.getAttendanceWithEmployees().then(callback);
    
    // Real-time subscription
    const channel = supabase
      .channel('attendance-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'attendance'
      }, () => {
        this.getAttendanceWithEmployees().then(callback);
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }

  static async getAttendanceByDateRange(startDate: string, endDate: string, employeeId?: string) {
    let query = supabase
      .from('attendance')
      .select(`
        *,
        employees (
          name,
          role
        )
      `)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });
    
    if (employeeId) {
      query = query.eq('employee_id', employeeId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching attendance by date range:', error);
      return [];
    }
    
    return data || [];
  }
}