const express = require('express');
const router = express.Router();

const { createOrder } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('customer'), createOrder);

module.exports = router;
