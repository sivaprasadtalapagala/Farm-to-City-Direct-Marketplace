const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * @desc    Create new order (checkout)
 * @route   POST /api/orders
 * @access  Customer
 */
const createOrder = async (req, res) => {
  try {
    const { items, deliveryDate } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    let totalAmount = 0;
    const orderItems = [];

    // 🔐 Recalculate prices from DB (never trust frontend)
    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product || !product.isAvailable) {
        return res.status(400).json({ message: 'Product unavailable' });
      }

      const itemTotal = product.pricePerKg * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        pricePerKg: product.pricePerKg,
        totalPrice: itemTotal
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      deliveryDate,
      paymentMethod: 'razorpay',
      paymentStatus: 'pending'
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Order creation failed' });
  }
};

module.exports = { createOrder };
