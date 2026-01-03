// BikeWerkstatt Demo - localStorage Operations

import { Booking, BookingStatus } from '@/types';

const STORAGE_KEY = 'bikewerkstatt_bookings';

// Generate unique ID
export function generateId(): string {
    return `bk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Get all bookings from localStorage
export function getBookings(): Booking[] {
    if (typeof window === 'undefined') return [];

    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        return JSON.parse(data) as Booking[];
    } catch (error) {
        console.error('Error reading bookings from storage:', error);
        return [];
    }
}

// Save a new booking
export function saveBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Booking {
    const bookings = getBookings();

    const newBooking: Booking = {
        ...booking,
        id: generateId(),
        createdAt: new Date().toISOString(),
    };

    bookings.push(newBooking);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));

    return newBooking;
}

// Update a booking's status
export function updateBookingStatus(id: string, status: BookingStatus): Booking | null {
    const bookings = getBookings();
    const index = bookings.findIndex(b => b.id === id);

    if (index === -1) return null;

    bookings[index].status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));

    return bookings[index];
}

// Delete a booking
export function deleteBooking(id: string): boolean {
    const bookings = getBookings();
    const filtered = bookings.filter(b => b.id !== id);

    if (filtered.length === bookings.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
}

// Reset all bookings (for demo purposes)
export function resetBookings(): void {
    localStorage.removeItem(STORAGE_KEY);
}

// Check if a time slot has a conflict with existing bookings
export function hasConflict(
    date: string,
    time: string,
    durationMinutes: number,
    bufferMinutes: number,
    excludeBookingId?: string
): boolean {
    const bookings = getBookings().filter(b =>
        b.status !== 'canceled' &&
        b.date === date &&
        b.id !== excludeBookingId
    );

    if (bookings.length === 0) return false;

    const requestedStart = timeToMinutes(time);
    const requestedEnd = requestedStart + durationMinutes + bufferMinutes;

    for (const booking of bookings) {
        const existingStart = timeToMinutes(booking.time);
        const existingEnd = existingStart + booking.appointmentType.durationMinutes + booking.appointmentType.bufferMinutes;

        // Check for overlap
        if (requestedStart < existingEnd && requestedEnd > existingStart) {
            return true;
        }
    }

    return false;
}

// Get bookings for a specific date
export function getBookingsForDate(date: string): Booking[] {
    return getBookings().filter(b => b.date === date && b.status !== 'canceled');
}

// Helper: Convert HH:MM to minutes since midnight
function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}
