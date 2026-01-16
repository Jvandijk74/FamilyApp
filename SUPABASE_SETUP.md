# 🗄️ Supabase Database Setup voor FamilyApp

Deze app gebruikt Supabase als cloud database. Volg deze stappen om de database op te zetten.

## ✅ Stap 1: Supabase Project Aanmaken (Optioneel)

Je hebt al een Supabase project aangemaakt met de volgende credentials:
- **URL:** https://prjhsnkudzmphnnhyicj.supabase.co
- **Anon Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByamhzbmt1ZHptcGhubmh5aWNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NDg2MTMsImV4cCI6MjA4NDEyNDYxM30.5AFNZK5Ae0nJdPLyrCqo5dg9-TAOuRU_1p0_ro2SZyE

Deze credentials zijn al geconfigureerd in de app.

## 📋 Stap 2: Database Schema Aanmaken

1. Ga naar je Supabase Dashboard: https://supabase.com/dashboard/project/prjhsnkudzmphnnhyicj
2. Klik op "SQL Editor" in het linker menu
3. Klik op "New Query"
4. Kopieer de VOLLEDIGE inhoud van het bestand `backend/supabase-migration.sql`
5. Plak de SQL in de SQL Editor
6. Klik op "Run" om de query uit te voeren

### Wat wordt er aangemaakt?

Het SQL script maakt de volgende tabellen aan:

- **users** - Gebruikers (Jesse en Monika)
  - id (UUID)
  - name (TEXT)
  - email (TEXT, unique)
  - password (TEXT, gehashed)
  - created_at (TIMESTAMP)

- **calendar_events** - Agenda afspraken
  - id (UUID)
  - title (TEXT)
  - description (TEXT, optioneel)
  - start_date (TIMESTAMP)
  - end_date (TIMESTAMP, optioneel)
  - location (TEXT, optioneel)
  - user_id (UUID, foreign key naar users)
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)

- **shopping_items** - Boodschappenlijst items
  - id (UUID)
  - name (TEXT)
  - quantity (TEXT, optioneel)
  - category (TEXT, optioneel)
  - is_completed (BOOLEAN)
  - user_id (UUID, foreign key naar users)
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)

- **chat_history** - AI chat geschiedenis
  - id (UUID)
  - user_id (UUID, foreign key naar users)
  - message (TEXT)
  - response (TEXT)
  - created_at (TIMESTAMP)

### Extra Features

Het SQL script configureert ook:

- ✅ **Indexes** voor betere performance
- ✅ **Row Level Security (RLS)** voor beveiliging
- ✅ **Auto-update triggers** voor updated_at timestamps
- ✅ **Foreign key constraints** voor data integriteit

## 🔒 Stap 3: Beveiliging Configuratie

De database is geconfigureerd met Row Level Security (RLS):

- **Alle authenticated gebruikers** kunnen:
  - Lezen: Alle agenda items, boodschappen en chat history
  - Creëren: Nieuwe items in alle tabellen
  - Updaten: Alle items (behalve andere gebruikers)
  - Verwijderen: Alle items (behalve andere gebruikers)

Dit zorgt ervoor dat Jesse en Monika alles kunnen delen en beheren!

## ✅ Stap 4: Test de Connectie

Nadat je het SQL script hebt uitgevoerd:

1. Start de backend:
   ```bash
   cd backend
   npm run dev
   ```

2. Je zou moeten zien:
   ```
   ✅ Supabase client initialized successfully
   🔗 Connected to: https://prjhsnkudzmphnnhyicj.supabase.co
   ```

3. Test of de database werkt door een account aan te maken via de frontend

## 🎉 Klaar!

Je Supabase database is nu geconfigureerd en klaar voor gebruik!

## 🔍 Database Bekijken

Je kunt je data bekijken in Supabase:
1. Ga naar https://supabase.com/dashboard/project/prjhsnkudzmphnnhyicj
2. Klik op "Table Editor" in het linker menu
3. Je ziet nu alle tabellen en data

## 🛠️ Troubleshooting

### Fout: "relation does not exist"
- Je hebt het SQL script nog niet uitgevoerd
- Voer het `backend/supabase-migration.sql` script uit in de SQL Editor

### Fout: "permission denied"
- Controleer of de RLS policies correct zijn aangemaakt
- Voer het SQL script opnieuw uit

### Geen verbinding met Supabase
- Controleer of de SUPABASE_URL en SUPABASE_ANON_KEY correct zijn in `.env`
- Check je internet verbinding

## 📝 Handige Supabase Features

### Real-time Updates
Supabase ondersteunt real-time updates. In de toekomst kunnen jullie:
- Live updates zien wanneer de ander een item toevoegt
- Push notificaties ontvangen voor nieuwe afspraken

### Backup & Recovery
- Supabase maakt automatisch backups van je database
- Je kunt oude versies terugzetten via het dashboard

### API Browser
- Bekijk de automatisch gegenereerde API documentatie
- Ga naar "API Docs" in je Supabase dashboard

---

**Veel success met jullie FamilyApp! 🎊**
