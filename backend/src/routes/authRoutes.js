const express = require('express');
const router = express.Router();

const { registerCustomer, loginUser } = require('../controllers/authController');

const validateRequest = require('../middleware/validateRequest');
const { registerValidator, loginValidator } = require('../validators/authValidators');

router.post('/register', registerValidator, validateRequest, registerCustomer);
router.post('/login', loginValidator, validateRequest, loginUser);

module.exports = router;
