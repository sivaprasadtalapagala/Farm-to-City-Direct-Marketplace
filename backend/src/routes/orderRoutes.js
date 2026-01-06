const express = require('express');
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrdersByDeliveryDate,
  updateOrderStatus,
  getOrderTimeline 
} = require('../controllers/orderController');

const { protect, authorize } = require('../middleware/authMiddleware');

const { createOrderValidator } = require('../validators/orderValidators');
const validateRequest = require('../middleware/validateRequest');



router.post('/', protect, authorize('customer'), createOrderValidator, validateRequest, createOrder);
router.get('/my', protect, authorize('customer'), getMyOrders);
router.get('/by-date', protect, authorize('admin'), getOrdersByDeliveryDate);
router.patch('/:id/status', protect, authorize('admin'), updateOrderStatus);
router.get(
  '/:id/timeline',
  protect,
  authorize('customer'),
  getOrderTimeline
);

module.exports = router;
