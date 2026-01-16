const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'familyapp.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database tables
function initializeDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Calendar events table
  db.exec(`
    CREATE TABLE IF NOT EXISTS calendar_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      start_date DATETIME NOT NULL,
      end_date DATETIME,
      location TEXT,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Shopping list items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS shopping_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity TEXT,
      category TEXT,
      is_completed BOOLEAN DEFAULT 0,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Chat history table for AI context
  db.exec(`
    CREATE TABLE IF NOT EXISTS chat_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      response TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  console.log('Database initialized successfully');
}

initializeDatabase();

module.exports = db;
