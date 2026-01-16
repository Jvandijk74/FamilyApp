const express = require('express');
const jwt = require('jsonwebtoken');
const supabase = require('../database');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Get all users (Jesse and Monika)
router.get('/users', async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name')
      .order('name');

    if (error) {
      console.error('Supabase select error:', error);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Select user (no password needed)
router.post('/select', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      message: 'User selected successfully',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Select user error:', error);
    res.status(500).json({ error: 'User selection failed' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('id', decoded.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
});

module.exports = router;

