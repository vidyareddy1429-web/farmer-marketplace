const express = require('express');
const router = express.Router();
const { addReview, getProductReviews } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('customer'), addReview);
router.get('/product/:productId', getProductReviews);

module.exports = router;
