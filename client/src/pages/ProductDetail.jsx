import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { MapPin, ShoppingCart, Star, User, ShieldCheck, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user, isCustomer } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const fetchProductData = async () => {
    try {
      const { data } = await API.get(`/products/${id}`);
      if (data.success) {
        setProduct(data.product);
      }

      const revRes = await API.get(`/reviews/product/${id}`);
      if (revRes.data.success) {
        setReviews(revRes.data.reviews);
        setAvgRating(revRes.data.avgRating);
      }
    } catch (error) {
      console.error('Error fetching product detail', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSubmitting(true);

    try {
      const { data } = await API.post('/reviews', {
        productId: id,
        rating: newRating,
        comment: newComment,
      });

      if (data.success) {
        setNewComment('');
        fetchProductData();
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Product not found</h2>
        <Link to="/products" className="text-emerald-600 font-bold hover:underline">
          Return to Produce Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.quantity <= 0;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12">
      <Link to="/products" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600">
        <ArrowLeft className="w-4 h-4" /> Back to Products Catalog
      </Link>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl">
        {/* Product Image */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-100 h-96 border border-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600';
            }}
          />
          <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {product.category}
          </span>
        </div>

        {/* Product Specs & Purchase */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Farm Location: {product.location || 'Local Farm, India'}
              </span>
              {avgRating > 0 && (
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  {avgRating} ({reviews.length} reviews)
                </div>
              )}
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900">{product.name}</h1>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-700">
                ₹{product.price}
              </span>
              <span className="text-slate-500 font-medium text-sm">/ {product.unit}</span>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">
              {product.description || 'Fresh, naturally grown produce direct from Indian farmers.'}
            </p>

            {/* Farmer Card */}
            {product.farmer && (
              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100 space-y-1 text-xs text-slate-700">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span className="flex items-center gap-1.5 text-emerald-800">
                    <User className="w-4 h-4 text-emerald-600" />
                    Kisan (Producer): {product.farmer.farmName || product.farmer.name}
                  </span>
                  {product.farmer.isApproved && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" /> Verified Indian Farmer
                    </span>
                  )}
                </div>
                <p className="text-slate-600 font-medium">📍 Farm Address: {product.farmer.location || product.location}</p>
                <p className="text-slate-500">Contact: {product.farmer.phone || 'Available after ordering'}</p>
              </div>
            )}

            {/* Stock status indicator */}
            <div className="text-xs font-bold">
              {isOutOfStock ? (
                <span className="text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> Out of stock currently
                </span>
              ) : (
                <span className="text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Available Stock: {product.quantity} {product.unit}
                </span>
              )}
            </div>
          </div>

          {/* Action section */}
          {!isOutOfStock && (
            <div className="pt-4 border-t border-slate-100 flex items-center gap-4">
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                <button
                  onClick={() => setQty((prev) => Math.max(prev - 1, 1))}
                  className="px-3 py-1 text-slate-600 font-bold hover:bg-slate-200 rounded-lg text-sm"
                >
                  -
                </button>
                <span className="px-4 text-sm font-bold text-slate-800">{qty}</span>
                <button
                  onClick={() => setQty((prev) => Math.min(prev + 1, product.quantity))}
                  className="px-3 py-1 text-slate-600 font-bold hover:bg-slate-200 rounded-lg text-sm"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => addToCart(product, qty)}
                className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 text-sm flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingCart className="w-4 h-4" /> Add {qty} {product.unit} to Cart
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Customer Reviews ({reviews.length})
        </h3>

        {/* Submit Review */}
        {isCustomer && (
          <form onSubmit={handleReviewSubmit} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Write a Review</h4>
            {reviewError && (
              <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{reviewError}</p>
            )}

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Rating:</span>
              <select
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                className="py-1 px-3 rounded-lg border border-slate-200 text-xs font-bold bg-white"
              >
                <option value={5}>5 Stars - Excellent Freshness</option>
                <option value={4}>4 Stars - Great Quality</option>
                <option value={3}>3 Stars - Average</option>
                <option value={2}>2 Stars - Below Expectations</option>
                <option value={1}>1 Star - Poor</option>
              </select>
            </div>

            <textarea
              required
              rows={2}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your feedback about this produce..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            ></textarea>

            <button
              type="submit"
              disabled={reviewSubmitting}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
            >
              {reviewSubmitting ? 'Posting...' : 'Post Review'}
            </button>
          </form>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No reviews posted yet for this produce.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev._id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{rev.customer?.name || 'Verified Buyer'}</span>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600">{rev.comment}</p>
                <span className="text-[10px] text-slate-400 block pt-1">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
