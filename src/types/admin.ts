export interface AdminSession {
  isAuthenticated: boolean;
  loginTime: Date;
}

export interface EmployeeProfile {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  jobRole: string;
  profilePhoto?: string;
  createdAt: Date;
  isActive: boolean;
  lastActivity?: Date;
}

export interface AttendanceLog {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn?: Date;
  checkOut?: Date;
  workDescription?: string;
  status: 'present' | 'absent' | 'partial';
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface ResetRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  adminResponse?: string;
  processedAt?: Date;
}

export interface AdminNote {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  priority: 'low' | 'medium' | 'high';
  isImportant: boolean;
}

export interface ExportOptions {
  type: 'pdf' | 'excel';
  period: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  employeeIds?: string[];
}