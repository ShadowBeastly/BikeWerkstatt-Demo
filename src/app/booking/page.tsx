'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Calendar from '@/components/Calendar';
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

                            <Calendar
                                selectedDate={selectedDate}
                                onSelectDate={handleSelectDate}
                                availableDates={availableDates}
                            />

                            <p className="text-muted text-center mt-3">
                                Maximal {bookingRules.maxDaysAhead} Tage im Voraus buchbar.
                            </p>
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
                                am {selectedDate ? formatDateLong(selectedDate) : ''}
                            </p>

                            {availableSlots.length > 0 ? (
                                <div className="time-slots-container">
                                    {[
                                        { label: 'Vormittag', slots: availableSlots.filter(s => parseInt(s.time) < 12) },
                                        { label: 'Mittag', slots: availableSlots.filter(s => parseInt(s.time) >= 12 && parseInt(s.time) < 14) },
                                        { label: 'Nachmittag', slots: availableSlots.filter(s => parseInt(s.time) >= 14) }
                                    ].map(group => group.slots.length > 0 && (
                                        <div key={group.label} className="time-group mb-4">
                                            <h3 className="text-sm font-semibold text-gray-500 mb-2 pl-1">{group.label}</h3>
                                            <div className="time-grid">
                                                {group.slots.map((slot) => (
                                                    <button
                                                        key={slot.time}
                                                        className="time-card"
                                                        onClick={() => handleSelectTime(slot.time)}
                                                    >
                                                        {slot.time} Uhr
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-4">
                                    <p className="text-muted mb-3">Keine Termine an diesem Tag verfügbar.</p>
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => setStep(2)}
                                    >
                                        Anderes Datum wählen
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 4: Enter Details */}
                    {step === 4 && (
                        <div className="booking-step animate-slideUp">
                            <button className="btn btn-ghost mb-3" onClick={goBack}>
                                ← Zurück
                            </button>
                            <h2 className="step-title">Ihre Daten</h2>
                            <p className="step-subtitle">
                                {selectedType?.name} am {selectedDate ? formatDateShort(selectedDate) : ''} um {selectedTime} Uhr
                            </p>

                            <div className="customer-form">
                                {errors.find(e => e.field === 'submit') && (
                                    <div className="alert alert-error mb-4">
                                        {errors.find(e => e.field === 'submit')?.message}
                                    </div>
                                )}
                                {errors.find(e => e.field === 'time') && (
                                    <div className="alert alert-warning mb-4">
                                        {errors.find(e => e.field === 'time')?.message}
                                    </div>
                                )}

                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className={`form-input ${getFieldError(errors, 'name') ? 'form-input-error' : ''}`}
                                        value={customerData.name}
                                        onChange={(e) => handleCustomerDataChange('name', e.target.value)}
                                        placeholder="Ihr Vor- und Nachname"
                                    />
                                    {getFieldError(errors, 'name') && <span className="error-message">{getFieldError(errors, 'name')}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">E-Mail *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className={`form-input ${getFieldError(errors, 'email') ? 'form-input-error' : ''}`}
                                        value={customerData.email}
                                        onChange={(e) => handleCustomerDataChange('email', e.target.value)}
                                        placeholder="ihre.email@example.com"
                                    />
                                    {getFieldError(errors, 'email') && <span className="error-message">{getFieldError(errors, 'email')}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone" className="form-label">Telefonnummer *</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        className={`form-input ${getFieldError(errors, 'phone') ? 'form-input-error' : ''}`}
                                        value={customerData.phone}
                                        onChange={(e) => handleCustomerDataChange('phone', e.target.value)}
                                        placeholder="0123 4567890"
                                    />
                                    {getFieldError(errors, 'phone') && <span className="error-message">{getFieldError(errors, 'phone')}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="notes" className="form-label">Anmerkungen (optional)</label>
                                    <textarea
                                        id="notes"
                                        className="form-input"
                                        value={customerData.notes}
                                        onChange={(e) => handleCustomerDataChange('notes', e.target.value)}
                                        placeholder="Z.B. Fahrradmodell, Art des Problems..."
                                        rows={3}
                                    />
                                </div>

                                <button
                                    className="btn btn-primary w-full mt-2"
                                    onClick={handleSubmitCustomerData}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Wird gebucht...' : 'Termin buchen'}
                                </button>

                                <p className="form-note">
                                    Mit dem Absenden akzeptieren Sie unsere <Link href="/datenschutz">Datenschutzerklärung</Link>.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Success */}
                    {step === 5 && (
                        <div className="booking-step animate-slideUp text-center">
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                            <h2 className="step-title">Termin erfolgreich angefragt!</h2>
                            <p className="step-subtitle">
                                Vielen Dank, {customerData.name}.<br />
                                Der Termin ist vorgemerkt. Wir bestätigen ihn kurzfristig.
                            </p>

                            <div className="card mb-4 text-left inline-block w-full max-w-md">
                                <h3 className="text-lg font-bold mb-2 border-b pb-2">Termindetails</h3>
                                <div className="grid grid-2 gap-2">
                                    <div className="text-muted">Was:</div>
                                    <div className="font-medium">{selectedType?.name}</div>

                                    <div className="text-muted">Wann:</div>
                                    <div className="font-medium">
                                        {selectedDate ? formatDateLong(selectedDate) : ''}, {selectedTime} Uhr
                                    </div>

                                    <div className="text-muted">Wo:</div>
                                    <div className="font-medium">
                                        BikeWerkstatt Demo<br />
                                        Musterstraße 123
                                    </div>
                                </div>
                                {bookingId && (
                                    <div className="mt-4 pt-2 border-t text-sm text-center text-muted">
                                        Buchungs-ID: {bookingId.slice(0, 8)}
                                    </div>
                                )}
                            </div>

                            <div>
                                <button className="btn btn-primary" onClick={resetBooking}>
                                    Zur Startseite
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
