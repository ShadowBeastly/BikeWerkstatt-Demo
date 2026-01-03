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
      <div className="pin-gate-wrapper">
        <div className="pin-card">
          <div className="pin-icon-wrapper">🔐</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-gray-900)' }}>Zugang geschützt</h2>
          <p style={{ color: 'var(--color-gray-500)', marginBottom: '2rem' }}>Bitte geben Sie den Admin-PIN ein</p>

          <form onSubmit={handlePinSubmit}>
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
              style={{ textAlign: 'center', fontSize: '1.25rem', letterSpacing: '0.25em', marginBottom: '1rem' }}
            />
            {pinError && <p className="form-error" style={{ marginBottom: '1rem' }}>{pinError}</p>}
            <button type="submit" className="btn btn-primary w-full btn-lg">
              Anmelden
            </button>
          </form>

          <p className="pin-hint" style={{ marginTop: '2rem', color: 'var(--color-gray-400)', fontSize: '0.875rem' }}>Demo-PIN: <code>1234</code></p>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div style={{ background: 'var(--color-gray-50)', minHeight: '100vh', paddingBottom: '4rem' }}>
      <header className="admin-header">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Admin-Dashboard</h1>
              <p>{businessConfig.name}</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
              Abmelden
            </button>
          </div>
        </div>
      </header>

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
            <span className="stat-label">Offen</span>
          </div>
          <div className="stat-card stat-success">
            <span className="stat-number">
              {bookings.filter(b => b.status === 'confirmed').length}
            </span>
            <span className="stat-label">Bestätigt</span>
          </div>
          <div className="stat-card stat-danger">
            <span className="stat-number">
              {bookings.filter(b => b.status === 'canceled').length}
            </span>
            <span className="stat-label">Storniert</span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="admin-toolbar">
          <div className="toolbar-group">
            <span style={{ fontWeight: 600, color: 'var(--color-gray-700)' }}>Filter:</span>
            <select
              className="form-input"
              style={{ padding: '0.5rem', width: 'auto' }}
              value={filter}
              onChange={(e) => setFilter(e.target.value as StatusFilter)}
            >
              <option value="all">Alle Buchungen</option>
              <option value="requested">Nur Offene</option>
              <option value="confirmed">Nur Bestätigte</option>
              <option value="canceled">Nur Stornierte</option>
            </select>
          </div>

          <div className="toolbar-group">
            <button className="btn btn-secondary btn-sm" onClick={handleExport}>
              📥 Export CSV
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setResetConfirm(true)}
              style={{ color: 'var(--color-error)' }}
            >
              🗑️ Reset
            </button>
          </div>
        </div>

        {/* Reset Confirmation */}
        {resetConfirm && (
          <div className="alert alert-warning" style={{ marginBottom: '1.5rem' }}>
            <strong>Warnung:</strong> Möchten Sie wirklich alle Demo-Daten löschen?
            <div className="alert-actions">
              <button className="btn btn-danger btn-sm" onClick={handleReset}>
                Ja, alles löschen
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setResetConfirm(false)}>
                Abbrechen
              </button>
            </div>
          </div>
        )}

        {/* Bookings Table */}
        {filteredBookings.length > 0 ? (
          <div className="admin-table-container">
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Datum & Zeit</th>
                    <th>Leistung</th>
                    <th>Kunde</th>
                    <th>Kontakt</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{formatDateShort(booking.date)}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>{booking.time} Uhr</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '1.25rem' }}>{booking.appointmentType.icon}</span>
                          <span>{booking.appointmentType.name}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{booking.customer.name}</div>
                        {booking.customer.notes && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            📝 {booking.customer.notes}
                          </div>
                        )}
                      </td>
                      <td>
                        <a href={`tel:${booking.customer.phone}`} style={{ display: 'block', color: 'var(--color-primary-600)' }}>
                          {booking.customer.phone}
                        </a>
                        {booking.customer.email && (
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>{booking.customer.email}</span>
                        )}
                      </td>
                      <td>{getStatusBadge(booking.status)}</td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <select
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)', background: 'white' }}
                            value={booking.status}
                            onChange={(e) => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                          >
                            <option value="requested">Offen</option>
                            <option value="confirmed">Bestätigt</option>
                            <option value="canceled">Storniert</option>
                          </select>

                          {deleteConfirm === booking.id ? (
                            <button
                              className="btn btn-danger btn-sm"
                              style={{ padding: '0.25rem 0.5rem' }}
                              onClick={() => handleDelete(booking.id)}
                            >
                              Löschen?
                            </button>
                          ) : (
                            <button
                              className="btn btn-ghost btn-sm"
                              style={{ padding: '0.25rem 0.5rem', opacity: 0.5 }}
                              onClick={() => setDeleteConfirm(booking.id)}
                              title="Löschen"
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
          </div>
        ) : (
          <div className="empty-state card" style={{ padding: '4rem 2rem' }}>
            <div className="empty-icon" style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>📭</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Keine Buchungen gefunden</h3>
            <p style={{ color: 'var(--color-gray-500)' }}>
              {filter === 'all'
                ? 'Es liegen aktuell keine Terminanfragen vor.'
                : `Keine Buchungen mit dem Status "${filter}".`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
