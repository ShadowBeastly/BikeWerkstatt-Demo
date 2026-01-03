// BikeWerkstatt Demo - CSV Export Utility

import { Booking } from '@/types';
import { formatDateShort } from './time';

// Status translations
const statusTranslations: Record<string, string> = {
    requested: 'Angefragt',
    confirmed: 'Bestätigt',
    canceled: 'Storniert',
};

// Generate CSV content from bookings
export function generateCSV(bookings: Booking[]): string {
    const headers = [
        'ID',
        'Terminart',
        'Datum',
        'Uhrzeit',
        'Dauer (Min)',
        'Name',
        'Telefon',
        'E-Mail',
        'Notizen',
        'Status',
        'Erstellt am',
    ];

    const rows = bookings.map(booking => [
        booking.id,
        booking.appointmentType.name,
        formatDateShort(booking.date),
        booking.time,
        String(booking.appointmentType.durationMinutes),
        booking.customer.name,
        booking.customer.phone,
        booking.customer.email || '',
        (booking.customer.notes || '').replace(/[\n\r]+/g, ' '),
        statusTranslations[booking.status] || booking.status,
        formatDateShort(booking.createdAt.split('T')[0]),
    ]);

    const csvContent = [
        headers.join(';'),
        ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(';')),
    ].join('\n');

    // Add BOM for Excel compatibility with German characters
    return '\ufeff' + csvContent;
}

// Trigger CSV download in browser
export function downloadCSV(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}

// Export bookings to CSV file
export function exportBookingsToCSV(bookings: Booking[]): void {
    const date = new Date().toISOString().split('T')[0];
    const filename = `bikewerkstatt_termine_${date}.csv`;
    const content = generateCSV(bookings);
    downloadCSV(content, filename);
}
