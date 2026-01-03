// BikeWerkstatt Demo - TypeScript Types

export type BookingStatus = 'requested' | 'confirmed' | 'canceled';

export interface AppointmentType {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  bufferMinutes: number;
  icon: string;
}

export interface CustomerData {
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}

export interface Booking {
  id: string;
  appointmentType: AppointmentType;
  date: string; // ISO date string YYYY-MM-DD
  time: string; // HH:MM format
  customer: CustomerData;
  status: BookingStatus;
  createdAt: string; // ISO datetime string
}

export interface TimeSlot {
  time: string; // HH:MM format
  available: boolean;
}

export interface OpeningHours {
  open: string; // HH:MM
  close: string; // HH:MM
  closed: boolean;
}

export interface WeeklySchedule {
  [key: number]: OpeningHours; // 0 = Sunday, 1 = Monday, etc.
}

export interface BusinessConfig {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
}

export interface BookingRules {
  slotStepMinutes: number;
  leadTimeHours: number;
  maxDaysAhead: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface BookingFormData {
  appointmentType: AppointmentType | null;
  date: string | null;
  time: string | null;
  customer: CustomerData;
}
