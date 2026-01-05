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


/**
 * @desc    Get logged-in user's orders
 * @route   GET /api/orders/my
 * @access  Customer
 */
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};



/**
 * @desc    Get orders by delivery date (Admin)
 * @route   GET /api/orders/by-date?date=YYYY-MM-DD
 * @access  Admin
 */
const getOrdersByDeliveryDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Delivery date is required' });
    }

    // Create date range for the full day
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      deliveryDate: { $gte: start, $lte: end }
    })
      .populate('user', 'name mobile')
      .sort({ createdAt: 1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch orders by date' });
  }
};


/**
 * @desc    Update order status (Admin)
 * @route   PATCH /api/orders/:id/status
 * @access  Admin
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const allowedStatuses = [
      'placed',
      'confirmed',
      'dispatched',
      'out_for_delivery',
      'delivered'
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Optional: prevent backward status change
    const currentIndex = allowedStatuses.indexOf(order.orderStatus);
    const newIndex = allowedStatuses.indexOf(status);

    if (newIndex < currentIndex) {
      return res.status(400).json({
        message: 'Order status cannot be moved backward'
      });
    }

    order.orderStatus = status;
    await order.save();

    res.json({
      message: 'Order status updated',
      orderId: order._id,
      status: order.orderStatus
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};



/**
 * @desc    Get order status timeline for customer
 * @route   GET /api/orders/:id/timeline
 * @access  Customer
 */
const getOrderTimeline = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure customer accesses only own order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const statusSteps = [
      'placed',
      'confirmed',
      'dispatched',
      'out_for_delivery',
      'delivered'
    ];

    const timeline = statusSteps.map((step) => ({
      status: step,
      completed: statusSteps.indexOf(step) <=
        statusSteps.indexOf(order.orderStatus)
    }));

    // Delivery message
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const delivery = new Date(order.deliveryDate);
    delivery.setHours(0, 0, 0, 0);

    let deliveryMessage = 'Scheduled';

    if (delivery.getTime() === today.getTime()) {
      deliveryMessage = 'Arriving Today';
    } else if (delivery > today) {
      deliveryMessage = 'Arriving Tomorrow';
    }

    res.json({
      orderId: order._id,
      orderStatus: order.orderStatus,
      timeline,
      deliveryMessage
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch order timeline' });
  }
};




module.exports = {
  createOrder,
  getMyOrders,
  getOrdersByDeliveryDate,
  updateOrderStatus,
  getOrderTimeline
};


