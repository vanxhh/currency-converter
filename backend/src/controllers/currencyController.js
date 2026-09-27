const exchangeService = require('../services/exchangeService');
const db = require('../config/database');

class CurrencyController {
  async convert(req, res) {
    try {
      const { source, target, amount } = req.body;
      
      if (!source || !target || !amount) {
        return res.status(400).json({ error: 'Missing required fields: source, target, amount' });
      }

      const { rate, result } = await exchangeService.convertCurrency(source, target, Number(amount));

      // Save conversion history locally
      const query = `INSERT INTO conversion_history (source_currency, target_currency, amount, result, rate) VALUES (?, ?, ?, ?, ?)`;
      db.run(query, [source, target, amount, result, rate]);

      return res.json({ source, target, amount, rate, result });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  getHistory(req, res) {
    const query = `SELECT * FROM conversion_history ORDER BY created_at DESC LIMIT 10`;
    db.all(query, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      return res.json(rows);
    });
  }

  getFavorites(req, res) {
    const query = `SELECT * FROM favorites`;
    db.all(query, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      return res.json(rows);
    });
  }

  addFavorite(req, res) {
    const { source, target } = req.body;
    if (!source || !target) {
      return res.status(400).json({ error: 'Source and target currencies are required' });
    }

    const query = `INSERT OR IGNORE INTO favorites (source_currency, target_currency) VALUES (?, ?)`;
    db.run(query, [source, target], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      return res.json({ id: this.lastID, source, target });
    });
  }
}

module.exports = new CurrencyController();