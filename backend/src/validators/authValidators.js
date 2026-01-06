const { body } = require('express-validator');

exports.registerValidator = [
  body('name')
    .notEmpty().withMessage('Name is required'),

  body('email')
    .isEmail().withMessage('Invalid email'),

  body('mobile')
    .isMobilePhone('en-IN').withMessage('Invalid mobile number'),

  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

exports.loginValidator = [
  body('identifier')
    .notEmpty().withMessage('Email or mobile is required'),

  body('password')
    .notEmpty().withMessage('Password is required')
];
