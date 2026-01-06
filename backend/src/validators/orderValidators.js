const { body } = require('express-validator');
const mongoose = require('mongoose');

exports.createOrderValidator = [
  body('deliveryDate')
    .isISO8601().withMessage('Invalid delivery date'),

  body('items')
    .isArray({ min: 1 }).withMessage('Order items required'),

  body('items.*.productId')
    .custom(value => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid product ID'),

  body('items.*.quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];
