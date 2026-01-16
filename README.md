# 👨‍👩‍👧‍👦 FamilyApp

Een moderne familie-app voor Jesse en Monika om samen te werken aan agenda's, boodschappenlijsten en gebruik te maken van AI-assistentie.

## ✨ Functies

- **📅 Agenda**: Beheer gezamenlijke afspraken en activiteiten
- **🛒 Boodschappenlijst**: Houd een gezamenlijke boodschappenlijst bij
- **💬 AI Chat**: Vraag de AI-assistent om hulp met planning en boodschappen
- **👥 Multi-user**: Beide gebruikers kunnen inloggen en samenwerken
- **🔐 Veilig**: JWT-authenticatie en wachtwoord hashing

## 🚀 Technologie Stack

### Backend
- Node.js + Express
- SQLite database
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
- Een Anthropic API key (voor AI chat functionaliteit)

### 1. Repository clonen

```bash
git clone <repository-url>
cd FamilyApp
```

### 2. Backend Setup

```bash
cd backend

# Dependencies installeren
npm install

# .env file aanmaken
cp .env.example .env

# Bewerk .env en voeg je Anthropic API key toe
nano .env
```

Bewerk `.env` en voeg je Anthropic API key toe:
```
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

Je kunt een API key krijgen op: https://console.anthropic.com/

### 3. Frontend Setup

```bash
cd ../frontend

# Dependencies installeren
npm install

# .env file aanmaken (optioneel, gebruikt standaard localhost:3000)
cp .env.example .env
```

## 🎯 Applicatie Starten

### Backend starten

```bash
cd backend
npm run dev
```

De backend draait nu op: http://localhost:3000

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

De SQLite database bevat de volgende tabellen:

- **users** - Gebruikers (Jesse en Monika)
- **calendar_events** - Agenda afspraken
- **shopping_items** - Boodschappenlijst items
- **chat_history** - AI chat geschiedenis

## 🎨 Screenshots

### Dashboard
Overzicht van vandaag's afspraken en actieve boodschappen

### Agenda
Beheer alle afspraken met datum, tijd en locatie

### Boodschappenlijst
Houd bij wat er gekocht moet worden

### AI Chat
Intelligente assistent die helpt met planning

## 🔒 Beveiliging

- Wachtwoorden worden gehashed met bcrypt
- JWT tokens voor authenticatie
- Tokens verlopen na 7 dagen
- CORS ingeschakeld voor frontend communicatie

## 🚀 Production Deployment

Voor production deployment:

1. **Backend**:
   - Verander `JWT_SECRET` in `.env`
   - Configureer een production database (bijv. PostgreSQL)
   - Deploy naar een Node.js hosting platform (bijv. Railway, Render, Heroku)

2. **Frontend**:
   - Update `VITE_API_URL` naar je production API URL
   - Build de frontend: `npm run build`
   - Deploy de `dist` folder naar een static hosting (bijv. Netlify, Vercel)

## 📝 TODO / Toekomstige Features

- [ ] Push notificaties voor afspraken
- [ ] Gedeelde foto's en bestanden
- [ ] Kalender weergave (maand/week view)
- [ ] Herhalende afspraken
- [ ] Boodschappen categorieën filters
- [ ] Export boodschappenlijst
- [ ] Dark mode
- [ ] Mobile app (React Native)

## 🤝 Ontwikkeld voor

Jesse en Monika - Een moderne manier om jullie gezamenlijke planning te beheren!

## 📄 Licentie

Deze app is gemaakt voor persoonlijk gebruik.

## 💡 Support

Voor vragen of problemen, open een issue in deze repository.

---

Veel plezier met jullie FamilyApp! 🎉
