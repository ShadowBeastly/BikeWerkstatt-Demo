import Link from 'next/link';
import { Metadata } from 'next';
import { businessConfig, weeklySchedule } from '@/config/appConfig';

export const metadata: Metadata = {
  title: 'Kontakt',
  description: `Kontaktieren Sie ${businessConfig.name} in Frankfurt. Adresse, Telefon, E-Mail und Öffnungszeiten.`,
};

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <section className="page-header">
        <div className="container">
          <h1>Kontakt</h1>
          <p className="page-subtitle">
            Wir freuen uns auf Ihren Besuch
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Address */}
            <div className="card contact-card">
              <div className="contact-icon">📍</div>
              <h3>Adresse</h3>
              <address>
                <p><strong>{businessConfig.name}</strong></p>
                <p>{businessConfig.address}</p>
                <p>{businessConfig.city}</p>
              </address>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${businessConfig.address}, ${businessConfig.city}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm mt-2"
              >
                Route planen
              </a>
            </div>

            {/* Phone */}
            <div className="card contact-card">
              <div className="contact-icon">📞</div>
              <h3>Telefon</h3>
              <p>
                <a href={`tel:${businessConfig.phone.replace(/\s/g, '')}`} className="contact-link">
                  {businessConfig.phone}
                </a>
              </p>
              <p className="contact-note">
                Erreichbar zu den Öffnungszeiten
              </p>
            </div>

            {/* Email */}
            <div className="card contact-card">
              <div className="contact-icon">✉️</div>
              <h3>E-Mail</h3>
              <p>
                <a href={`mailto:${businessConfig.email}`} className="contact-link">
                  {businessConfig.email}
                </a>
              </p>
              <p className="contact-note">
                Wir antworten innerhalb von 24 Stunden
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Opening Hours */}
      <section className="section" style={{ background: 'var(--color-gray-50)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Öffnungszeiten</h2>
          </div>

          <div className="hours-card">
            <table className="hours-table">
              <tbody>
                <tr>
                  <td>Montag – Freitag</td>
                  <td className="hours-time">{weeklySchedule[1].open} – {weeklySchedule[1].close} Uhr</td>
                </tr>
                <tr>
                  <td>Samstag</td>
                  <td className="hours-time">{weeklySchedule[6].open} – {weeklySchedule[6].close} Uhr</td>
                </tr>
                <tr className="hours-closed">
                  <td>Sonntag</td>
                  <td className="hours-time">Geschlossen</td>
                </tr>
              </tbody>
            </table>

            <div className="hours-note">
              <p>🎄 An Feiertagen gelten gesonderte Öffnungszeiten.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="map-section">
        <div className="map-placeholder">
          <div className="map-overlay">
            <div className="map-content">
              <span className="map-pin">📍</span>
              <p><strong>{businessConfig.name}</strong></p>
              <p>{businessConfig.address}</p>
              <p>{businessConfig.city}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${businessConfig.address}, ${businessConfig.city}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm mt-2"
              >
                In Google Maps öffnen
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container text-center">
          <h2 style={{ marginBottom: '1rem' }}>Online Termin buchen</h2>
          <p className="section-subtitle" style={{ marginBottom: '2rem' }}>
            Sparen Sie Zeit und buchen Sie Ihren Termin bequem online – rund um die Uhr.
          </p>
          <Link href="/booking" className="btn btn-accent btn-lg">
            Jetzt Termin buchen
          </Link>
        </div>
      </section>
    </>
  );
}
