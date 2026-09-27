const db = require('../config/database');

class FavoritesController {
  // Get all user-defined favorite currency pairs
  getFavorites(req, res) {
    const query = `SELECT * FROM favorites ORDER BY id DESC`;
    db.all(query, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      return res.json(rows);
    });
  }

  // Add a new currency pair to favorites
  addFavorite(req, res) {
    const { source_currency, target_currency } = req.body;
    
    if (!source_currency || !target_currency) {
      return res.status(400).json({ error: 'source_currency and target_currency are required' });
    }

    const query = `INSERT OR IGNORE INTO favorites (source_currency, target_currency) VALUES (?, ?)`;
    db.run(query, [source_currency, target_currency], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // If changes === 0, it means the pair already exists due to the UNIQUE constraint
      if (this.changes === 0) {
        return res.status(409).json({ message: 'Currency pair is already in favorites.' });
      }

      return res.status(201).json({ 
        id: this.lastID, 
        source_currency, 
        target_currency 
      });
    });
  }

  // Remove a favorite currency pair by ID
  removeFavorite(req, res) {
    const { id } = req.params;

    const query = `DELETE FROM favorites WHERE id = ?`;
    db.run(query, [id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Favorite pair not found.' });
      }

      return res.json({ message: 'Favorite removed successfully', id });
    });
  }
}

module.exports = new FavoritesController();