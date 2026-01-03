import { Metadata } from 'next';
import { businessConfig } from '@/config/appConfig';

export const metadata: Metadata = {
    title: 'Datenschutz',
    description: 'Datenschutzerklärung und Informationen zum Umgang mit Ihren Daten',
};

export default function DatenschutzPage() {
    return (
        <>
            <section className="page-header">
                <div className="container">
                    <h1>Datenschutzerklärung</h1>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="legal-content">
                        <div className="alert alert-info">
                            <strong>Demo-Hinweis:</strong> Dies ist ein Platzhalter für die Datenschutzerklärung. In einer echten Anwendung muss hier eine vollständige, DSGVO-konforme Datenschutzerklärung stehen.
                        </div>

                        <h2>1. Datenschutz auf einen Blick</h2>

                        <h3>Allgemeine Hinweise</h3>
                        <p>
                            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
                            personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene
                            Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                        </p>

                        <h3>Datenerfassung auf dieser Website</h3>
                        <p>
                            <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
                            Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber.
                            Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
                        </p>

                        <h2>2. Allgemeine Hinweise und Pflichtinformationen</h2>

                        <h3>Datenschutz</h3>
                        <p>
                            Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst.
                            Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den
                            gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
                        </p>

                        <h3>Hinweis zur verantwortlichen Stelle</h3>
                        <p>
                            Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
                        </p>
                        <p>
                            <strong>{businessConfig.name}</strong><br />
                            {businessConfig.address}<br />
                            {businessConfig.city}<br />
                            Telefon: {businessConfig.phone}<br />
                            E-Mail: {businessConfig.email}
                        </p>

                        <h2>3. Datenerfassung auf dieser Website</h2>

                        <h3>Terminbuchungen</h3>
                        <p>
                            Wenn Sie einen Termin über unsere Website buchen, erheben wir folgende Daten:
                        </p>
                        <ul>
                            <li>Name (Pflichtfeld)</li>
                            <li>Telefonnummer (Pflichtfeld)</li>
                            <li>E-Mail-Adresse (optional)</li>
                            <li>Notizen zum Termin (optional)</li>
                            <li>Gewählte Terminart, Datum und Uhrzeit</li>
                        </ul>
                        <p>
                            Diese Daten werden lokal in Ihrem Browser (localStorage) gespeichert und nicht
                            an externe Server übermittelt. Die Daten werden verwendet, um Ihren Termin zu
                            verwalten und Sie ggf. kontaktieren zu können.
                        </p>

                        <h3>Speicherdauer</h3>
                        <p>
                            Die Buchungsdaten werden in Ihrem Browser gespeichert, bis Sie diese löschen oder
                            die Browser-Daten zurücksetzen.
                        </p>

                        <h2>4. Ihre Rechte</h2>
                        <p>
                            Sie haben jederzeit das Recht:
                        </p>
                        <ul>
                            <li>Auskunft über Ihre gespeicherten Daten zu erhalten</li>
                            <li>Berichtigung unrichtiger Daten zu verlangen</li>
                            <li>Löschung Ihrer Daten zu verlangen</li>
                            <li>Einschränkung der Verarbeitung zu verlangen</li>
                            <li>Datenübertragbarkeit zu verlangen</li>
                            <li>Widerspruch gegen die Verarbeitung einzulegen</li>
                        </ul>
                        <p>
                            Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit
                            an uns wenden.
                        </p>

                        <h2>5. Plugins und Tools</h2>

                        <h3>Google Fonts (lokal)</h3>
                        <p>
                            Diese Seite nutzt zur einheitlichen Darstellung von Schriftarten so genannte
                            Google Fonts, die lokal installiert sind. Eine Verbindung zu Servern von
                            Google findet dabei nicht statt.
                        </p>

                        <h2>6. Änderungen</h2>
                        <p>
                            Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets
                            den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer
                            Leistungen in der Datenschutzerklärung umzusetzen.
                        </p>
                        <p>
                            <em>Stand: Januar 2026</em>
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
