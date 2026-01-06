const express = require('express');
const router = express.Router();

const { createRazorpayOrder } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post(
  '/razorpay/create',
  protect,
  authorize('customer'),
  createRazorpayOrder
);

module.exports = router;
