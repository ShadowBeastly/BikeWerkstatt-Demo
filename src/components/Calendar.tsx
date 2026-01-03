'use client';

import { useState, useMemo } from 'react';
import styles from './Calendar.module.css';
import { isBusinessDay } from '@/lib/time';

interface CalendarProps {
    selectedDate: string | null;
    onSelectDate: (date: string) => void;
    availableDates: string[]; // List of ISO date strings that are valid
}

export default function Calendar({ selectedDate, onSelectDate, availableDates }: CalendarProps) {
    // Initialize view based on selected date or today
    const [viewDate, setViewDate] = useState(() => {
        if (selectedDate) return new Date(selectedDate);
        return new Date();
    });

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();

    // Helper to get days in month
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Helper to get day of week for first day (0=Sunday, 1=Monday, ...)
    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    // Generate grid days
    const calendarDays = useMemo(() => {
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);
        const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

        // Adjust for Monday start (0=Monday, 6=Sunday)
        // Native: 0=Sun, 1=Mon... -> Target: 0=Mon, 6=Sun
        const startOffset = firstDay === 0 ? 6 : firstDay - 1;

        const days = [];

        // Empty cells before first day
        for (let i = 0; i < startOffset; i++) {
            days.push(null);
        }

        // Days of month
        for (let i = 1; i <= daysInMonth; i++) {
            const d = new Date(currentYear, currentMonth, i);
            // Fix timezone offset issue by manually formatting YYYY-MM-DD using local time numbers
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            days.push(dateStr);
        }

        return days;
    }, [currentYear, currentMonth]);

    const monthName = new Date(currentYear, currentMonth).toLocaleString('de-DE', { month: 'long', year: 'numeric' });

    // Navigation
    const prevMonth = () => {
        setViewDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const nextMonth = () => {
        setViewDate(new Date(currentYear, currentMonth + 1, 1));
    };

    // Allow navigation only if we are not too far back in past (simple check: don't go before current month)
    // Actually, allow free navigation, but disable days.
    // Ideally, restrict "Prev" if current view is before this month.
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;

    return (
        <div className={styles.calendarContainer}>
            <div className={styles.header}>
                <button
                    className={styles.navButton}
                    onClick={prevMonth}
                    disabled={isCurrentMonth} // Can't go back past current month
                >
                    ←
                </button>
                <div className={styles.monthLabel}>{monthName}</div>
                <button className={styles.navButton} onClick={nextMonth}>
                    →
                </button>
            </div>

            <div className={styles.grid}>
                {/* Weekday Headers (Mo-So) */}
                {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
                    <div key={day} className={styles.weekdayLabel}>{day}</div>
                ))}

                {/* Days */}
                {calendarDays.map((dateStr, index) => {
                    if (!dateStr) {
                        return <div key={`empty-${index}`} />;
                    }

                    const isAvailable = availableDates.includes(dateStr);
                    const isSelected = selectedDate === dateStr;
                    const isToday = dateStr === new Date().toISOString().split('T')[0];

                    return (
                        <button
                            key={dateStr}
                            className={`${styles.dayButton} ${isSelected ? styles.selected : ''} ${isToday ? styles.today : ''}`}
                            disabled={!isAvailable}
                            onClick={() => onSelectDate(dateStr)}
                        >
                            {parseInt(dateStr.split('-')[2])}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
