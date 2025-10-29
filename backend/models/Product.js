const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['vegetables', 'fruits', 'grains', 'dairy', 'meat', 'herbs', 'other']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'lb', 'piece', 'dozen', 'liter', 'gallon']
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: [{
    type: String
  }],
  isOrganic: {
    type: Boolean,
    default: false
  },
  harvestDate: {
    type: Date
  },
  expiryDate: {
    type: Date
  },
  location: {
    latitude: Number,
    longitude: Number
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      required: true,
      maxlength: 500
    },
    images: [{
      type: String
    }],
    helpful: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    verified: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate average rating
productSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = Math.round((sum / this.reviews.length) * 10) / 10;
  }
};

// Get review statistics
productSchema.methods.getReviewStats = function () {
  const stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  this.reviews.forEach(review => {
    stats[review.rating]++;
  });
  return stats;
};

module.exports = mongoose.model('Product', productSchema);