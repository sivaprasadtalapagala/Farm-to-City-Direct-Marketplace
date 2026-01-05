const express = require('express');
const router = express.Router();

const { createOrder, getMyOrders } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('customer'), createOrder);
router.get('/my', protect, authorize('customer'), getMyOrders);

module.exports = router;
