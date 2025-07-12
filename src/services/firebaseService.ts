import { supabase } from '@/integrations/supabase/client';
import { EmployeeProfile, AttendanceLog, ResetRequest } from '@/types/admin';

export class FirebaseService {
  // Employee Management - Using mock data since Firebase isn't properly configured
  static subscribeToEmployees(callback: (employees: EmployeeProfile[]) => void) {
    // Mock data for demo - replace with real Supabase data later
    const mockEmployees: EmployeeProfile[] = [
      {
        id: '1',
        name: 'John Doe',
        jobRole: 'Senior Architect',
        gender: 'male',
        profilePhoto: '',
        isActive: true,
        createdAt: new Date('2024-01-15'),
        lastActivity: new Date()
      },
      {
        id: '2', 
        name: 'Sarah Wilson',
        jobRole: 'Interior Designer',
        gender: 'female',
        profilePhoto: '',
        isActive: true,
        createdAt: new Date('2024-01-20'),
        lastActivity: new Date()
      },
      {
        id: '3',
        name: 'Mike Johnson',
        jobRole: 'Site Supervisor', 
        gender: 'male',
        profilePhoto: '',
        isActive: false,
        createdAt: new Date('2024-02-01'),
        lastActivity: new Date('2024-02-15')
      }
    ];
    
    // Simulate async loading
    setTimeout(() => {
      callback(mockEmployees);
    }, 500);
    
    // Return unsubscribe function
    return () => {};
  }

  static async toggleEmployeeStatus(employeeId: string, isActive: boolean) {
    // Mock implementation - would update Supabase in real app
    console.log(`Toggling employee ${employeeId} status to ${isActive}`);
    return Promise.resolve();
  }

  static async deleteEmployee(employeeId: string) {
    // Mock implementation - would delete from Supabase in real app  
    console.log(`Deleting employee ${employeeId}`);
    return Promise.resolve();
  }

  // Attendance Management - Using mock data
  static subscribeToAttendance(callback: (attendance: AttendanceLog[]) => void) {
    // Mock attendance data
    const today = new Date().toISOString().split('T')[0];
    const mockAttendance: AttendanceLog[] = [
      {
        id: '1',
        employeeId: '1',
        employeeName: 'John Doe',
        date: today,
        checkIn: new Date(`${today}T09:00:00`),
        checkOut: new Date(`${today}T17:30:00`),
        workDescription: 'Working on building blueprints and structural design',
        status: 'present'
      },
      {
        id: '2',
        employeeId: '2', 
        employeeName: 'Sarah Wilson',
        date: today,
        checkIn: new Date(`${today}T09:15:00`),
        checkOut: new Date(`${today}T17:00:00`),
        workDescription: 'Interior design consultation with clients',
        status: 'present'
      }
    ];
    
    // Simulate async loading
    setTimeout(() => {
      callback(mockAttendance);
    }, 300);
    
    return () => {};
  }

  static async getAttendanceByDateRange(startDate: Date, endDate: Date, employeeId?: string) {
    // Mock implementation for date range queries
    console.log('Getting attendance from', startDate, 'to', endDate, 'for employee', employeeId);
    return [];
  }

  // Reset Requests Management - Using mock data
  static subscribeToResetRequests(callback: (requests: ResetRequest[]) => void) {
    // Mock reset requests
    const mockRequests: ResetRequest[] = [
      {
        id: '1',
        employeeId: '3',
        employeeName: 'Mike Johnson',
        
        reason: 'Lost access to my account after phone reset. Need to update profile information.',
        status: 'pending',
        createdAt: new Date(),
        processedAt: undefined
      }
    ];
    
    setTimeout(() => {
      callback(mockRequests);
    }, 200);
    
    return () => {};
  }

  static async processResetRequest(
    requestId: string, 
    status: 'approved' | 'rejected', 
    adminResponse?: string
  ) {
    // Mock implementation
    console.log(`Processing reset request ${requestId} with status ${status}`);
    return Promise.resolve();
  }
}