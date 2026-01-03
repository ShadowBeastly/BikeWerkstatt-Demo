import Link from 'next/link';
import { businessConfig, weeklySchedule } from '@/config/appConfig';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerGrid}>
          {/* Brand */}
          <div className={styles.footerSection}>
            <div className={styles.footerLogo}>
              <span className={styles.footerLogoIcon}>🚴</span>
              <span className={styles.footerLogoText}>{businessConfig.name}</span>
            </div>
            <p className={styles.footerDescription}>
              Ihr Partner für E-Bikes, Fahrradreparatur und -beratung in Frankfurt.
              Jetzt online Termine buchen.
            </p>
          </div>

          {/* Quick Links */}
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Navigation</h4>
            <nav className={styles.footerNav}>
              <Link href="/">Start</Link>
              <Link href="/booking">Termin buchen</Link>
              <Link href="/services">Leistungen</Link>
              <Link href="/pricing">Preise</Link>
              <Link href="/contact">Kontakt</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Kontakt</h4>
            <address className={styles.footerAddress}>
              <p>{businessConfig.address}</p>
              <p>{businessConfig.city}</p>
              <p className="mt-2">
                <a href={`tel:${businessConfig.phone.replace(/\s/g, '')}`}>
                  {businessConfig.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${businessConfig.email}`}>
                  {businessConfig.email}
                </a>
              </p>
            </address>
          </div>

          {/* Opening Hours */}
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Öffnungszeiten</h4>
            <div className={styles.footerHours}>
              <p>Mo–Fr: {weeklySchedule[1].open}–{weeklySchedule[1].close} Uhr</p>
              <p>Sa: {weeklySchedule[6].open}–{weeklySchedule[6].close} Uhr</p>
              <p>So: Geschlossen</p>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.footerCopyright}>
            © {currentYear} {businessConfig.name}. Demo-Projekt.
          </p>
          <div className={styles.footerLegal}>
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutz">Datenschutz</Link>
            <Link href="/admin">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
