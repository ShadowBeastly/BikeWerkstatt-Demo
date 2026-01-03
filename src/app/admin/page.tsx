'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Booking, BookingStatus } from '@/types';
import { adminPin, businessConfig } from '@/config/appConfig';
import { getBookings, updateBookingStatus, deleteBooking, resetBookings } from '@/lib/storage';
import { formatDateShort } from '@/lib/time';
import { exportBookingsToCSV } from '@/lib/csv';

type StatusFilter = 'all' | BookingStatus;

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);

  useEffect(() => {
    // Check if already authenticated in this session
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadBookings();
    }
  }, [isAuthenticated]);

  const loadBookings = () => {
    const allBookings = getBookings();
    // Sort by date (newest first)
    allBookings.sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.time.localeCompare(a.time);
    });
    setBookings(allBookings);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === adminPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setPinError('');
    } else {
      setPinError('Falscher PIN. Bitte versuchen Sie es erneut.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    setPin('');
  };

  const handleStatusChange = (id: string, status: BookingStatus) => {
    updateBookingStatus(id, status);
    loadBookings();
  };

  const handleDelete = (id: string) => {
    deleteBooking(id);
    setDeleteConfirm(null);
    loadBookings();
  };

  const handleReset = () => {
    resetBookings();
    setResetConfirm(false);
    loadBookings();
  };

  const handleExport = () => {
    const filteredBookings = getFilteredBookings();
    exportBookingsToCSV(filteredBookings);
  };

  const getFilteredBookings = () => {
    if (filter === 'all') return bookings;
    return bookings.filter(b => b.status === filter);
  };

  const getStatusBadge = (status: BookingStatus) => {
    const labels: Record<BookingStatus, string> = {
      requested: 'Angefragt',
      confirmed: 'Bestätigt',
      canceled: 'Storniert',
    };
    return (
      <span className={`badge badge-${status}`}>
        {labels[status]}
      </span>
    );
  };

  const filteredBookings = getFilteredBookings();

  // PIN Gate
  if (!isAuthenticated) {
    return (
      <>
        <section className="page-header" style={{ background: 'linear-gradient(135deg, var(--color-gray-700) 0%, var(--color-gray-900) 100%)' }}>
          <div className="container">
            <h1>Admin-Bereich</h1>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="pin-gate">
              <div className="pin-icon">🔐</div>
              <h2>Zugang geschützt</h2>
              <p>Bitte geben Sie den Admin-PIN ein:</p>

              <form onSubmit={handlePinSubmit} className="pin-form">
                <input
                  type="password"
                  className={`form-input pin-input ${pinError ? 'form-input-error' : ''}`}
                  placeholder="PIN eingeben"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setPinError('');
                  }}
                  maxLength={6}
                  autoFocus
                />
                {pinError && <p className="form-error">{pinError}</p>}
                <button type="submit" className="btn btn-primary w-full">
                  Anmelden
                </button>
              </form>

              <p className="pin-hint">
                Demo-PIN: <code>1234</code>
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Admin Dashboard
  return (
    <>
      <section className="admin-header">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Admin-Bereich</h1>
              <p>{businessConfig.name}</p>
            </div>
            <button className="btn btn-ghost" onClick={handleLogout}>
              Abmelden
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">{bookings.length}</span>
              <span className="stat-label">Gesamt</span>
            </div>
            <div className="stat-card stat-requested">
              <span className="stat-number">
                {bookings.filter(b => b.status === 'requested').length}
              </span>
              <span className="stat-label">Angefragt</span>
            </div>
            <div className="stat-card stat-confirmed">
              <span className="stat-number">
                {bookings.filter(b => b.status === 'confirmed').length}
              </span>
              <span className="stat-label">Bestätigt</span>
            </div>
            <div className="stat-card stat-canceled">
              <span className="stat-number">
                {bookings.filter(b => b.status === 'canceled').length}
              </span>
              <span className="stat-label">Storniert</span>
            </div>
          </div>

          {/* Actions */}
          <div className="admin-actions">
            <div className="filter-group">
              <label>Filter:</label>
              <select
                className="form-input filter-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value as StatusFilter)}
              >
                <option value="all">Alle anzeigen</option>
                <option value="requested">Angefragt</option>
                <option value="confirmed">Bestätigt</option>
                <option value="canceled">Storniert</option>
              </select>
            </div>

            <div className="action-buttons">
              <button className="btn btn-secondary btn-sm" onClick={handleExport}>
                📥 CSV exportieren
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setResetConfirm(true)}
              >
                🗑️ Demo zurücksetzen
              </button>
            </div>
          </div>

          {/* Reset Confirmation */}
          {resetConfirm && (
            <div className="alert alert-warning">
              <strong>Alle Buchungen löschen?</strong> Diese Aktion kann nicht rückgängig gemacht werden.
              <div className="alert-actions">
                <button className="btn btn-danger btn-sm" onClick={handleReset}>
                  Ja, alle löschen
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setResetConfirm(false)}>
                  Abbrechen
                </button>
              </div>
            </div>
          )}

          {/* Bookings Table */}
          {filteredBookings.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Datum</th>
                    <th>Uhrzeit</th>
                    <th>Terminart</th>
                    <th>Kunde</th>
                    <th>Telefon</th>
                    <th>Status</th>
                    <th>Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{formatDateShort(booking.date)}</td>
                      <td>{booking.time} Uhr</td>
                      <td>
                        <span style={{ whiteSpace: 'nowrap' }}>
                          {booking.appointmentType.icon} {booking.appointmentType.name}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600 }}>{booking.customer.name}</span>
                          {booking.customer.email && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>{booking.customer.email}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <a href={`tel:${booking.customer.phone}`} style={{ color: 'var(--color-primary-600)', whiteSpace: 'nowrap' }}>
                          {booking.customer.phone}
                        </a>
                      </td>
                      <td>{getStatusBadge(booking.status)}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <select
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-sm)', background: 'white' }}
                            value={booking.status}
                            onChange={(e) => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                          >
                            <option value="requested">Angefragt</option>
                            <option value="confirmed">Bestätigt</option>
                            <option value="canceled">Storniert</option>
                          </select>

                          {deleteConfirm === booking.id ? (
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(booking.id)}
                              >
                                Löschen
                              </button>
                              <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => setDeleteConfirm(null)}
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button
                              className="btn btn-ghost btn-sm"
                              style={{ opacity: 0.5 }}
                              onClick={() => setDeleteConfirm(booking.id)}
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>Keine Buchungen gefunden</h3>
              <p>
                {filter === 'all'
                  ? 'Es wurden noch keine Termine gebucht.'
                  : `Keine Buchungen mit Status "${filter}" vorhanden.`
                }
              </p>
              <Link href="/booking" className="btn btn-primary mt-2">
                Ersten Termin buchen
              </Link>
            </div>
          )}

          {/* Booking Details (Mobile) */}
          <div className="mobile-bookings">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="card mobile-booking-card">
                <div className="mobile-booking-header">
                  <span className="mobile-booking-type">
                    {booking.appointmentType.icon} {booking.appointmentType.name}
                  </span>
                  {getStatusBadge(booking.status)}
                </div>

                <div className="mobile-booking-datetime">
                  {formatDateShort(booking.date)} um {booking.time} Uhr
                </div>

                <div className="mobile-booking-customer">
                  <strong>{booking.customer.name}</strong>
                  <a href={`tel:${booking.customer.phone}`}>{booking.customer.phone}</a>
                  {booking.customer.email && <span>{booking.customer.email}</span>}
                </div>

                {booking.customer.notes && (
                  <div className="mobile-booking-notes">
                    📝 {booking.customer.notes}
                  </div>
                )}

                <div className="mobile-booking-actions">
                  <select
                    className="form-input"
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                  >
                    <option value="requested">Angefragt</option>
                    <option value="confirmed">Bestätigt</option>
                    <option value="canceled">Storniert</option>
                  </select>

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      if (confirm('Buchung wirklich löschen?')) {
                        handleDelete(booking.id);
                      }
                    }}
                  >
                    🗑️ Löschen
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
