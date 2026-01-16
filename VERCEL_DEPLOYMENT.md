# 🚀 Vercel Deployment Guide voor FamilyApp

Complete stap-voor-stap instructies om FamilyApp te deployen op Vercel via Git (geen terminal nodig!).

## 📋 Voorbereiding

### 1. Supabase Database Setup (EERST!)

⚠️ **Doe dit eerst voordat je gaat deployen:**

1. Ga naar: https://supabase.com/dashboard/project/prjhsnkudzmphnnhyicj
2. Klik op **"SQL Editor"** in het linkermenu
3. Klik op **"New Query"**
4. Open het bestand `backend/supabase-migration.sql` in GitHub
5. Kopieer de VOLLEDIGE inhoud
6. Plak in de Supabase SQL Editor
7. Klik op **"Run"**
8. ✅ Je database is nu klaar!

### 2. Anthropic API Key (optioneel voor AI chat)

1. Ga naar: https://console.anthropic.com/
2. Maak een account of log in
3. Ga naar "API Keys"
4. Klik op "Create Key"
5. Kopieer de key (begint met `sk-ant-`)
6. **Bewaar deze veilig** - je hebt hem zo nodig!

---

## 🎯 Stap 1: Backend Deployen

### 1.1 Ga naar Vercel Dashboard

1. Ga naar: https://vercel.com/new
2. Log in met je GitHub account
3. Klik op **"Import Git Repository"**
4. Selecteer je **FamilyApp** repository

### 1.2 Backend Project Configureren

1. **Project Name:** `familyapp-backend` (of een andere naam)
2. **Framework Preset:** Other
3. **Root Directory:** Klik op **"Edit"** en selecteer `backend`
4. **Build Command:** Laat leeg of `npm install`
5. **Output Directory:** Laat leeg
6. **Install Command:** `npm install`

### 1.3 Environment Variables Toevoegen

⚠️ **BELANGRIJK**: Klik op **"Environment Variables"** en voeg deze toe:

| Name (Variable Name) | Value (Waarde) |
|---------------------|----------------|
| `PORT` | `3000` |
| `JWT_SECRET` | `familie-app-jwt-production-secret-2024-verander-dit-naar-random-string` |
| `SUPABASE_URL` | `https://prjhsnkudzmphnnhyicj.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByamhzbmt1ZHptcGhubmh5aWNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NDg2MTMsImV4cCI6MjA4NDEyNDYxM30.5AFNZK5Ae0nJdPLyrCqo5dg9-TAOuRU_1p0_ro2SZyE` |
| `ANTHROPIC_API_KEY` | `sk-ant-jouw-key-hier` (of laat leeg als je AI chat niet nu wilt) |

**Voor elk variable:**
1. Vul de **Name** in (bijv: `PORT`)
2. Vul de **Value** in (zie tabel hierboven)
3. Klik op **"Add"**
4. Herhaal voor alle 5 variables

### 1.4 Deploy Backend

1. Klik op **"Deploy"**
2. Wacht 2-3 minuten terwijl Vercel je backend bouwt
3. ✅ Je backend is live!
4. **Kopieer de URL** (bijv: `https://familyapp-backend.vercel.app`)

---

## 🎨 Stap 2: Frontend Deployen

### 2.1 Nieuwe Vercel Project

1. Ga terug naar: https://vercel.com/new
2. Selecteer opnieuw je **FamilyApp** repository
3. Vercel vraagt of je een nieuw project wilt maken - klik **"Yes"**

### 2.2 Frontend Project Configureren

1. **Project Name:** `familyapp` of `familyapp-frontend`
2. **Framework Preset:** Vite (wordt automatisch gedetecteerd)
3. **Root Directory:** Klik op **"Edit"** en selecteer `frontend`
4. **Build Command:** `npm run build` (wordt automatisch ingevuld)
5. **Output Directory:** `dist` (wordt automatisch ingevuld)
6. **Install Command:** `npm install` (wordt automatisch ingevuld)

### 2.3 Environment Variable Toevoegen

⚠️ **BELANGRIJK**: Gebruik de URL van je backend (uit Stap 1.4)!

Klik op **"Environment Variables"** en voeg toe:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://jouw-backend-url.vercel.app/api` |

**Vervang** `jouw-backend-url` met de echte URL van je backend!

Voorbeeld: Als je backend URL is `https://familyapp-backend-xyz123.vercel.app`, dan gebruik je:
```
https://familyapp-backend-xyz123.vercel.app/api
```

⚠️ **Let op:** Vergeet niet `/api` aan het einde!

### 2.4 Deploy Frontend

1. Klik op **"Deploy"**
2. Wacht 2-3 minuten terwijl Vercel je frontend bouwt
3. ✅ Je frontend is live!
4. Klik op de URL om je app te openen!

---

## 🎉 Stap 3: Testen

### 3.1 Open je App

1. Klik op de frontend URL (bijv: `https://familyapp.vercel.app`)
2. Je zou de FamilyApp login pagina moeten zien

### 3.2 Maak Accounts Aan

1. Klik op **"Registreer hier"**
2. Maak een account voor Jesse:
   - Naam: `Jesse`
   - Email: `jesse@familie.app`
   - Wachtwoord: (kies zelf)
