const { body } = require('express-validator');

exports.verifyPaymentValidator = [
  body('orderId')
    .notEmpty().withMessage('Order ID required'),

  body('razorpayOrderId')
    .notEmpty().withMessage('Razorpay order ID required'),

  body('razorpayPaymentId')
    .notEmpty().withMessage('Razorpay payment ID required'),

  body('razorpaySignature')
    .notEmpty().withMessage('Razorpay signature required')
];
