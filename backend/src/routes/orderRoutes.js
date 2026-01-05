const express = require('express');
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrdersByDeliveryDate
} = require('../controllers/orderController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('customer'), createOrder);
router.get('/my', protect, authorize('customer'), getMyOrders);
router.get('/by-date', protect, authorize('admin'), getOrdersByDeliveryDate);

module.exports = router;
