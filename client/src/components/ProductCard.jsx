import { Link } from 'react-router-dom';
import { MapPin, ShoppingCart, CheckCircle2, XCircle, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isFarmer, isAdmin } = useAuth();

  const isOutOfStock = product.quantity <= 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Image Banner */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600';
          }}
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-100 shadow-sm">
          {product.category}
        </div>
        <div
          className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1 shadow-sm ${
            isOutOfStock
              ? 'bg-red-500/90 text-white'
              : 'bg-emerald-500/90 text-white'
          }`}
        >
          {isOutOfStock ? (
            <>
              <XCircle className="w-3.5 h-3.5" /> Out of Stock
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" /> {product.quantity} {product.unit} left
            </>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center text-slate-600 text-xs font-semibold gap-1 mb-1 bg-emerald-50/80 px-2 py-0.5 rounded-lg w-fit">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{product.location || 'Local Farm, India'}</span>
          </div>

          <Link to={`/products/${product._id}`}>
            <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-600 transition-colors line-clamp-1 mt-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
            {product.description || 'Fresh harvest grown directly by local Indian farmers.'}
          </p>

          {/* Farmer info */}
          {product.farmer && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">
                Farmer: <strong className="text-slate-800 font-semibold">{product.farmer.farmName || product.farmer.name}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <span className="text-xl font-extrabold text-emerald-700">
              ₹{product.price}
              <span className="text-xs font-normal text-slate-500"> / {product.unit}</span>
            </span>
          </div>

          {!isFarmer && !isAdmin && (
            <button
              onClick={() => addToCart(product, 1)}
              disabled={isOutOfStock}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                isOutOfStock
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 active:scale-95'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add
            </button>
          )}

          {(isFarmer || isAdmin) && (
            <Link
              to={`/products/${product._id}`}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
