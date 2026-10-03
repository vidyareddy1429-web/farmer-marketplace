const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Add review for a product
// @route   POST /api/reviews
// @access  Private (Customer)
exports.addReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const alreadyReviewed = await Review.findOne({
      product: productId,
      customer: req.user._id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      product: productId,
      customer: req.user._id,
      rating: Number(rating),
      comment,
    });

    await review.populate('customer', 'name');

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('customer', 'name')
      .sort({ createdAt: -1 });

    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length).toFixed(1)
        : 0;

    res.json({
      success: true,
      count: reviews.length,
      avgRating: Number(avgRating),
      reviews,
    });
  } catch (error) {
    next(error);
  }
};
