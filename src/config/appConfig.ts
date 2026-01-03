// BikeWerkstatt Demo - Application Configuration

import { AppointmentType, BusinessConfig, BookingRules, WeeklySchedule } from '@/types';

export const businessConfig: BusinessConfig = {
    name: 'BikeWerkstatt Demo',
    address: 'Musterstraße 12',
    city: '60311 Frankfurt am Main',
    phone: '+49 000 000000',
    email: 'demo@bikewerkstatt.de',
};

export const appointmentTypes: AppointmentType[] = [
    {
        id: 'beratung',
        name: 'Beratung E-Bike / Kauf',
        description: 'Persönliche Beratung für E-Bikes und Fahrradkauf. Wir finden gemeinsam das perfekte Rad für Sie.',
        durationMinutes: 45,
        bufferMinutes: 10,
        icon: '💬',
    },
    {
        id: 'reparatur',
        name: 'Reparatur / Inspektion',
        description: 'Professionelle Reparatur und gründliche Inspektion Ihres Fahrrads durch unsere Werkstatt-Experten.',
        durationMinutes: 30,
        bufferMinutes: 10,
        icon: '🔧',
    },
    {
        id: 'probefahrt',
        name: 'Probefahrt',
        description: 'Testen Sie Ihr Wunschrad auf einer Probefahrt durch Frankfurt. Unverbindlich und kostenlos.',
        durationMinutes: 30,
        bufferMinutes: 10,
        icon: '🚴',
    },
];

export const bookingRules: BookingRules = {
    slotStepMinutes: 15,
    leadTimeHours: 4,
    maxDaysAhead: 30,
};

export const weeklySchedule: WeeklySchedule = {
    0: { open: '', close: '', closed: true }, // Sunday - closed
    1: { open: '10:00', close: '18:00', closed: false }, // Monday
    2: { open: '10:00', close: '18:00', closed: false }, // Tuesday
    3: { open: '10:00', close: '18:00', closed: false }, // Wednesday
    4: { open: '10:00', close: '18:00', closed: false }, // Thursday
    5: { open: '10:00', close: '18:00', closed: false }, // Friday
    6: { open: '10:00', close: '14:00', closed: false }, // Saturday
};

export const adminPin = '1234';

// German day names for display
export const dayNames = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

// German month names for display  
export const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
];
