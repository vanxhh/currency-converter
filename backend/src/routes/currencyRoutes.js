const express = require('express');
const router = express.Router();
const controller = require('../controllers/currencyController');

router.post('/convert', (req, res) => controller.convert(req, res));
router.get('/history', (req, res) => controller.getHistory(req, res));
router.get('/favorites', (req, res) => controller.getFavorites(req, res));
router.post('/favorites', (req, res) => controller.addFavorite(req, res));

module.exports = router;