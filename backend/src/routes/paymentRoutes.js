const express = require('express');
const router = express.Router();

const { createRazorpayOrder } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { verifyRazorpayPayment } = require('../controllers/paymentController');

const { verifyPaymentValidator } = require('../validators/paymentValidators');
const validateRequest = require('../middleware/validateRequest');



router.post(
  '/razorpay/create',
  protect,
  authorize('customer'),
  createRazorpayOrder
);

router.post('/razorpay/verify', protect, authorize('customer'), verifyPaymentValidator, validateRequest, verifyRazorpayPayment);

module.exports = router;
