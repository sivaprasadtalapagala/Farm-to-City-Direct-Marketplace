const Razorpay = require('razorpay');
const Order = require('../models/Order');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/**
 * @desc    Create Razorpay order
 * @route   POST /api/payments/razorpay/create
 * @access  Customer
 */
const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure only owner can pay
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Amount in paise
    const amount = order.totalAmount * 100;

    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `order_${order._id}`
    });

    res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create Razorpay order' });
  }
};



const crypto = require('crypto');

/**
 * @desc    Verify Razorpay payment
 * @route   POST /api/payments/razorpay/verify
 * @access  Customer
 */
const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    } = req.body;

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: 'Missing payment verification data' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // 🔐 Generate signature
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // ✅ Payment verified
    order.paymentStatus = 'paid';
    order.paymentResult = {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    };

    await order.save();

    res.json({
      message: 'Payment verified successfully',
      orderId: order._id,
      paymentStatus: order.paymentStatus
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Payment verification failed' });
  }
};


module.exports = { createRazorpayOrder, verifyRazorpayPayment };
