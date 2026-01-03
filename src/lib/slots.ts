// BikeWerkstatt Demo - Slot Generation Logic

import { AppointmentType, TimeSlot } from '@/types';
import { bookingRules } from '@/config/appConfig';
import { getOpeningHours, isWithinLeadTime, addMinutes, compareTimes, getToday } from './time';
import { hasConflict } from './storage';

// Generate all possible time slots for a date and appointment type
export function generateTimeSlots(dateStr: string, appointmentType: AppointmentType): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const openingHours = getOpeningHours(dateStr);

    // If closed, return empty array
    if (openingHours.closed) {
        return slots;
    }

    const { open, close } = openingHours;
    const { slotStepMinutes } = bookingRules;
    const { durationMinutes, bufferMinutes } = appointmentType;
    const totalDuration = durationMinutes + bufferMinutes;

    let currentTime = open;
    const today = getToday();
    const isToday = dateStr === today;

    while (compareTimes(currentTime, close) < 0) {
        // Check if the appointment would end after closing
        const endTime = addMinutes(currentTime, totalDuration);
        if (compareTimes(endTime, close) > 0) {
            break;
        }

        // Check availability
        let available = true;

        // Check lead time for today
        if (isToday && !isWithinLeadTime(dateStr, currentTime)) {
            available = false;
        }

        // Check for conflicts with existing bookings
        if (available && hasConflict(dateStr, currentTime, durationMinutes, bufferMinutes)) {
            available = false;
        }

        slots.push({
            time: currentTime,
            available,
        });

        // Move to next slot
        currentTime = addMinutes(currentTime, slotStepMinutes);
    }

    return slots;
}

// Get only available slots
export function getAvailableSlots(dateStr: string, appointmentType: AppointmentType): TimeSlot[] {
    return generateTimeSlots(dateStr, appointmentType).filter(slot => slot.available);
}

// Check if any slots are available for a date
export function hasAvailableSlots(dateStr: string, appointmentType: AppointmentType): boolean {
    return getAvailableSlots(dateStr, appointmentType).length > 0;
}

// Get the next available slot for a date
export function getNextAvailableSlot(dateStr: string, appointmentType: AppointmentType): TimeSlot | null {
    const availableSlots = getAvailableSlots(dateStr, appointmentType);
    return availableSlots.length > 0 ? availableSlots[0] : null;
}

// Count available slots for a date
export function countAvailableSlots(dateStr: string, appointmentType: AppointmentType): number {
    return getAvailableSlots(dateStr, appointmentType).length;
}
