const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const supabase = require('../database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Helper function to get context data
async function getContextData() {
  // Get today's events
  const today = new Date().toISOString().split('T')[0];
  const { data: todayEvents } = await supabase
    .from('calendar_events')
    .select(`
      *,
      users (name)
    `)
    .gte('start_date', `${today}T00:00:00`)
    .lt('start_date', `${today}T23:59:59`)
    .order('start_date', { ascending: true });

  // Get upcoming events (next 7 days)
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const { data: upcomingEvents } = await supabase
    .from('calendar_events')
    .select(`
      *,
      users (name)
    `)
    .gte('start_date', `${today}T00:00:00`)
    .lte('start_date', nextWeek.toISOString())
    .order('start_date', { ascending: true });

  // Get active shopping items
  const { data: activeShoppingItems } = await supabase
    .from('shopping_items')
    .select(`
      *,
      users (name)
    `)
    .eq('is_completed', false)
    .order('created_at', { ascending: false });

  // Get all shopping items for context
  const { data: allShoppingItems } = await supabase
    .from('shopping_items')
    .select(`
      *,
      users (name)
    `)
    .order('is_completed', { ascending: true })
    .order('created_at', { ascending: false });

  return {
    todayEvents: todayEvents || [],
    upcomingEvents: upcomingEvents || [],
    activeShoppingItems: activeShoppingItems || [],
    allShoppingItems: allShoppingItems || []
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
      prompt += ` [toegevoegd door ${event.users?.name}]\n`;
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
      prompt += ` [toegevoegd door ${event.users?.name}]\n`;
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
      prompt += ` - toegevoegd door ${item.users?.name}\n`;
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
    const contextData = await getContextData();

    // Create system prompt with context
    const systemPrompt = createSystemPrompt(contextData, userName);

    // Get recent chat history for context (last 5 messages)
    const { data: recentHistory } = await supabase
      .from('chat_history')
      .select('message, response')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    // Build messages array (reverse to get chronological order)
    const messages = [];
    if (recentHistory) {
      recentHistory.reverse().forEach(chat => {
        messages.push({ role: 'user', content: chat.message });
        messages.push({ role: 'assistant', content: chat.response });
      });
    }

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
    await supabase
      .from('chat_history')
      .insert([{
        user_id: userId,
        message,
        response: aiResponse
      }]);

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
router.get('/history', async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;

    const { data: history, error } = await supabase
      .from('chat_history')
      .select(`
        *,
        users (name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Transform data to match expected format
    const transformedHistory = (history || []).map(chat => ({
      ...chat,
      user_name: chat.users?.name
    }));

    res.json({ history: transformedHistory.reverse() });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Clear chat history
router.delete('/history', async (req, res) => {
  try {
    const userId = req.user.id;

    const { error } = await supabase
      .from('chat_history')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ message: 'Chat history cleared successfully' });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
});

module.exports = router;
