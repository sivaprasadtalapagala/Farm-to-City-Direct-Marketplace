const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      enum: ['vegetable', 'fruit'],
      required: true
    },

    pricePerKg: {
      type: Number,
      required: true
    },

    unit: {
      type: String,
      default: 'kg'
    },

    imageUrl: {
      type: String
    },

    isAvailable: {
      type: Boolean,
      default: true
    },

    minOrderQty: {
      type: Number,
      default: 1
    },

    bulkPricing: [
      {
        minQty: Number,
        pricePerKg: Number
      }
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
