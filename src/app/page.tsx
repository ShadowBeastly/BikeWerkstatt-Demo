import Link from 'next/link';
import { appointmentTypes, businessConfig } from '@/config/appConfig';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Mehr Zeit in der Werkstatt.<br />Weniger Zeit am Telefon.</h1>
          <p className="hero-subtitle">
            Online-Termine für Beratung, Reparatur und Probefahrt. Klar, schnell, planbar.
          </p>
          <div className="hero-actions">
            <Link href="/booking" className="btn btn-primary btn-lg">
              Termin buchen
            </Link>
            <Link href="/services" className="btn btn-secondary btn-lg">
              Leistungen ansehen
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Unsere Leistungen</h2>
            <p className="section-subtitle">
              Wählen Sie Ihren Termin – wir sind für Sie da
            </p>
          </div>

          <div className="grid grid-3">
            {appointmentTypes.map((type) => (
              <div key={type.id} className="card card-interactive">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{type.icon}</div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{type.name}</h3>
                <p style={{ color: 'var(--color-gray-600)', fontSize: '0.875rem', marginBottom: '1rem' }}>{type.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>
                  <span>⏱️</span>
                  <span>{type.durationMinutes} Minuten</span>
                </div>
                <Link href="/booking" className="btn btn-primary w-full mt-3">
                  Termin buchen
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section" style={{ background: 'var(--color-gray-50)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Warum Online-Termine?</h2>
            <p className="section-subtitle">
              Weniger Telefonieren, mehr Radfahren
            </p>
          </div>

          <div className="grid grid-3">
            {[
              { icon: '📞', title: 'Weniger Anrufe', text: 'Ihre Kunden buchen selbstständig – Sie konzentrieren sich auf die Arbeit.' },
              { icon: '📅', title: 'Bessere Planung', text: 'Sehen Sie auf einen Blick, welche Termine anstehen. Keine Überraschungen mehr.' },
              { icon: '💰', title: 'Mehr Umsatz', text: 'Kunden buchen auch außerhalb der Öffnungszeiten. 24/7 erreichbar.' },
            ].map((benefit, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{benefit.icon}</div>
                <h4 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{benefit.title}</h4>
                <p style={{ color: 'var(--color-gray-600)', fontSize: '0.875rem' }}>{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Das sagen unsere Kunden</h2>
          </div>

          <div className="grid grid-2" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {[
              { avatar: '👨', name: 'Markus S.', quote: 'Endlich keine Warteschleife mehr! Termin online gebucht und pünktlich dran gewesen.' },
              { avatar: '👩', name: 'Sandra K.', quote: 'Super praktisch! Konnte abends um 22 Uhr meinen Werkstatttermin buchen.' },
            ].map((proof, i) => (
              <div key={i} className="social-proof">
                <div className="social-proof-avatar">{proof.avatar}</div>
                <div className="social-proof-text">
                  <p className="social-proof-name">{proof.name}</p>
                  <p className="social-proof-quote">&ldquo;{proof.quote}&rdquo;</p>
                </div>
                <span className="social-proof-badge">Demo</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ background: 'var(--color-gray-50)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Häufige Fragen</h2>
          </div>

          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            {[
              { q: 'Wie weit im Voraus kann ich einen Termin buchen?', a: 'Sie können Termine bis zu 30 Tage im Voraus buchen. Mindestens 4 Stunden vor dem gewünschten Termin.' },
              { q: 'Was kostet die Terminbuchung?', a: 'Die Online-Terminbuchung ist für Sie als Kunde komplett kostenlos. Sie bezahlen nur die vereinbarte Leistung.' },
              { q: 'Kann ich meinen Termin stornieren?', a: 'Ja, bitte rufen Sie uns an oder schreiben Sie eine E-Mail, wenn Sie einen Termin absagen müssen.' },
              { q: 'Welche Fahrräder repariert ihr?', a: 'Wir reparieren alle Fahrradtypen: City-Räder, E-Bikes, Mountainbikes, Rennräder und Kinderfahrräder.' },
              { q: 'Muss ich mein Fahrrad zur Probefahrt mitbringen?', a: 'Nein, für eine Probefahrt fahren Sie eines unserer Räder aus dem Showroom. Bringen Sie nur einen gültigen Ausweis mit.' },
            ].map((faq, i) => (
              <div key={i} className="faq-item">
                <p className="faq-question">{faq.q}</p>
                <p className="faq-answer">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container text-center">
          <h2 style={{ marginBottom: '1rem' }}>Bereit für Ihren Termin?</h2>
          <p className="section-subtitle" style={{ marginBottom: '2rem' }}>
            Buchen Sie jetzt online – schnell, einfach und unverbindlich.
          </p>
          <Link href="/booking" className="btn btn-accent btn-lg">
            Jetzt Termin buchen
          </Link>
        </div>
      </section>
    </>
  );
}
