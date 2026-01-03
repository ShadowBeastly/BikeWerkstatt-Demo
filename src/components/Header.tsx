'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { businessConfig } from '@/config/appConfig';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Start' },
    { href: '/booking', label: 'Termin buchen' },
    { href: '/services', label: 'Leistungen' },
    { href: '/pricing', label: 'Preise' },
    { href: '/contact', label: 'Kontakt' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.headerInner}>
          <Link href="/" className={styles.headerLogo}>
            <span className={styles.headerLogoIcon}>🚴</span>
            <span className={styles.headerLogoText}>{businessConfig.name}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className={`${styles.headerNav} ${styles.desktopNav}`}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.headerNavLink} ${isActive(link.href) ? styles.active : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link href="/booking" className={`btn btn-primary btn-sm ${styles.desktopCta}`}>
            Jetzt buchen
          </Link>

          {/* Mobile Menu Button */}
          <button
            className={styles.mobileMenuBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menü öffnen"
          >
            <span className={`${styles.hamburger} ${mobileMenuOpen ? styles.hamburgerOpen : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className={styles.mobileNav}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.mobileNavLink} ${isActive(link.href) ? styles.active : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/booking"
              className="btn btn-primary w-full mt-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Jetzt buchen
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