3. Log uit en maak een account voor Monika:
   - Naam: `Monika`
   - Email: `monika@familie.app`
   - Wachtwoord: (kies zelf)

### 3.3 Test de Functionaliteit

✅ **Test Dashboard** - Zie je het dashboard?
✅ **Test Agenda** - Voeg een afspraak toe
✅ **Test Boodschappen** - Voeg een item toe aan de lijst
✅ **Test AI Chat** - Probeer: "Wat moeten we vandaag doen?"

---

## 🔐 Environment Variables Overzicht

### Backend Environment Variables

```
PORT=3000
JWT_SECRET=familie-app-jwt-production-secret-2024-verander-dit-naar-random-string
SUPABASE_URL=https://prjhsnkudzmphnnhyicj.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByamhzbmt1ZHptcGhubmh5aWNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NDg2MTMsImV4cCI6MjA4NDEyNDYxM30.5AFNZK5Ae0nJdPLyrCqo5dg9-TAOuRU_1p0_ro2SZyE
ANTHROPIC_API_KEY=sk-ant-jouw-key-hier
```

### Frontend Environment Variables

```
VITE_API_URL=https://jouw-backend-url.vercel.app/api
```

---

## 🛠️ Troubleshooting

### Frontend kan geen verbinding maken met backend

**Probleem:** Je ziet errors over "network error" of "failed to fetch"

**Oplossing:**
1. Ga naar Vercel Dashboard → je frontend project
2. Ga naar **Settings** → **Environment Variables**
3. Controleer of `VITE_API_URL` de juiste backend URL heeft
4. Moet eindigen met `/api`
5. Na wijziging: Ga naar **Deployments** → klik op de laatste deployment → **"Redeploy"**

### Backend geeft 500 errors

**Probleem:** Backend werkt niet, geeft internal server errors

**Oplossing:**
1. Ga naar Vercel Dashboard → je backend project
2. Controleer of alle 5 environment variables zijn ingesteld
3. Ga naar **Deployments** → klik op de laatste deployment → bekijk de **logs**
4. Controleer of Supabase database schema is uitgevoerd

### AI Chat werkt niet

**Probleem:** Chat geeft error over API key

**Oplossing:**
1. Zorg dat je een Anthropic API key hebt
2. Ga naar Vercel Dashboard → backend project → **Settings** → **Environment Variables**
3. Voeg `ANTHROPIC_API_KEY` toe met je key
4. **Redeploy** de backend

### Database errors

**Probleem:** "relation does not exist" of "table not found"

**Oplossing:**
1. Je hebt het SQL script nog niet uitgevoerd
2. Ga naar Supabase Dashboard
3. Voer `backend/supabase-migration.sql` uit in de SQL Editor

---

## 🔄 Updates Deployen

Wanneer je code wijzigt in GitHub:

1. Push je wijzigingen naar GitHub
2. Vercel detecteert automatisch de wijziging
3. Vercel bouwt en deployt automatisch de nieuwe versie
4. Na ~2 minuten is je update live! 🎉

**Let op:** Als je environment variables wijzigt, moet je handmatig redeployen!

---

## 📊 Vercel Dashboard URLs

### Je Projects

- Backend: https://vercel.com/dashboard
- Frontend: https://vercel.com/dashboard

### Handige Links

- **Deployments bekijken:** Ga naar je project → Deployments tab
- **Logs bekijken:** Klik op een deployment → Runtime Logs
- **Environment Variables wijzigen:** Settings → Environment Variables
- **Custom Domain toevoegen:** Settings → Domains

---

## 🎯 Production Checklist

Voordat je de app aan anderen geeft:

- [ ] Supabase SQL script uitgevoerd
- [ ] Backend gedeployed en werkt
- [ ] Frontend gedeployed en werkt
- [ ] Beide accounts (Jesse & Monika) aangemaakt
- [ ] Agenda functie getest
- [ ] Boodschappen functie getest
- [ ] AI Chat getest (als Anthropic key is toegevoegd)
- [ ] `JWT_SECRET` veranderd naar een sterke random string

---

## 💡 Tips

### JWT Secret Generator

Gebruik deze site voor een sterke JWT secret:
https://randomkeygen.com/

Kies een key uit "CodeIgniter Encryption Keys" (256-bit)

### Anthropic API Kosten

- Je betaalt per gebruik (pay-as-you-go)
- Ongeveer $0.003 per chat bericht
- Zet een spending limit in je Anthropic account!

### Custom Domain

Je kunt een eigen domein koppelen:
1. Koop een domein (bijv. bij Vercel Domains of Namecheap)
2. Ga naar Vercel → Settings → Domains
3. Voeg je domein toe
4. Volg de DNS instructies

---

## 🎉 Klaar!

Je FamilyApp draait nu op Vercel! 🚀

- **Frontend:** `https://jouw-app.vercel.app`
- **Backend:** `https://jouw-backend.vercel.app`
- **Database:** Supabase (al geconfigureerd)

Veel plezier met jullie app! 💙

---

## 📞 Support

Problemen? Check:
- [README.md](./README.md) - Algemene documentatie
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Database setup
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
