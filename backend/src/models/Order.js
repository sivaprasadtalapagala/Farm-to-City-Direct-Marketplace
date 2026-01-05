const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },

    name: {
      type: String,
      required: true
    },

    quantity: {
      type: Number,
      required: true
    },

    pricePerKg: {
      type: Number,
      required: true
    },

    totalPrice: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    items: [orderItemSchema],

    totalAmount: {
      type: Number,
      required: true
    },

    orderStatus: {
      type: String,
      enum: [
        'placed',
        'confirmed',
        'dispatched',
        'out_for_delivery',
        'delivered'
      ],
      default: 'placed'
    },

    deliveryDate: {
      type: Date,
      required: true
    },

    paymentMethod: {
      type: String,
      enum: ['razorpay'],
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Order', orderSchema);
