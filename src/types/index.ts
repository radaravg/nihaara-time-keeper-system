
export interface Employee {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  jobRole: string;
  profilePhoto?: string;
  createdAt: Date;
  isActive: boolean;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: Date;
  checkOut?: Date;
  workDescription?: string;
  status: 'present' | 'absent' | 'partial';
}

export interface Task {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
  createdAt: Date;
}

export interface ResetRequest {
  id: string;
  employeeId: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  adminResponse?: string;
}

export const JOB_ROLES = [
  'SENIOR ARCHITECT',
  'INTERIOR DESIGNER', 
  'ARCHITECT',
  'ACCOUNTANT',
  'SITE SUPERVISOR',
  'DRIVER',
  'OTHER'
] as const;
