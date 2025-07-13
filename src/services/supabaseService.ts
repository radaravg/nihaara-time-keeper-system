import { supabase } from '@/integrations/supabase/client';
import { Employee, Attendance, AttendanceWithEmployee } from '@/types/employee';

export class SupabaseService {
  // Employee methods
  static async createEmployee(employee: Omit<Employee, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<Employee> {
    const { data, error } = await supabase
      .from('employees')
      .insert(employee)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getEmployee(id: string): Promise<Employee | null> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data;
  }

  static async getAllEmployees(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee> {
    const { data, error } = await supabase
      .from('employees')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Attendance methods
  static async createAttendance(attendance: Omit<Attendance, 'id' | 'created_at' | 'updated_at'>): Promise<Attendance> {
    const { data, error } = await supabase
      .from('attendance')
      .insert(attendance)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getTodayAttendance(employeeId: string): Promise<Attendance | null> {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('date', today)
      .single();
    
    if (error) return null;
    return data;
  }

  static async updateAttendance(id: string, updates: Partial<Attendance>): Promise<Attendance> {
    const { data, error } = await supabase
      .from('attendance')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getAllAttendanceWithEmployees(): Promise<AttendanceWithEmployee[]> {
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        *,
        employee:employees(*)
      `)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getAttendanceByDate(date: string): Promise<AttendanceWithEmployee[]> {
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        *,
        employee:employees(*)
      `)
      .eq('date', date)
      .order('check_in', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  static async getEmployeeAttendance(employeeId: string): Promise<Attendance[]> {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('employee_id', employeeId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
}