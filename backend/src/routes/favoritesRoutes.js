const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');

// GET /api/favorites - Retrieve all saved favorites
router.get('/', (req, res) => favoritesController.getFavorites(req, res));

// POST /api/favorites - Add a new favorite pair
router.post('/', (req, res) => favoritesController.addFavorite(req, res));

// DELETE /api/favorites/:id - Remove a favorite pair by its ID
router.delete('/:id', (req, res) => favoritesController.removeFavorite(req, res));

module.exports = router;