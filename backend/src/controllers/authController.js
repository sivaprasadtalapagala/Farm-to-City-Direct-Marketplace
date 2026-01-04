const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register new customer
// @route   POST /api/auth/register
// @access  Public
const registerCustomer = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // 1️⃣ Basic validation
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 2️⃣ Check if user already exists
    const userExists = await User.findOne({
      $or: [{ email }, { mobile }]
    });

    if (userExists) {
      return res.status(400).json({
        message: 'User already exists with this email or mobile'
      });
    }

    // 3️⃣ Create user (password hashing happens automatically)
    const user = await User.create({
      name,
      email,
      mobile,
      password,
      role: 'customer'
    });

    // 4️⃣ Send response with JWT
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerCustomer };
