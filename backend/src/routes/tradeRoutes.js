const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradeController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware.protect);

// Trade routes
router.post('/', tradeController.createTrade);
router.get('/', tradeController.getTrades);
router.get('/stats', tradeController.getTradeStats);
router.get('/:id', tradeController.getTrade);
router.put('/:id', tradeController.updateTrade);
router.delete('/:id', tradeController.deleteTrade);

module.exports = router;
