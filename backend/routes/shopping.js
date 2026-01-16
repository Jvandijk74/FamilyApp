const express = require('express');
const supabase = require('../database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all shopping items
router.get('/', async (req, res) => {
  try {
    const { data: items, error } = await supabase
      .from('shopping_items')
      .select(`
        *,
        users (name)
      `)
      .order('is_completed', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform data to match expected format
    const transformedItems = items.map(item => ({
      ...item,
      user_name: item.users?.name
    }));

    res.json({ items: transformedItems });
  } catch (error) {
    console.error('Error fetching shopping items:', error);
    res.status(500).json({ error: 'Failed to fetch shopping items' });
  }
});

// Get active (not completed) shopping items
router.get('/active', async (req, res) => {
  try {
    const { data: items, error } = await supabase
      .from('shopping_items')
      .select(`
        *,
        users (name)
      `)
      .eq('is_completed', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform data to match expected format
    const transformedItems = items.map(item => ({
      ...item,
      user_name: item.users?.name
    }));

    res.json({ items: transformedItems });
  } catch (error) {
    console.error('Error fetching active shopping items:', error);
    res.status(500).json({ error: 'Failed to fetch active shopping items' });
  }
});

// Create new shopping item
router.post('/', async (req, res) => {
  try {
    const { name, quantity, category } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ error: 'Item name is required' });
    }

    const { data: newItem, error } = await supabase
      .from('shopping_items')
      .insert([{
        name,
        quantity: quantity || null,
        category: category || null,
        user_id: userId
      }])
      .select(`
        *,
        users (name)
      `)
      .single();

    if (error) throw error;

    // Transform data to match expected format
    const transformedItem = {
      ...newItem,
      user_name: newItem.users?.name
    };

    res.status(201).json({ item: transformedItem });
  } catch (error) {
    console.error('Error creating shopping item:', error);
    res.status(500).json({ error: 'Failed to create shopping item' });
  }
});

// Update shopping item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, category, is_completed } = req.body;

    // Check if item exists
    const { data: existingItem, error: fetchError } = await supabase
      .from('shopping_items')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Update item
    const { data: updatedItem, error } = await supabase
      .from('shopping_items')
      .update({
        name: name !== undefined ? name : existingItem.name,
        quantity: quantity !== undefined ? quantity : existingItem.quantity,
        category: category !== undefined ? category : existingItem.category,
        is_completed: is_completed !== undefined ? is_completed : existingItem.is_completed
      })
      .eq('id', id)
      .select(`
        *,
        users (name)
      `)
      .single();

    if (error) throw error;

    // Transform data to match expected format
    const transformedItem = {
      ...updatedItem,
      user_name: updatedItem.users?.name
    };

    res.json({ item: transformedItem });
  } catch (error) {
    console.error('Error updating shopping item:', error);
    res.status(500).json({ error: 'Failed to update shopping item' });
  }
});

// Toggle completion status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if item exists
    const { data: existingItem, error: fetchError } = await supabase
      .from('shopping_items')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const newStatus = !existingItem.is_completed;

    // Update item
    const { data: updatedItem, error } = await supabase
      .from('shopping_items')
      .update({ is_completed: newStatus })
      .eq('id', id)
      .select(`
        *,
        users (name)
      `)
      .single();

    if (error) throw error;

    // Transform data to match expected format
    const transformedItem = {
      ...updatedItem,
      user_name: updatedItem.users?.name
    };

    res.json({ item: transformedItem });
  } catch (error) {
    console.error('Error toggling shopping item:', error);
    res.status(500).json({ error: 'Failed to toggle shopping item' });
  }
});

// Delete shopping item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if item exists
    const { data: existingItem, error: fetchError } = await supabase
      .from('shopping_items')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Delete item
    const { error } = await supabase
      .from('shopping_items')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting shopping item:', error);
    res.status(500).json({ error: 'Failed to delete shopping item' });
  }
});

// Clear all completed items
router.delete('/completed/clear', async (req, res) => {
  try {
    const { error } = await supabase
      .from('shopping_items')
      .delete()
      .eq('is_completed', true);

    if (error) throw error;

    res.json({ message: 'Completed items cleared successfully' });
  } catch (error) {
    console.error('Error clearing completed items:', error);
    res.status(500).json({ error: 'Failed to clear completed items' });
  }
});

module.exports = router;
