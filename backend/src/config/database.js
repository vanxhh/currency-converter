const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening SQLite database', err.message);
  } else {
    console.log('Connected to local SQLite database.');
  }
});

// Create tables for conversion history and favorites
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS conversion_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_currency TEXT NOT NULL,
    target_currency TEXT NOT NULL,
    amount REAL NOT NULL,
    result REAL NOT NULL,
    rate REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_currency TEXT NOT NULL,
    target_currency TEXT NOT NULL,
    UNIQUE(source_currency, target_currency)
  )`);
});

module.exports = db;