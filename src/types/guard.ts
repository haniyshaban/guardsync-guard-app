export interface Guard {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  phone: string;
  photoUrl?: string;
  status: 'active' | 'on-break' | 'off-duty';
  currentShift?: Shift;
}

export interface Shift {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'missed';
}

export interface CheckInRecord {
  id: string;
  guardId: string;
  timestamp: string;
  type: 'check-in' | 'check-out';
  location: string;
  verificationMethod: 'facial' | 'manual';
  photoUrl?: string;
}
