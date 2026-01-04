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

// @desc    Login user (customer / farmer / admin)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // 1️⃣ Basic validation
    if (!identifier || !password) {
      return res.status(400).json({ message: 'Identifier and password are required' });
    }

    // 2️⃣ Find user by email OR mobile
    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }]
    }).select('+password'); // explicitly fetch password

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3️⃣ Compare password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 4️⃣ Success response with JWT
    res.json({
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


module.exports = { registerCustomer, loginUser };
