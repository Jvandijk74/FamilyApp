const express = require('express');
const db = require('../database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all shopping items
router.get('/', (req, res) => {
  try {
    const items = db.prepare(`
      SELECT
        shopping_items.*,
        users.name as user_name
      FROM shopping_items
      JOIN users ON shopping_items.user_id = users.id
      ORDER BY is_completed ASC, created_at DESC
    `).all();

    res.json({ items });
  } catch (error) {
    console.error('Error fetching shopping items:', error);
    res.status(500).json({ error: 'Failed to fetch shopping items' });
  }
});

// Get active (not completed) shopping items
router.get('/active', (req, res) => {
  try {
    const items = db.prepare(`
      SELECT
        shopping_items.*,
        users.name as user_name
      FROM shopping_items
      JOIN users ON shopping_items.user_id = users.id
      WHERE is_completed = 0
      ORDER BY created_at DESC
    `).all();

    res.json({ items });
  } catch (error) {
    console.error('Error fetching active shopping items:', error);
    res.status(500).json({ error: 'Failed to fetch active shopping items' });
  }
});

// Create new shopping item
router.post('/', (req, res) => {
  try {
    const { name, quantity, category } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ error: 'Item name is required' });
    }

    const result = db.prepare(`
      INSERT INTO shopping_items (name, quantity, category, user_id)
      VALUES (?, ?, ?, ?)
    `).run(name, quantity || null, category || null, userId);

    const newItem = db.prepare(`
      SELECT
        shopping_items.*,
        users.name as user_name
      FROM shopping_items
      JOIN users ON shopping_items.user_id = users.id
      WHERE shopping_items.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({ item: newItem });
  } catch (error) {
    console.error('Error creating shopping item:', error);
    res.status(500).json({ error: 'Failed to create shopping item' });
  }
});

// Update shopping item
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, category, is_completed } = req.body;

    const item = db.prepare('SELECT * FROM shopping_items WHERE id = ?').get(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    db.prepare(`
      UPDATE shopping_items
      SET name = ?, quantity = ?, category = ?, is_completed = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      name !== undefined ? name : item.name,
      quantity !== undefined ? quantity : item.quantity,
      category !== undefined ? category : item.category,
      is_completed !== undefined ? is_completed : item.is_completed,
      id
    );

    const updatedItem = db.prepare(`
      SELECT
        shopping_items.*,
        users.name as user_name
      FROM shopping_items
      JOIN users ON shopping_items.user_id = users.id
      WHERE shopping_items.id = ?
    `).get(id);

    res.json({ item: updatedItem });
  } catch (error) {
    console.error('Error updating shopping item:', error);
    res.status(500).json({ error: 'Failed to update shopping item' });
  }
});

// Toggle completion status
router.patch('/:id/toggle', (req, res) => {
  try {
    const { id } = req.params;

    const item = db.prepare('SELECT * FROM shopping_items WHERE id = ?').get(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const newStatus = item.is_completed ? 0 : 1;
    db.prepare(`
      UPDATE shopping_items
      SET is_completed = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(newStatus, id);

    const updatedItem = db.prepare(`
      SELECT
        shopping_items.*,
        users.name as user_name
      FROM shopping_items
      JOIN users ON shopping_items.user_id = users.id
      WHERE shopping_items.id = ?
    `).get(id);

    res.json({ item: updatedItem });
  } catch (error) {
    console.error('Error toggling shopping item:', error);
    res.status(500).json({ error: 'Failed to toggle shopping item' });
  }
});

// Delete shopping item
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const item = db.prepare('SELECT * FROM shopping_items WHERE id = ?').get(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    db.prepare('DELETE FROM shopping_items WHERE id = ?').run(id);

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting shopping item:', error);
    res.status(500).json({ error: 'Failed to delete shopping item' });
  }
});

// Clear all completed items
router.delete('/completed/clear', (req, res) => {
  try {
    db.prepare('DELETE FROM shopping_items WHERE is_completed = 1').run();
    res.json({ message: 'Completed items cleared successfully' });
  } catch (error) {
    console.error('Error clearing completed items:', error);
    res.status(500).json({ error: 'Failed to clear completed items' });
  }
});

module.exports = router;
