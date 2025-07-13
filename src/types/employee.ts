export interface Employee {
  id: string;
  name: string;
  gender: string;
  role: string;
  profile_picture_url?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  employee_id: string;
  date: string;
  check_in?: string;
  check_out?: string;
  work_description?: string;
  completion_notes?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceWithEmployee extends Attendance {
  employee: Employee;
}