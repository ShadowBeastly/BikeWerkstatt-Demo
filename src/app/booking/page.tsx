'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { AppointmentType, CustomerData, TimeSlot } from '@/types';
import { appointmentTypes, bookingRules, businessConfig } from '@/config/appConfig';
import { generateTimeSlots } from '@/lib/slots';
import { formatDateLong, formatDateShort, getToday, isBusinessDay, getAvailableDates } from '@/lib/time';
import { validateCustomerData, validateBooking, getFieldError, hasErrors } from '@/lib/validation';
import { saveBooking, hasConflict } from '@/lib/storage';

type BookingStep = 1 | 2 | 3 | 4 | 5;

export default function BookingPage() {
    const [step, setStep] = useState<BookingStep>(1);
    const [selectedType, setSelectedType] = useState<AppointmentType | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [customerData, setCustomerData] = useState<CustomerData>({
        name: '',
        phone: '',
        email: '',
        notes: '',
    });
    const [errors, setErrors] = useState<{ field: string; message: string }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingId, setBookingId] = useState<string | null>(null);

    // Available dates (next 30 days, business days only)
    const availableDates = useMemo(() => getAvailableDates(), []);

    // Time slots for selected date and type
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

    useEffect(() => {
        if (selectedDate && selectedType) {
            const slots = generateTimeSlots(selectedDate, selectedType);
            setTimeSlots(slots);
            // Reset time selection if date changes
            setSelectedTime(null);
        }
    }, [selectedDate, selectedType]);

    const handleSelectType = (type: AppointmentType) => {
        setSelectedType(type);
        setStep(2);
    };

    const handleSelectDate = (date: string) => {
        setSelectedDate(date);
        setStep(3);
    };

    const handleSelectTime = (time: string) => {
        // Check one more time for conflicts
        if (selectedType && selectedDate && hasConflict(selectedDate, time, selectedType.durationMinutes, selectedType.bufferMinutes)) {
            setErrors([{ field: 'time', message: 'Dieser Termin ist leider nicht mehr verfügbar.' }]);
            return;
        }
        setSelectedTime(time);
        setStep(4);
    };

    const handleCustomerDataChange = (field: keyof CustomerData, value: string) => {
        setCustomerData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field
        setErrors(prev => prev.filter(e => e.field !== field));
    };

    const handleSubmitCustomerData = () => {
        const validationErrors = validateCustomerData(customerData);
        if (hasErrors(validationErrors)) {
            setErrors(validationErrors);
            return;
        }

        // Final validation before submitting
        const allErrors = validateBooking(selectedType, selectedDate, selectedTime, customerData);
        if (hasErrors(allErrors)) {
            setErrors(allErrors);
            return;
        }

        setStep(5);
        submitBooking();
    };

    const submitBooking = () => {
        if (!selectedType || !selectedDate || !selectedTime) return;

        setIsSubmitting(true);

        // Simulate a small delay for better UX
        setTimeout(() => {
            try {
                const booking = saveBooking({
                    appointmentType: selectedType,
                    date: selectedDate,
                    time: selectedTime,
                    customer: customerData,
                    status: 'requested',
                });
                setBookingId(booking.id);
            } catch (error) {
                console.error('Booking failed:', error);
                setErrors([{ field: 'submit', message: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' }]);
                setStep(4);
            } finally {
                setIsSubmitting(false);
            }
        }, 500);
    };

    const goBack = () => {
        if (step > 1) {
            setStep((step - 1) as BookingStep);
            setErrors([]);
        }
    };

    const resetBooking = () => {
        setStep(1);
        setSelectedType(null);
        setSelectedDate(null);
        setSelectedTime(null);
        setCustomerData({ name: '', phone: '', email: '', notes: '' });
        setErrors([]);
        setBookingId(null);
    };

    const availableSlots = timeSlots.filter(slot => slot.available);

    return (
        <>
            <section className="page-header">
                <div className="container">
                    <h1>Termin buchen</h1>
                    <p className="page-subtitle">
                        In wenigen Schritten zu Ihrem Wunschtermin
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    {/* Progress Steps */}
                    {step < 5 && (
                        <div className="progress-steps">
                            {[1, 2, 3, 4].map((s, i) => (
                                <div key={s} className="progress-step-wrapper">
                                    <div className={`progress-step ${step === s ? 'progress-step-active' : ''} ${step > s ? 'progress-step-completed' : ''}`}>
                                        <span className="progress-step-number">
                                            {step > s ? '✓' : s}
                                        </span>
                                        <span className="progress-step-label">
                                            {s === 1 && 'Terminart'}
                                            {s === 2 && 'Datum'}
                                            {s === 3 && 'Uhrzeit'}
                                            {s === 4 && 'Daten'}
                                        </span>
                                    </div>
                                    {i < 3 && (
                                        <div className={`progress-connector ${step > s ? 'progress-connector-completed' : ''}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Step 1: Select Type */}
                    {step === 1 && (
                        <div className="booking-step animate-slideUp">
                            <h2 className="step-title">Was möchten Sie buchen?</h2>
                            <div className="grid grid-3">
                                {appointmentTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        className="card card-interactive type-card"
                                        onClick={() => handleSelectType(type)}
                                    >
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{type.icon}</div>
                                        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{type.name}</h3>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: '1rem' }}>{type.description}</p>
                                        <div style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>
                                            <span>⏱️ {type.durationMinutes} Min.</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Select Date */}
                    {step === 2 && (
                        <div className="booking-step animate-slideUp">
                            <button className="btn btn-ghost mb-3" onClick={goBack}>
                                ← Zurück
                            </button>
                            <h2 className="step-title">Wählen Sie ein Datum</h2>
                            <p className="step-subtitle">für: {selectedType?.name}</p>

                            {/* Today Shortcut */}
                            {isBusinessDay(getToday()) && (
                                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                    <button
                                        className="btn btn-accent"
                                        onClick={() => handleSelectDate(getToday())}
                                    >
                                        📅 Heute ({formatDateShort(getToday())})
                                    </button>
                                </div>
                            )}

                            {/* Clean date list */}
                            <div className="date-list">
                                {availableDates.slice(0, 21).map((date) => {
                                    const d = new Date(date);
                                    const day = d.getDate();
                                    const weekday = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'][d.getDay()];
                                    const month = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'][d.getMonth()];

                                    return (
                                        <button
                                            key={date}
                                            className={`date-list-item ${selectedDate === date ? 'date-list-item-selected' : ''}`}
                                            onClick={() => handleSelectDate(date)}
                                        >
                                            <span className="date-list-weekday">{weekday}</span>
                                            <span className="date-list-date">{day}. {month}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {availableDates.length > 21 && (
                                <p className="text-muted text-center mt-2">
                                    Weitere Termine verfügbar. Maximal {bookingRules.maxDaysAhead} Tage im Voraus buchbar.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Step 3: Select Time */}
                    {step === 3 && (
                        <div className="booking-step animate-slideUp">
                            <button className="btn btn-ghost mb-3" onClick={goBack}>
                                ← Zurück
                            </button>
                            <h2 className="step-title">Wählen Sie eine Uhrzeit</h2>
                            <p className="step-subtitle">
                                {selectedType?.name} am {selectedDate && formatDateLong(selectedDate)}
                            </p>

                            {getFieldError(errors, 'time') && (
                                <div className="alert alert-error">{getFieldError(errors, 'time')}</div>
                            )}

                            {availableSlots.length > 0 ? (
                                <div className="slot-grid">
                                    {timeSlots.map((slot) => (
                                        <button
                                            key={slot.time}
                                            className={`slot ${slot.available ? 'slot-available' : 'slot-unavailable'} ${selectedTime === slot.time ? 'slot-selected' : ''}`}
                                            onClick={() => slot.available && handleSelectTime(slot.time)}
                                            disabled={!slot.available}
                                        >
                                            {slot.time}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="alert alert-warning">
                                    Für diesen Tag sind leider keine freien Termine mehr verfügbar.
                                    Bitte wählen Sie einen anderen Tag.
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 4: Customer Data */}
                    {step === 4 && (
                        <div className="booking-step animate-slideUp">
                            <button className="btn btn-ghost mb-3" onClick={goBack}>
                                ← Zurück
                            </button>
                            <h2 className="step-title">Ihre Kontaktdaten</h2>
                            <p className="step-subtitle">
                                {selectedType?.name} am {selectedDate && formatDateLong(selectedDate)} um {selectedTime} Uhr
                            </p>

                            <div className="customer-form">
                                <div className="form-group">
                                    <label className="form-label">Name *</label>
                                    <input
                                        type="text"
                                        className={`form-input ${getFieldError(errors, 'name') ? 'form-input-error' : ''}`}
                                        placeholder="Ihr vollständiger Name"
                                        value={customerData.name}
                                        onChange={(e) => handleCustomerDataChange('name', e.target.value)}
                                    />
                                    {getFieldError(errors, 'name') && (
                                        <p className="form-error">{getFieldError(errors, 'name')}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Telefon *</label>
                                    <input
                                        type="tel"
                                        className={`form-input ${getFieldError(errors, 'phone') ? 'form-input-error' : ''}`}
                                        placeholder="Ihre Telefonnummer"
                                        value={customerData.phone}
                                        onChange={(e) => handleCustomerDataChange('phone', e.target.value)}
                                    />
                                    {getFieldError(errors, 'phone') && (
                                        <p className="form-error">{getFieldError(errors, 'phone')}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">E-Mail (optional)</label>
                                    <input
                                        type="email"
                                        className={`form-input ${getFieldError(errors, 'email') ? 'form-input-error' : ''}`}
                                        placeholder="ihre@email.de"
                                        value={customerData.email}
                                        onChange={(e) => handleCustomerDataChange('email', e.target.value)}
                                    />
                                    {getFieldError(errors, 'email') && (
                                        <p className="form-error">{getFieldError(errors, 'email')}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Anmerkungen (optional)</label>
                                    <textarea
                                        className="form-input form-textarea"
                                        placeholder="z.B. Art des Fahrrads, spezielles Problem..."
                                        value={customerData.notes}
                                        onChange={(e) => handleCustomerDataChange('notes', e.target.value)}
                                    />
                                </div>

                                {getFieldError(errors, 'submit') && (
                                    <div className="alert alert-error">{getFieldError(errors, 'submit')}</div>
                                )}

                                <button
                                    className="btn btn-primary btn-lg w-full"
                                    onClick={handleSubmitCustomerData}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Wird gesendet...' : 'Termin anfragen'}
                                </button>

                                <p className="form-note">
                                    * Pflichtfelder. Mit dem Absenden stimmen Sie unserer{' '}
                                    <Link href="/datenschutz">Datenschutzerklärung</Link> zu.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Confirmation */}
                    {step === 5 && (
                        <div className="booking-step animate-slideUp">
                            <div className="confirmation-box">
                                <div className="confirmation-icon">✅</div>
                                <h2>Terminanfrage gesendet!</h2>
                                <p className="confirmation-text">
                                    Vielen Dank für Ihre Buchung. Wir werden uns in Kürze bei Ihnen melden,
                                    um den Termin zu bestätigen.
                                </p>

                                <div className="confirmation-details">
                                    <div className="confirmation-row">
                                        <span className="confirmation-label">Terminart:</span>
                                        <span className="confirmation-value">{selectedType?.name}</span>
                                    </div>
                                    <div className="confirmation-row">
                                        <span className="confirmation-label">Datum:</span>
                                        <span className="confirmation-value">{selectedDate && formatDateLong(selectedDate)}</span>
                                    </div>
                                    <div className="confirmation-row">
                                        <span className="confirmation-label">Uhrzeit:</span>
                                        <span className="confirmation-value">{selectedTime} Uhr</span>
                                    </div>
                                    <div className="confirmation-row">
                                        <span className="confirmation-label">Dauer:</span>
                                        <span className="confirmation-value">{selectedType?.durationMinutes} Minuten</span>
                                    </div>
                                    <div className="confirmation-row">
                                        <span className="confirmation-label">Name:</span>
                                        <span className="confirmation-value">{customerData.name}</span>
                                    </div>
                                    <div className="confirmation-row">
                                        <span className="confirmation-label">Telefon:</span>
                                        <span className="confirmation-value">{customerData.phone}</span>
                                    </div>
                                    {customerData.email && (
                                        <div className="confirmation-row">
                                            <span className="confirmation-label">E-Mail:</span>
                                            <span className="confirmation-value">{customerData.email}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="confirmation-note">
                                    <p>📍 {businessConfig.address}, {businessConfig.city}</p>
                                    <p>📞 Bei Fragen erreichen Sie uns unter {businessConfig.phone}</p>
                                </div>

                                <div className="confirmation-actions">
                                    <button className="btn btn-primary" onClick={resetBooking}>
                                        Weiteren Termin buchen
                                    </button>
                                    <Link href="/" className="btn btn-secondary">
                                        Zur Startseite
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
