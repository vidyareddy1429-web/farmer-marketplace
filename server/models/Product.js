const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Vegetables', 'Fruits', 'Dairy', 'Grains', 'Organic', 'Spices', 'Other'],
      default: 'Vegetables',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be greater than or equal to 0'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity/Stock is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    unit: {
      type: String,
      required: true,
      default: 'kg',
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      default: 'Local Farm',
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Product', productSchema);
