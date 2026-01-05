const Order = require('../models/Order');

/**
 * @desc    Get daily product demand for farmers
 * @route   GET /api/farmer/demand?date=YYYY-MM-DD
 * @access  Farmer
 */
const getDailyDemand = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const demand = await Order.aggregate([
      {
        $match: {
          deliveryDate: { $gte: start, $lte: end },
          paymentStatus: 'pending'
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          productName: { $first: '$items.name' },
          totalQty: { $sum: '$items.quantity' }
        }
      },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          productName: 1,
          totalQty: 1
        }
      },
      { $sort: { productName: 1 } }
    ]);

    res.json(demand);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch farmer demand' });
  }
};

module.exports = { getDailyDemand };
