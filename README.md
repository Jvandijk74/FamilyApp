# 👨‍👩‍👧‍👦 FamilyApp

Een moderne familie-app voor Jesse en Monika om samen te werken aan agenda's, boodschappenlijsten en gebruik te maken van AI-assistentie.

## ✨ Functies

- **📅 Agenda**: Beheer gezamenlijke afspraken en activiteiten
- **🛒 Boodschappenlijst**: Houd een gezamenlijke boodschappenlijst bij
- **💬 AI Chat**: Vraag de AI-assistent om hulp met planning en boodschappen
- **👥 Multi-user**: Beide gebruikers kunnen inloggen en samenwerken
- **🔐 Veilig**: JWT-authenticatie en wachtwoord hashing
- **☁️ Cloud Database**: Supabase PostgreSQL database voor real-time synchronisatie

## 🚀 Technologie Stack

### Backend
- Node.js + Express
- Supabase (PostgreSQL) database
- JWT authenticatie
- Claude AI (Anthropic) voor chat functionaliteit

### Frontend
- React 18
- Vite
- React Router voor navigatie
- Tailwind CSS voor styling
- Axios voor API communicatie

## 📦 Installatie

### Vereisten
- Node.js 18+ en npm
- Een Supabase account en project
- Een Anthropic API key (voor AI chat functionaliteit)

### 1. Repository clonen

```bash
git clone <repository-url>
cd FamilyApp
```

### 2. Supabase Database Setup

**⚠️ BELANGRIJK: Doe dit eerst!**

Volg de instructies in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) om je Supabase database op te zetten.

Samenvatting:
1. Ga naar https://supabase.com/dashboard/project/prjhsnkudzmphnnhyicj
2. Open de SQL Editor
3. Voer de SQL uit het bestand `backend/supabase-migration.sql` uit

### 3. Backend Setup

```bash
cd backend

# Dependencies installeren
npm install

# .env file is al geconfigureerd met Supabase credentials
# Voeg alleen je Anthropic API key toe
nano .env
```

Bewerk `.env` en voeg je Anthropic API key toe:
```
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

Je kunt een API key krijgen op: https://console.anthropic.com/

### 4. Frontend Setup

```bash
cd ../frontend

# Dependencies installeren
npm install

