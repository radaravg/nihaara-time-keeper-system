import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc,
  where,
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { EmployeeProfile, AttendanceLog, ResetRequest } from '@/types/admin';

export class FirebaseService {
  // Employee Management
  static subscribeToEmployees(callback: (employees: EmployeeProfile[]) => void) {
    const q = query(collection(db, 'employees'), orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const employees: EmployeeProfile[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        employees.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastActivity: data.lastActivity?.toDate()
        } as EmployeeProfile);
      });
      callback(employees);
    });
  }

  static async toggleEmployeeStatus(employeeId: string, isActive: boolean) {
    const employeeRef = doc(db, 'employees', employeeId);
    await updateDoc(employeeRef, { isActive });
  }

  static async deleteEmployee(employeeId: string) {
    const employeeRef = doc(db, 'employees', employeeId);
    await deleteDoc(employeeRef);
  }

  // Attendance Management
  static subscribeToAttendance(callback: (attendance: AttendanceLog[]) => void) {
    const q = query(collection(db, 'attendance'), orderBy('date', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const attendance: AttendanceLog[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        attendance.push({
          id: doc.id,
          ...data,
          checkIn: data.checkIn?.toDate(),
          checkOut: data.checkOut?.toDate()
        } as AttendanceLog);
      });
      callback(attendance);
    });
  }

  static async getAttendanceByDateRange(startDate: Date, endDate: Date, employeeId?: string) {
    let q = query(
      collection(db, 'attendance'),
      where('date', '>=', startDate.toISOString().split('T')[0]),
      where('date', '<=', endDate.toISOString().split('T')[0]),
      orderBy('date', 'desc')
    );

    if (employeeId) {
      q = query(q, where('employeeId', '==', employeeId));
    }

    const snapshot = await getDocs(q);
    const attendance: AttendanceLog[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      attendance.push({
        id: doc.id,
        ...data,
        checkIn: data.checkIn?.toDate(),
        checkOut: data.checkOut?.toDate()
      } as AttendanceLog);
    });

    return attendance;
  }

  // Reset Requests Management
  static subscribeToResetRequests(callback: (requests: ResetRequest[]) => void) {
    const q = query(collection(db, 'resetRequests'), orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const requests: ResetRequest[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        requests.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          processedAt: data.processedAt?.toDate()
        } as ResetRequest);
      });
      callback(requests);
    });
  }

  static async processResetRequest(
    requestId: string, 
    status: 'approved' | 'rejected', 
    adminResponse?: string
  ) {
    const requestRef = doc(db, 'resetRequests', requestId);
    await updateDoc(requestRef, {
      status,
      adminResponse: adminResponse || '',
      processedAt: Timestamp.now()
    });
  }
}