const express = require('express');
const supabase = require('../database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all calendar events (for both users)
router.get('/', async (req, res) => {
  try {
    const { data: events, error } = await supabase
      .from('calendar_events')
      .select(`
        *,
        users (name)
      `)
      .order('start_date', { ascending: true });

    if (error) throw error;

    // Transform data to match expected format
    const transformedEvents = events.map(event => ({
      ...event,
      user_name: event.users?.name
    }));

    res.json({ events: transformedEvents });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get events for today
router.get('/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data: events, error } = await supabase
      .from('calendar_events')
      .select(`
        *,
        users (name)
      `)
      .gte('start_date', `${today}T00:00:00`)
      .lt('start_date', `${today}T23:59:59`)
      .order('start_date', { ascending: true });

    if (error) throw error;

    // Transform data to match expected format
    const transformedEvents = events.map(event => ({
      ...event,
      user_name: event.users?.name
    }));

    res.json({ events: transformedEvents });
  } catch (error) {
    console.error('Error fetching today events:', error);
    res.status(500).json({ error: 'Failed to fetch today events' });
  }
});

// Create new calendar event
router.post('/', async (req, res) => {
  try {
    const { title, description, start_date, end_date, location } = req.body;
    const userId = req.user.id;

    if (!title || !start_date) {
      return res.status(400).json({ error: 'Title and start date are required' });
    }

    const { data: newEvent, error } = await supabase
      .from('calendar_events')
      .insert([{
        title,
        description: description || null,
        start_date,
        end_date: end_date || null,
        location: location || null,
        user_id: userId
      }])
      .select(`
        *,
        users (name)
      `)
      .single();

    if (error) throw error;

    // Transform data to match expected format
    const transformedEvent = {
      ...newEvent,
      user_name: newEvent.users?.name
    };

    res.status(201).json({ event: transformedEvent });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update calendar event
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, start_date, end_date, location } = req.body;

    // Check if event exists
    const { data: existingEvent, error: fetchError } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Update event
    const { data: updatedEvent, error } = await supabase
      .from('calendar_events')
      .update({
        title,
        description: description || null,
        start_date,
        end_date: end_date || null,
        location: location || null
      })
      .eq('id', id)
      .select(`
        *,
        users (name)
      `)
      .single();

    if (error) throw error;

    // Transform data to match expected format
    const transformedEvent = {
      ...updatedEvent,
      user_name: updatedEvent.users?.name
    };

    res.json({ event: transformedEvent });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete calendar event
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if event exists
    const { data: existingEvent, error: fetchError } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Delete event
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router;
