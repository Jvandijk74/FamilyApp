require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const calendarRoutes = require('./routes/calendar');
const shoppingRoutes = require('./routes/shopping');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/shopping', shoppingRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server (only for local development)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🚀 FamilyApp Backend Server`);
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`🔗 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`\nAvailable routes:`);
    console.log(`  - POST /api/auth/register - Register new user`);
    console.log(`  - POST /api/auth/login - Login`);
    console.log(`  - GET  /api/auth/me - Get current user`);
    console.log(`  - GET  /api/calendar - Get all events`);
    console.log(`  - GET  /api/calendar/today - Get today's events`);
    console.log(`  - POST /api/calendar - Create event`);
    console.log(`  - GET  /api/shopping - Get all shopping items`);
    console.log(`  - GET  /api/shopping/active - Get active items`);
    console.log(`  - POST /api/shopping - Create shopping item`);
    console.log(`  - POST /api/chat - Chat with AI assistant`);
    console.log(`  - GET  /api/chat/history - Get chat history`);
    console.log(`\n💡 Don't forget to set GOOGLE_API_KEY in .env file for AI chat!\n`);
  });
}

// Export for Vercel
module.exports = app;
