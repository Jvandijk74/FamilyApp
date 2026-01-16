const express = require('express');
const db = require('../database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all calendar events (for both users)
router.get('/', (req, res) => {
  try {
    const events = db.prepare(`
      SELECT
        calendar_events.*,
        users.name as user_name
      FROM calendar_events
      JOIN users ON calendar_events.user_id = users.id
      ORDER BY start_date ASC
    `).all();

    res.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get events for today
router.get('/today', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const events = db.prepare(`
      SELECT
        calendar_events.*,
        users.name as user_name
      FROM calendar_events
      JOIN users ON calendar_events.user_id = users.id
      WHERE DATE(start_date) = DATE(?)
      ORDER BY start_date ASC
    `).all(today);

    res.json({ events });
  } catch (error) {
    console.error('Error fetching today events:', error);
    res.status(500).json({ error: 'Failed to fetch today events' });
  }
});

// Create new calendar event
router.post('/', (req, res) => {
  try {
    const { title, description, start_date, end_date, location } = req.body;
    const userId = req.user.id;

    if (!title || !start_date) {
      return res.status(400).json({ error: 'Title and start date are required' });
    }

    const result = db.prepare(`
      INSERT INTO calendar_events (title, description, start_date, end_date, location, user_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(title, description || null, start_date, end_date || null, location || null, userId);

    const newEvent = db.prepare(`
      SELECT
        calendar_events.*,
        users.name as user_name
      FROM calendar_events
      JOIN users ON calendar_events.user_id = users.id
      WHERE calendar_events.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({ event: newEvent });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update calendar event
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, start_date, end_date, location } = req.body;

    const event = db.prepare('SELECT * FROM calendar_events WHERE id = ?').get(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    db.prepare(`
      UPDATE calendar_events
      SET title = ?, description = ?, start_date = ?, end_date = ?, location = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, description || null, start_date, end_date || null, location || null, id);

    const updatedEvent = db.prepare(`
      SELECT
        calendar_events.*,
        users.name as user_name
      FROM calendar_events
      JOIN users ON calendar_events.user_id = users.id
      WHERE calendar_events.id = ?
    `).get(id);

    res.json({ event: updatedEvent });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete calendar event
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const event = db.prepare('SELECT * FROM calendar_events WHERE id = ?').get(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    db.prepare('DELETE FROM calendar_events WHERE id = ?').run(id);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router;