# .env file is al geconfigureerd
```

## 🎯 Applicatie Starten

### Backend starten

```bash
cd backend
npm run dev
```

De backend draait nu op: http://localhost:3000

Je zou moeten zien:
```
✅ Supabase client initialized successfully
🔗 Connected to: https://prjhsnkudzmphnnhyicj.supabase.co
```

### Frontend starten (in een nieuwe terminal)

```bash
cd frontend
npm run dev
```

De frontend draait nu op: http://localhost:5173

## 👥 Account Aanmaken

1. Ga naar http://localhost:5173
2. Klik op "Registreer hier"
3. Maak accounts aan voor beide gebruikers:
   - Jesse
   - Monika

## 📱 Gebruik

### Dashboard
- Overzicht van afspraken vandaag
- Actieve boodschappen
- Snelle acties

### Agenda
- Bekijk alle afspraken
- Voeg nieuwe afspraken toe
- Bewerk of verwijder afspraken
- Zie wie welke afspraak heeft toegevoegd

### Boodschappenlijst
- Voeg items toe aan de boodschappenlijst
- Vink items af als ze gekocht zijn
- Categoriseer items
- Voeg hoeveelheden toe

### AI Chat
- Vraag "Wat moeten wij vandaag doen?"
- Vraag "Welke boodschappen moeten we halen?"
- De AI heeft toegang tot jullie agenda en boodschappenlijst
- Krijg intelligente samenvattingen en suggesties

## 🔧 API Endpoints

### Authenticatie
- `POST /api/auth/register` - Registreer nieuwe gebruiker
- `POST /api/auth/login` - Inloggen
- `GET /api/auth/me` - Huidige gebruiker ophalen

### Agenda
- `GET /api/calendar` - Alle afspraken ophalen
- `GET /api/calendar/today` - Afspraken van vandaag
- `POST /api/calendar` - Nieuwe afspraak aanmaken
- `PUT /api/calendar/:id` - Afspraak bewerken
- `DELETE /api/calendar/:id` - Afspraak verwijderen

### Boodschappen
- `GET /api/shopping` - Alle items ophalen
- `GET /api/shopping/active` - Actieve items ophalen
- `POST /api/shopping` - Nieuw item aanmaken
- `PUT /api/shopping/:id` - Item bewerken
- `PATCH /api/shopping/:id/toggle` - Item afvinken/opnieuw activeren
- `DELETE /api/shopping/:id` - Item verwijderen
- `DELETE /api/shopping/completed/clear` - Alle afgevinkte items verwijderen

### AI Chat
- `POST /api/chat` - Bericht sturen naar AI
- `GET /api/chat/history` - Chat geschiedenis ophalen
- `DELETE /api/chat/history` - Chat geschiedenis wissen

## 🗄️ Database Schema

De Supabase PostgreSQL database bevat de volgende tabellen:

- **users** - Gebruikers (Jesse en Monika) met UUID primary keys
- **calendar_events** - Agenda afspraken
- **shopping_items** - Boodschappenlijst items
- **chat_history** - AI chat geschiedenis

Zie [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) voor het complete schema.

## ☁️ Supabase Features

### Voordelen
- **Cloud Database**: Toegankelijk vanaf elk device
- **Real-time**: Updates worden direct gesynchroniseerd
- **Auto Backup**: Automatische backups van je data
- **Schaalbaar**: Groeit mee met je gebruik
- **Veilig**: Row Level Security ingebouwd

### Database Beheren
- Bekijk je data: https://supabase.com/dashboard/project/prjhsnkudzmphnnhyicj
- Klik op "Table Editor" om data te bekijken en bewerken
- Gebruik "SQL Editor" voor geavanceerde queries

## 🔒 Beveiliging

- Wachtwoorden worden gehashed met bcrypt
- JWT tokens voor authenticatie
- Tokens verlopen na 7 dagen
- CORS ingeschakeld voor frontend communicatie
- Row Level Security (RLS) in Supabase
- Alle database queries gebruiken prepared statements

## 🚀 Production Deployment

Voor production deployment:

1. **Supabase Database**:
   - Database is al in de cloud en production-ready!
   - Geen extra configuratie nodig

2. **Backend**:
   - Verander `JWT_SECRET` in `.env` naar een sterke random string
   - Deploy naar een Node.js hosting platform (bijv. Railway, Render, Heroku)
   - Voeg environment variabelen toe (SUPABASE_URL, SUPABASE_ANON_KEY, JWT_SECRET, ANTHROPIC_API_KEY)

3. **Frontend**:
   - Update `VITE_API_URL` naar je production API URL
   - Build de frontend: `npm run build`
   - Deploy de `dist` folder naar een static hosting (bijv. Netlify, Vercel)

## 📝 TODO / Toekomstige Features

- [ ] Push notificaties voor afspraken
- [ ] Real-time updates (Supabase Realtime)
- [ ] Gedeelde foto's en bestanden
- [ ] Kalender weergave (maand/week view)
- [ ] Herhalende afspraken
- [ ] Boodschappen categorieën filters
- [ ] Export boodschappenlijst
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] Voice input voor boodschappen
- [ ] Delen van specifieke lijsten met vrienden/familie

## 🤝 Ontwikkeld voor

Jesse en Monika - Een moderne manier om jullie gezamenlijke planning te beheren!

## 📄 Licentie

Deze app is gemaakt voor persoonlijk gebruik.

## 💡 Support

Voor vragen of problemen:
- Check [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) voor database setup hulp
- Open een issue in deze repository

---

Veel plezier met jullie FamilyApp! 🎉
