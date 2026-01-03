// BikeWerkstatt Demo - Time Utilities

import { weeklySchedule, dayNames, monthNames, bookingRules } from '@/config/appConfig';
import { OpeningHours } from '@/types';

// Format date in German style: "Montag, 3. Januar 2026"
export function formatDateLong(dateStr: string): string {
    const date = new Date(dateStr);
    const dayName = dayNames[date.getDay()];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${dayName}, ${day}. ${month} ${year}`;
}

// Format date short: "03.01.2026"
export function formatDateShort(dateStr: string): string {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

// Format time: "10:00 Uhr"
export function formatTime(time: string): string {
    return `${time} Uhr`;
}

// Get ISO date string for today
export function getToday(): string {
    return new Date().toISOString().split('T')[0];
}

// Get ISO date string for a date N days from now
export function getDateInDays(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

// Check if a date is a business day (shop is open)
export function isBusinessDay(dateStr: string): boolean {
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    const schedule = weeklySchedule[dayOfWeek];
    return !schedule.closed;
}

// Get opening hours for a specific date
export function getOpeningHours(dateStr: string): OpeningHours {
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    return weeklySchedule[dayOfWeek];
}

// Check if a slot is within the minimum lead time
export function isWithinLeadTime(dateStr: string, time: string): boolean {
    const now = new Date();
    const slotDateTime = new Date(`${dateStr}T${time}:00`);

    const leadTimeMs = bookingRules.leadTimeHours * 60 * 60 * 1000;
    const minBookingTime = new Date(now.getTime() + leadTimeMs);

    return slotDateTime >= minBookingTime;
}

// Check if a date is in the past
export function isDateInPast(dateStr: string): boolean {
    const today = getToday();
    return dateStr < today;
}

// Check if a date is too far in the future
export function isDateTooFarAhead(dateStr: string): boolean {
    const maxDate = getDateInDays(bookingRules.maxDaysAhead);
    return dateStr > maxDate;
}

// Add minutes to a time string, returning new time string
export function addMinutes(time: string, minutes: number): string {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
}

// Compare two time strings (returns -1, 0, or 1)
export function compareTimes(time1: string, time2: string): number {
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);
    const mins1 = h1 * 60 + m1;
    const mins2 = h2 * 60 + m2;

    if (mins1 < mins2) return -1;
    if (mins1 > mins2) return 1;
    return 0;
}

// Get array of dates for the next N days that are business days
export function getAvailableDates(maxDays: number = bookingRules.maxDaysAhead): string[] {
    const dates: string[] = [];

    for (let i = 0; i <= maxDays; i++) {
        const dateStr = getDateInDays(i);
        if (isBusinessDay(dateStr)) {
            dates.push(dateStr);
        }
    }

    return dates;
}

// Get current time as HH:MM
export function getCurrentTime(): string {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}
