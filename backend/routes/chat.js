const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const db = require('../database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Helper function to get context data
function getContextData() {
  // Get today's events
  const today = new Date().toISOString().split('T')[0];
  const todayEvents = db.prepare(`
    SELECT
      calendar_events.*,
      users.name as user_name
    FROM calendar_events
    JOIN users ON calendar_events.user_id = users.id
    WHERE DATE(start_date) = DATE(?)
    ORDER BY start_date ASC
  `).all(today);

  // Get upcoming events (next 7 days)
  const upcomingEvents = db.prepare(`
    SELECT
      calendar_events.*,
      users.name as user_name
    FROM calendar_events
    JOIN users ON calendar_events.user_id = users.id
    WHERE DATE(start_date) >= DATE(?) AND DATE(start_date) <= DATE(?, '+7 days')
    ORDER BY start_date ASC
  `).all(today, today);

  // Get active shopping items
  const activeShoppingItems = db.prepare(`
    SELECT
      shopping_items.*,
      users.name as user_name
    FROM shopping_items
    JOIN users ON shopping_items.user_id = users.id
    WHERE is_completed = 0
    ORDER BY created_at DESC
  `).all();

  // Get all shopping items for context
  const allShoppingItems = db.prepare(`
    SELECT
      shopping_items.*,
      users.name as user_name
    FROM shopping_items
    JOIN users ON shopping_items.user_id = users.id
    ORDER BY is_completed ASC, created_at DESC
  `).all();

  return {
    todayEvents,
    upcomingEvents,
    activeShoppingItems,
    allShoppingItems
  };
}

// Helper function to create system prompt
function createSystemPrompt(contextData, userName) {
  const { todayEvents, upcomingEvents, activeShoppingItems, allShoppingItems } = contextData;

  let prompt = `Je bent een behulpzame AI-assistent voor een familie app. Je helpt Jesse en Monika met hun dagelijkse planning en boodschappen.

Huidige gebruiker: ${userName}

CONTEXT INFORMATIE:

=== Agenda voor Vandaag (${new Date().toLocaleDateString('nl-NL')}) ===
`;

  if (todayEvents.length === 0) {
    prompt += 'Geen afspraken voor vandaag.\n';
  } else {
    todayEvents.forEach(event => {
      const startTime = new Date(event.start_date).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
      prompt += `- ${startTime}: ${event.title}`;
      if (event.description) prompt += ` (${event.description})`;
      if (event.location) prompt += ` @ ${event.location}`;
      prompt += ` [toegevoegd door ${event.user_name}]\n`;
    });
  }

  prompt += '\n=== Komende Afspraken (komende 7 dagen) ===\n';
  if (upcomingEvents.length === 0) {
    prompt += 'Geen komende afspraken.\n';
  } else {
    upcomingEvents.forEach(event => {
      const date = new Date(event.start_date).toLocaleDateString('nl-NL');
      const time = new Date(event.start_date).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
      prompt += `- ${date} ${time}: ${event.title}`;
      if (event.description) prompt += ` (${event.description})`;
      prompt += ` [toegevoegd door ${event.user_name}]\n`;
    });
  }

  prompt += '\n=== Actieve Boodschappenlijst ===\n';
  if (activeShoppingItems.length === 0) {
    prompt += 'Geen actieve boodschappen.\n';
  } else {
    activeShoppingItems.forEach(item => {
      prompt += `- ${item.name}`;
      if (item.quantity) prompt += ` (${item.quantity})`;
      if (item.category) prompt += ` [${item.category}]`;
      prompt += ` - toegevoegd door ${item.user_name}\n`;
    });
  }

  prompt += `\nBeantwoord vragen in het Nederlands en wees vriendelijk en behulpzaam. Als er gevraagd wordt naar "vandaag" of "wat moeten we vandaag doen", gebruik dan de agenda informatie hierboven. Als er gevraagd wordt naar boodschappen, gebruik dan de boodschappenlijst hierboven.

Geef praktische en concrete antwoorden gebaseerd op de context informatie die je hebt.`;

  return prompt;
}

// Chat with AI
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;
    const userName = req.user.name;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({
        error: 'AI chat is not configured. Please add ANTHROPIC_API_KEY to environment variables.'
      });
    }

    // Get context data
    const contextData = getContextData();

    // Create system prompt with context
    const systemPrompt = createSystemPrompt(contextData, userName);

    // Get recent chat history for context (last 5 messages)
    const recentHistory = db.prepare(`
      SELECT message, response
      FROM chat_history
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 5
    `).all(userId);

    // Build messages array (reverse to get chronological order)
    const messages = [];
    recentHistory.reverse().forEach(chat => {
      messages.push({ role: 'user', content: chat.message });
      messages.push({ role: 'assistant', content: chat.response });
    });

    // Add current message
    messages.push({ role: 'user', content: message });

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages
    });

    const aiResponse = response.content[0].text;

    // Save chat history
    db.prepare(`
      INSERT INTO chat_history (user_id, message, response)
      VALUES (?, ?, ?)
    `).run(userId, message, aiResponse);

    res.json({
      message: aiResponse,
      context: {
        todayEventsCount: contextData.todayEvents.length,
        activeShoppingItemsCount: contextData.activeShoppingItems.length
      }
    });
  } catch (error) {
    console.error('Error in chat:', error);

    if (error.status === 401) {
      return res.status(500).json({
        error: 'Invalid API key. Please check your ANTHROPIC_API_KEY.'
      });
    }

    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Get chat history
router.get('/history', (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;

    const history = db.prepare(`
      SELECT
        chat_history.*,
        users.name as user_name
      FROM chat_history
      JOIN users ON chat_history.user_id = users.id
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `).all(userId, limit);

    res.json({ history: history.reverse() });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Clear chat history
router.delete('/history', (req, res) => {
  try {
    const userId = req.user.id;
    db.prepare('DELETE FROM chat_history WHERE user_id = ?').run(userId);
    res.json({ message: 'Chat history cleared successfully' });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
});

module.exports = router;
