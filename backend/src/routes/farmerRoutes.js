const express = require('express');
const router = express.Router();

const { getDailyDemand } = require('../controllers/farmerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/demand', protect, authorize('farmer'), getDailyDemand);

module.exports = router;
