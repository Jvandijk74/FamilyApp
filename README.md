# 👨‍👩‍👧‍👦 FamilyApp

Een moderne familie-app voor Jesse en Monika om samen te werken aan agenda's, boodschappenlijsten en gebruik te maken van AI-assistentie.

## 🚀 Snel Starten - Vercel Deployment

**Wil je de app direct online zetten via Vercel?**

👉 **Volg de complete guide:** [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

📋 **Environment variables nodig?** Zie [ENVIRONMENT_VARIABLES.txt](./ENVIRONMENT_VARIABLES.txt)

---

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
- Supabase (PostgreSQL) cloud database
- JWT authenticatie
- **Google Gemini AI** voor chat functionaliteit (gratis tier!)

### Frontend
- React 18
- Vite
- React Router voor navigatie
- Tailwind CSS voor styling
- Axios voor API communicatie

---

## ⚡ Deployment via Vercel (Aanbevolen!)

**Je hoeft NIETS lokaal te installeren!** Vercel doet alles automatisch via Git.

### Wat je nodig hebt:
1. ✅ GitHub account (heb je al!)
2. ✅ Vercel account (gratis op https://vercel.com)
3. ✅ 5 minuten tijd

### Stappen:
1. **Database Setup** (1x, 2 minuten)
   - Ga naar Supabase en voer het SQL script uit
   - Zie [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

2. **Deploy via Vercel** (3 minuten)
   - Volg [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
   - Alle environment variables staan in [ENVIRONMENT_VARIABLES.txt](./ENVIRONMENT_VARIABLES.txt)

**Klaar!** Je app is live zonder lokale setup! 🎉

---

## 💻 Lokale Ontwikkeling (Optioneel)

*Alleen nodig als je de code lokaal wilt testen of aanpassen*

<details>
<summary>Klik hier voor lokale installatie instructies</summary>

### Vereisten
- Node.js 18+ en npm

### 1. Repository clonen

```bash
git clone <repository-url>
cd FamilyApp
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Bewerk `backend/.env`:
```
GOOGLE_API_KEY=AIzaSyBuU77JaeqExvJAzGoVFkkGUaseKpQ6SbQ
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Applicatie Starten

**Backend:**
```bash
cd backend
npm run dev
```

De backend draait nu op: http://localhost:3000

**Frontend:**
```bash
cd frontend
npm run dev
```

De frontend draait nu op: http://localhost:5173

</details>

---

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

**Aanbevolen: Vercel**

De makkelijkste manier is via Vercel (geen terminal nodig!):

👉 **Volg:** [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

<details>
<summary>Handmatige deployment naar andere platformen</summary>

1. **Supabase Database**:
   - Database is al in de cloud en production-ready!
   - Voer het SQL script uit (zie SUPABASE_SETUP.md)

2. **Backend** (bijv. Railway, Render, Heroku):
   - Deploy de `backend` folder
   - Voeg environment variabelen toe: `PORT`, `JWT_SECRET`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `GOOGLE_API_KEY`

3. **Frontend** (bijv. Netlify, Vercel):
   - Build: `npm run build` in frontend folder
   - Deploy de `dist` folder
   - Voeg environment variable toe: `VITE_API_URL` (je backend URL + /api)

</details>

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
