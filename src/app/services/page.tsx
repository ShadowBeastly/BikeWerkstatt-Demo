import Link from 'next/link';
import { Metadata } from 'next';
import { appointmentTypes } from '@/config/appConfig';

export const metadata: Metadata = {
  title: 'Leistungen',
  description: 'Unsere Leistungen: E-Bike Beratung, Fahrradreparatur, Inspektion und Probefahrten. Buchen Sie jetzt Ihren Termin online.',
};

export default function ServicesPage() {
  return (
    <>
      {/* Header */}
      <section className="page-header">
        <div className="container">
          <h1>Unsere Leistungen</h1>
          <p className="page-subtitle">
            Von der Beratung bis zur Reparatur – wir sind für Sie da
          </p>
        </div>
      </section>

      {/* Services Detail */}
      <section className="section">
        <div className="container">
          {appointmentTypes.map((type, index) => (
            <div key={type.id} className={`service-detail ${index % 2 === 1 ? 'reverse' : ''}`}>
              <div className="service-detail-icon">
                <span>{type.icon}</span>
              </div>
              <div className="service-detail-content">
                <h2>{type.name}</h2>
                <p className="service-detail-description">{type.description}</p>

                <div className="service-detail-meta">
                  <div className="service-meta-item">
                    <span>⏱️</span>
                    <span><strong>Dauer:</strong> {type.durationMinutes} Minuten</span>
                  </div>
                  <div className="service-meta-item">
                    <span>📋</span>
                    <span><strong>Puffer:</strong> {type.bufferMinutes} Minuten Vor-/Nachbereitung</span>
                  </div>
                </div>

                {type.id === 'beratung' && (
                  <div className="service-detail-features">
                    <h4>Das erwartet Sie:</h4>
                    <ul>
                      <li>Persönliche Beratung zu E-Bikes und konventionellen Rädern</li>
                      <li>Ermittlung Ihrer Bedürfnisse und Nutzungsgewohnheiten</li>
                      <li>Vorstellung passender Modelle aus unserem Sortiment</li>
                      <li>Optionale Probefahrt im Anschluss</li>
                    </ul>
                  </div>
                )}

                {type.id === 'reparatur' && (
                  <div className="service-detail-features">
                    <h4>Unser Reparatur-Service:</h4>
                    <ul>
                      <li>Komplette Fahrradinspektion mit Sicherheitscheck</li>
                      <li>Bremsen-, Schaltungs- und Lichtanlage-Einstellung</li>
                      <li>Reifenwechsel und Pannenhilfe</li>
                      <li>E-Bike Akku- und Motor-Diagnose</li>
                    </ul>
                  </div>
                )}

                {type.id === 'probefahrt' && (
                  <div className="service-detail-features">
                    <h4>So läuft die Probefahrt ab:</h4>
                    <ul>
                      <li>Auswahl eines Fahrrads aus unserem Showroom</li>
                      <li>Kurze Einweisung in Bedienung und Funktionen</li>
                      <li>Probefahrt in der Umgebung (Personalausweis erforderlich)</li>
                      <li>Anschließende Beratung bei Interesse</li>
                    </ul>
                  </div>
                )}

                <Link href="/booking" className="btn btn-primary mt-3">
                  {type.name} buchen
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Services */}
      <section className="section" style={{ background: 'var(--color-gray-50)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Weitere Services</h2>
            <p className="section-subtitle">
              Ohne Terminbuchung – kommen Sie einfach vorbei
            </p>
          </div>

          <div className="grid grid-3">
            {[
              { icon: '🛒', title: 'Zubehör-Beratung', text: 'Helme, Schlösser, Beleuchtung – wir beraten Sie gerne zu unserem Sortiment.' },
              { icon: '🔋', title: 'Akku-Ladestation', text: 'Laden Sie Ihren E-Bike Akku kostenlos bei uns, während Sie einen Kaffee trinken.' },
              { icon: '📦', title: 'Ersatzteil-Bestellung', text: 'Spezielles Ersatzteil benötigt? Wir bestellen es für Sie.' },
            ].map((service, i) => (
              <div key={i} className="card">
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{service.icon}</div>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{service.title}</h3>
                <p style={{ color: 'var(--color-gray-600)', fontSize: '0.875rem' }}>{service.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container text-center">
          <h2 style={{ marginBottom: '1rem' }}>Termin vereinbaren</h2>
          <p className="section-subtitle" style={{ marginBottom: '2rem' }}>
            Wählen Sie Ihren Wunschtermin bequem online aus
          </p>
          <Link href="/booking" className="btn btn-accent btn-lg">
            Jetzt Termin buchen
          </Link>
        </div>
      </section>
    </>
  );
}
