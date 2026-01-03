# QA Checkliste - BikeWerkstatt Demo

Diese Checkliste enthält alle Tests, die vor einem Go-Live durchgeführt werden sollten.

## 📱 Allgemeine Tests

### Navigation
- [ ] Alle Menüpunkte funktionieren
- [ ] Mobile Hamburger-Menü öffnet und schließt
- [ ] Logo führt zur Startseite
- [ ] Footer-Links funktionieren

### Responsive Design
- [ ] Startseite sieht auf Mobile gut aus
- [ ] Startseite sieht auf Tablet gut aus
- [ ] Startseite sieht auf Desktop gut aus
- [ ] Alle Seiten sind mobil nutzbar

---

## 📅 Buchungssystem

### Schritt 1: Terminart wählen
- [ ] Alle drei Terminarten werden angezeigt
- [ ] Klick auf Karte öffnet Schritt 2
- [ ] Dauer wird korrekt angezeigt

### Schritt 2: Datum wählen
- [ ] "Heute"-Button funktioniert (falls Werktag)
- [ ] Sonntage sind nicht wählbar
- [ ] Zurück-Button funktioniert
- [ ] Maximal 30 Tage in der Zukunft buchbar
- [ ] Vergangene Tage sind nicht sichtbar

### Schritt 3: Uhrzeit wählen
- [ ] Verfügbare Slots werden grün angezeigt
- [ ] Belegte Slots sind ausgegraut
- [ ] Slots innerhalb der 4-Stunden-Vorlaufzeit sind blockiert
- [ ] Slots außerhalb der Öffnungszeiten sind nicht vorhanden
- [ ] Samstag: nur Slots bis 14:00 Uhr
- [ ] Zurück-Button funktioniert

### Schritt 4: Kundendaten
- [ ] Name ist Pflichtfeld
- [ ] Telefon ist Pflichtfeld
- [ ] E-Mail ist optional
- [ ] E-Mail wird validiert (falls eingegeben)
- [ ] Anmerkungen sind optional
- [ ] Fehlermeldungen werden angezeigt
- [ ] Zurück-Button funktioniert

### Schritt 5: Bestätigung
- [ ] Bestätigungsseite wird angezeigt
- [ ] Alle Buchungsdetails sind korrekt
- [ ] "Weiteren Termin buchen" funktioniert
- [ ] "Zur Startseite" funktioniert

### Konfliktprüfung
- [ ] Bei Doppelbuchung wird Fehlermeldung angezeigt
- [ ] Slot wird nach Buchung als belegt markiert
- [ ] Puffer zwischen Terminen wird berücksichtigt

---

## 🔐 Admin-Panel

### PIN-Gate
- [ ] Admin (/admin) zeigt PIN-Eingabe
- [ ] Falscher PIN zeigt Fehlermeldung
- [ ] Korrekter PIN (1234) öffnet Dashboard
- [ ] Session bleibt erhalten (Tab-Wechsel)

### Dashboard
- [ ] Statistiken werden korrekt angezeigt
- [ ] Buchungsliste zeigt alle Buchungen
- [ ] Filter funktioniert (Alle/Angefragt/Bestätigt/Storniert)
- [ ] Datum/Uhrzeit werden korrekt formatiert

### Statusverwaltung
- [ ] Status kann auf "Bestätigt" geändert werden
- [ ] Status kann auf "Storniert" geändert werden
- [ ] Status kann auf "Angefragt" zurückgesetzt werden
- [ ] Badge-Farbe ändert sich entsprechend

### Löschen
- [ ] Löschen erfordert Bestätigung
- [ ] Buchung wird nach Bestätigung entfernt
- [ ] Abbrechen bricht Löschen ab

### Export
- [ ] CSV-Export Button funktioniert
- [ ] Datei wird heruntergeladen
- [ ] CSV enthält alle Buchungsdaten
- [ ] Deutsche Umlaute werden korrekt dargestellt

### Demo-Reset
- [ ] "Demo zurücksetzen" erfordert Bestätigung
- [ ] Nach Reset sind alle Buchungen gelöscht

---

## 📄 Statische Seiten

### Startseite
- [ ] Hero-Text wird angezeigt
- [ ] CTAs führen zu /booking
- [ ] Services-Vorschau zeigt alle 3 Terminarten
- [ ] Benefits-Sektion wird angezeigt
- [ ] Kundenstimmen mit Demo-Badge
- [ ] FAQ-Sektion mit 5 Fragen

### Leistungen (/services)
- [ ] Alle Terminarten werden detailliert beschrieben
- [ ] Dauer und Puffer werden angezeigt
- [ ] CTAs führen zu /booking

### Preise (/pricing)
- [ ] Einrichtungspaket wird angezeigt
- [ ] Wartungspaket wird angezeigt
- [ ] Vergleichstabelle ist lesbar
- [ ] FAQ-Sektion ist vorhanden

### Kontakt (/contact)
- [ ] Adresse wird angezeigt
- [ ] Telefonnummer ist klickbar
- [ ] E-Mail ist klickbar
- [ ] Öffnungszeiten sind korrekt
- [ ] Karten-Platzhalter ist vorhanden

### Impressum (/impressum)
- [ ] Demo-Hinweis wird angezeigt
- [ ] Platzhalter-Informationen sind enthalten

### Datenschutz (/datenschutz)
- [ ] Demo-Hinweis wird angezeigt
- [ ] DSGVO-Platzhalter ist enthalten

---

## ⚡ Performance

- [ ] Erste Seite lädt in < 3 Sekunden
- [ ] Seitenwechsel ist flüssig
- [ ] Keine JavaScript-Fehler in der Console
- [ ] Bilder werden korrekt geladen

---

## ✅ Abnahme

| Bereich | Status | Tester | Datum |
|---------|--------|--------|-------|
| Navigation | ⬜ | | |
| Buchungssystem | ⬜ | | |
| Admin-Panel | ⬜ | | |
| Statische Seiten | ⬜ | | |
| Mobile Ansicht | ⬜ | | |
| Performance | ⬜ | | |

---

**Gesamtstatus:** ⬜ Noch nicht getestet

**Hinweis:** Diese Checkliste sollte vor jedem Release vollständig abgearbeitet werden.
