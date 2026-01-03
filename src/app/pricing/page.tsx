import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Preise',
    description: 'Transparente Preise für unser Online-Terminbuchungssystem. Einmalige Einrichtung und optionale Wartung.',
};

export default function PricingPage() {
    return (
        <>
            {/* Header */}
            <section className="page-header">
                <div className="container">
                    <h1>Preise</h1>
                    <p className="page-subtitle">
                        Transparente Konditionen für das Buchungssystem
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="section">
                <div className="container">
                    <div className="pricing-grid">
                        {/* Setup */}
                        <div className="pricing-card">
                            <div className="pricing-badge">Einmalig</div>
                            <h2 className="pricing-title">Einrichtung</h2>
                            <div className="pricing-price">
                                <span className="pricing-amount">499</span>
                                <span className="pricing-currency">€</span>
                            </div>
                            <p className="pricing-description">
                                Einmalige Einrichtungsgebühr für Ihr Buchungssystem
                            </p>
                            <ul className="pricing-features">
                                <li>
                                    <span className="pricing-check">✓</span>
                                    Individuelle Anpassung an Ihr Branding
                                </li>
                                <li>
                                    <span className="pricing-check">✓</span>
                                    Konfiguration Ihrer Terminarten
                                </li>
                                <li>
                                    <span className="pricing-check">✓</span>
                                    Festlegung der Öffnungszeiten
                                </li>
                                <li>
                                    <span className="pricing-check">✓</span>
                                    Admin-Zugang mit PIN-Schutz
                                </li>
                                <li>
                                    <span className="pricing-check">✓</span>
                                    CSV-Export Ihrer Buchungen
                                </li>
                                <li>
                                    <span className="pricing-check">✓</span>
                                    Einweisung und Support bei der Einrichtung
                                </li>
                            </ul>
                            <Link href="/contact" className="btn btn-primary w-full">
                                Jetzt anfragen
                            </Link>
                        </div>

                        {/* Maintenance */}
                        <div className="pricing-card featured">
                            <div className="pricing-badge popular">Empfohlen</div>
                            <h2 className="pricing-title">Wartung & Support</h2>
                            <div className="pricing-price">
                                <span className="pricing-amount">49</span>
                                <span className="pricing-currency">€</span>
                                <span className="pricing-period">/Monat</span>
                            </div>
                            <p className="pricing-description">
                                Optionales monatliches Wartungspaket
                            </p>
                            <ul className="pricing-features">
                                <li>
                                    <span className="pricing-check">✓</span>
                                    Technischer Support per E-Mail
                                </li>
                                <li>
                                    <span className="pricing-check">✓</span>
                                    Regelmäßige Updates und Verbesserungen
                                </li>
                                <li>
                                    <span className="pricing-check">✓</span>
                                    Backup und Datensicherheit
                                </li>
                                <li>
                                    <span className="pricing-check">✓</span>
                                    Änderungen an Terminarten und Zeiten
                                </li>
                                <li>
                                    <span className="pricing-check">✓</span>
                                    Deployment inklusive, Domain separat
                                </li>
                                <li>
                                    <span className="pricing-check">✓</span>
                                    Monatlich kündbar
                                </li>
                            </ul>
                            <Link href="/contact" className="btn btn-accent w-full">
                                Jetzt anfragen
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison */}
            <section className="section" style={{ background: 'var(--color-gray-50)' }}>
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Was Sie bekommen</h2>
                    </div>

                    <div className="comparison-table-wrapper">
                        <table className="comparison-table">
                            <thead>
                                <tr>
                                    <th>Funktion</th>
                                    <th>Einrichtung</th>
                                    <th>Wartung</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Online-Terminbuchung</td>
                                    <td className="check">✓</td>
                                    <td className="check">✓</td>
                                </tr>
                                <tr>
                                    <td>Mobil-optimierte Ansicht</td>
                                    <td className="check">✓</td>
                                    <td className="check">✓</td>
                                </tr>
                                <tr>
                                    <td>Admin-Bereich</td>
                                    <td className="check">✓</td>
                                    <td className="check">✓</td>
                                </tr>
                                <tr>
                                    <td>CSV-Export</td>
                                    <td className="check">✓</td>
                                    <td className="check">✓</td>
                                </tr>
                                <tr>
                                    <td>Konfliktprüfung</td>
                                    <td className="check">✓</td>
                                    <td className="check">✓</td>
                                </tr>
                                <tr>
                                    <td>Technischer Support</td>
                                    <td className="dash">—</td>
                                    <td className="check">✓</td>
                                </tr>
                                <tr>
                                    <td>Regelmäßige Updates</td>
                                    <td className="dash">—</td>
                                    <td className="check">✓</td>
                                </tr>
                                <tr>
                                    <td>Deployment inklusive</td>
                                    <td className="dash">—</td>
                                    <td className="check">✓</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Fragen zu den Preisen</h2>
                    </div>

                    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                        {[
                            { q: 'Gibt es versteckte Kosten?', a: 'Nein. Die Preise sind transparent. Es kommen keine weiteren Kosten auf Sie zu, sofern Sie keine zusätzlichen Anpassungen wünschen.' },
                            { q: 'Muss ich das Wartungspaket nehmen?', a: 'Nein, das Wartungspaket ist optional. Sie können das System auch ohne monatliche Gebühren nutzen, haben dann aber keinen Support-Anspruch.' },
                            { q: 'Wie lange dauert die Einrichtung?', a: 'In der Regel ist Ihr Buchungssystem innerhalb von 3-5 Werktagen einsatzbereit.' },
                            { q: 'Kann ich später noch Änderungen vornehmen?', a: 'Ja, mit dem Wartungspaket sind kleinere Anpassungen inklusive. Größere Umbauten werden gesondert berechnet.' },
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
            <section className="section" style={{ background: 'var(--color-primary-600)', color: 'white' }}>
                <div className="container text-center">
                    <h2 style={{ color: 'white', marginBottom: '1rem' }}>Interesse geweckt?</h2>
                    <p style={{ opacity: 0.9, marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
                        Kontaktieren Sie uns für ein unverbindliches Gespräch über Ihr neues Buchungssystem.
                    </p>
                    <Link href="/contact" className="btn btn-lg" style={{ background: 'white', color: 'var(--color-primary-700)' }}>
                        Kontakt aufnehmen
                    </Link>
                </div>
            </section>
        </>
    );
}
