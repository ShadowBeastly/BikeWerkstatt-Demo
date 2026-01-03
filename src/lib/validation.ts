// BikeWerkstatt Demo - Form Validation

import { CustomerData, ValidationError, AppointmentType } from '@/types';
import { isBusinessDay, isWithinLeadTime, isDateInPast, isDateTooFarAhead } from './time';
import { hasConflict } from './storage';

// Validate customer data
export function validateCustomerData(data: CustomerData): ValidationError[] {
    const errors: ValidationError[] = [];

    // Name is required
    if (!data.name || data.name.trim().length < 2) {
        errors.push({
            field: 'name',
            message: 'Bitte geben Sie Ihren Namen ein (mindestens 2 Zeichen).',
        });
    }

    // Phone is required and must be valid
    if (!data.phone || data.phone.trim().length < 6) {
        errors.push({
            field: 'phone',
            message: 'Bitte geben Sie eine gültige Telefonnummer ein.',
        });
    } else if (!/^[+\d\s\-()]+$/.test(data.phone)) {
        errors.push({
            field: 'phone',
            message: 'Die Telefonnummer enthält ungültige Zeichen.',
        });
    }

    // Email is optional but must be valid if provided
    if (data.email && data.email.trim().length > 0) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            errors.push({
                field: 'email',
                message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
            });
        }
    }

    return errors;
}

// Validate booking date
export function validateBookingDate(dateStr: string | null): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!dateStr) {
        errors.push({
            field: 'date',
            message: 'Bitte wählen Sie ein Datum.',
        });
        return errors;
    }

    if (isDateInPast(dateStr)) {
        errors.push({
            field: 'date',
            message: 'Das gewählte Datum liegt in der Vergangenheit.',
        });
    }

    if (isDateTooFarAhead(dateStr)) {
        errors.push({
            field: 'date',
            message: 'Termine können maximal 30 Tage im Voraus gebucht werden.',
        });
    }

    if (!isBusinessDay(dateStr)) {
        errors.push({
            field: 'date',
            message: 'An diesem Tag ist die Werkstatt geschlossen.',
        });
    }

    return errors;
}

// Validate booking time
export function validateBookingTime(
    dateStr: string,
    time: string | null,
    appointmentType: AppointmentType | null
): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!time) {
        errors.push({
            field: 'time',
            message: 'Bitte wählen Sie eine Uhrzeit.',
        });
        return errors;
    }

    if (!appointmentType) {
        errors.push({
            field: 'appointmentType',
            message: 'Bitte wählen Sie einen Termintyp.',
        });
        return errors;
    }

    if (!isWithinLeadTime(dateStr, time)) {
        errors.push({
            field: 'time',
            message: 'Termine müssen mindestens 4 Stunden im Voraus gebucht werden.',
        });
    }

    if (hasConflict(dateStr, time, appointmentType.durationMinutes, appointmentType.bufferMinutes)) {
        errors.push({
            field: 'time',
            message: 'Dieser Termin ist leider nicht mehr verfügbar.',
        });
    }

    return errors;
}

// Validate complete booking
export function validateBooking(
    appointmentType: AppointmentType | null,
    dateStr: string | null,
    time: string | null,
    customer: CustomerData
): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!appointmentType) {
        errors.push({
            field: 'appointmentType',
            message: 'Bitte wählen Sie einen Termintyp.',
        });
    }

    errors.push(...validateBookingDate(dateStr));

    if (dateStr && appointmentType) {
        errors.push(...validateBookingTime(dateStr, time, appointmentType));
    }

    errors.push(...validateCustomerData(customer));

    return errors;
}

// Get error message for a specific field
export function getFieldError(errors: ValidationError[], field: string): string | undefined {
    const error = errors.find(e => e.field === field);
    return error?.message;
}

// Check if form has errors
export function hasErrors(errors: ValidationError[]): boolean {
    return errors.length > 0;
}
