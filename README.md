# BikeWerkstatt Demo

Ein modernes Online-Terminbuchungssystem für Fahrradwerkstätten. Entwickelt als Verkaufsdemo mit Next.js 14 und TypeScript.

## 🚴 Über das Projekt

Dieses Projekt demonstriert ein vollständiges Terminbuchungssystem für eine Fahrradwerkstatt:

- **Online-Terminbuchung** für Beratung, Reparatur und Probefahrt
- **Admin-Panel** zur Verwaltung aller Buchungen
- **Responsive Design** für Desktop und Mobile
- **Lokale Datenspeicherung** via localStorage (keine Datenbank erforderlich)

## 🚀 Schnellstart

### Voraussetzungen

- Node.js 18 oder höher
- npm oder yarn

### Lokale Installation

```bash
# Repository klonen / in den Projektordner wechseln
cd bikewerkstatt-demo

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die Anwendung läuft dann unter [http://localhost:3000](http://localhost:3000).

## 📁 Projektstruktur

```
bikewerkstatt-demo/
├── src/
│   ├── app/                    # Next.js App Router Seiten
│   │   ├── page.tsx            # Startseite
│   │   ├── booking/page.tsx    # Buchungsseite
│   │   ├── services/page.tsx   # Leistungen
│   │   ├── pricing/page.tsx    # Preise
│   │   ├── contact/page.tsx    # Kontakt
│   │   ├── admin/page.tsx      # Admin-Panel
│   │   ├── impressum/page.tsx  # Impressum
│   │   ├── datenschutz/page.tsx # Datenschutz
│   │   ├── layout.tsx          # Root Layout
│   │   └── globals.css         # Globale Styles
│   │
│   ├── components/             # React-Komponenten
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   │
│   ├── config/
│   │   └── appConfig.ts        # Zentrale Konfiguration
│   │
│   ├── lib/                    # Utility-Funktionen
│   │   ├── storage.ts          # localStorage-Operationen
│   │   ├── slots.ts            # Slot-Generierung
│   │   ├── time.ts             # Zeit-Utilities
│   │   ├── validation.ts       # Formulavalidierung
│   │   └── csv.ts              # CSV-Export
│   │
│   └── types.ts                # TypeScript-Typen
│
├── public/                     # Statische Dateien
├── README.md
├── QA_CHECKLIST.md
└── package.json
```

## ⚙️ Konfiguration

Alle Einstellungen befinden sich in `src/config/appConfig.ts`:

### Geschäftsdaten ändern

```typescript
export const businessConfig = {
  name: 'Ihr Firmenname',
  address: 'Ihre Straße 123',
  city: '12345 Ihre Stadt',
  phone: '+49 123 456789',
  email: 'info@ihre-domain.de',
};
```

### Terminarten anpassen

```typescript
export const appointmentTypes = [
  {
    id: 'beratung',
    name: 'Beratung E-Bike / Kauf',
    description: 'Persönliche Beratung...',
    durationMinutes: 45,
    bufferMinutes: 10,
    icon: '💬',
  },
  // Weitere Terminarten hier hinzufügen oder ändern
];
```

### Öffnungszeiten ändern

```typescript
export const weeklySchedule = {
  0: { open: '', close: '', closed: true },      // Sonntag - geschlossen
  1: { open: '09:00', close: '18:00', closed: false }, // Montag
  2: { open: '09:00', close: '18:00', closed: false }, // Dienstag
  // ... weitere Tage
  6: { open: '10:00', close: '14:00', closed: false }, // Samstag
};
```

### Buchungsregeln anpassen

```typescript
export const bookingRules = {
  slotStepMinutes: 15,    // Zeitintervall zwischen Slots
  leadTimeHours: 4,       // Mindestvorlaufzeit in Stunden
  maxDaysAhead: 30,       // Maximale Vorausbuchung in Tagen
};
```

### Admin-PIN ändern

```typescript
export const adminPin = '1234'; // Ihr neuer PIN
```

## 🌐 Deployment

### Vercel (empfohlen)

1. Repository zu GitHub/GitLab pushen
2. [vercel.com](https://vercel.com) besuchen
3. "Import Project" → Repository auswählen
4. Automatisches Deployment aktivieren

```bash
# Oder via CLI
npm i -g vercel
vercel
```

### Manuelle Build

```bash
npm run build
npm run start
```

## 🔧 Für echte Kunden anpassen

### Schritt 1: Branding
- Logo in `public/` ablegen und in Header/Footer einbinden
- Farben in `globals.css` anpassen (CSS Custom Properties)
- Texte in den Page-Komponenten ändern

### Schritt 2: Geschäftsdaten
- `appConfig.ts` mit echten Daten befüllen
- Öffnungszeiten anpassen
- Terminarten definieren

### Schritt 3: Rechtliches
- Impressum mit echten Angaben ausfüllen
- Datenschutzerklärung erstellen lassen
- Bei Bedarf Cookie-Banner implementieren

### Schritt 4: Backend (optional)
Für Produktivbetrieb sollte localStorage durch eine echte Datenbank ersetzt werden:

1. Supabase, Firebase oder eigenes Backend einbinden
2. `src/lib/storage.ts` anpassen
3. E-Mail-Benachrichtigungen für neue Buchungen hinzufügen

## 📊 Admin-Bereich

Der Admin-Bereich ist unter `/admin` erreichbar:

- **PIN**: Standardmäßig `1234` (in `appConfig.ts` änderbar)
- **Funktionen**:
  - Alle Buchungen anzeigen
  - Status ändern (Angefragt → Bestätigt → Storniert)
  - Buchungen löschen
  - CSV-Export für alle Buchungen
  - Demo-Daten zurücksetzen

## 🧪 Lokale Tests

Siehe `QA_CHECKLIST.md` für eine vollständige Checkliste aller Funktionen, die vor dem Go-Live getestet werden sollten.

## 📄 Lizenz

MIT License - Frei verwendbar für kommerzielle und private Projekte.

---

Entwickelt mit ❤️ und Next.js
